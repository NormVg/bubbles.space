import { eq, and, like, or, isNull, isNotNull, lte, gt, gte, desc, sql } from 'drizzle-orm';
import { db } from '../db';
import { memory } from '../db/schema';
import { randomUUID } from 'crypto';
import { OpenRouter } from '@openrouter/sdk';

export type MemoryInsert = typeof memory.$inferInsert;
export type MemorySelect = typeof memory.$inferSelect;

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

const embeddingCache = new Map<string, number[]>();
const MAX_CACHE_SIZE = 1000;

async function generateEmbedding(text: string): Promise<number[] | null> {
  if (!text) return null;
  
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!;
  }
  
  try {
    const embedding = await openrouter.embeddings.generate({
      requestBody: {
        model: "nvidia/llama-nemotron-embed-vl-1b-v2:free",
        input: [text],
        encodingFormat: "float"
      }
    });
    const result = (embedding as any).data[0].embedding;
    
    if (embeddingCache.size >= MAX_CACHE_SIZE) {
      const firstKey = embeddingCache.keys().next().value;
      if (firstKey) embeddingCache.delete(firstKey);
    }
    embeddingCache.set(text, result);
    
    return result;
  } catch (error) {
    console.error('Failed to generate embedding:', error);
    return null;
  }
}

/**
 * Confidence decay factor per day of no access.
 * 0.998^347 ≈ 0.5 → confidence halves after ~1 year of zero access.
 */
const CONFIDENCE_DECAY_FACTOR = 0.998;

/**
 * The 8 predefined cognitive directories.
 * Seeded lazily on first access per user.
 */
const PREDEFINED_DIRECTORIES = [
  { path: 'working',   title: 'Working Memory',   description: 'Current task context, scratch notes, active goals' },
  { path: 'episodic',  title: 'Episodic Memory',   description: 'Specific events, conversations, dated occurrences' },
  { path: 'semantic',  title: 'Semantic Memory',   description: 'General knowledge, facts, definitions, concepts' },
  { path: 'procedural',title: 'Procedural Memory',  description: 'How-to knowledge, workflows, recipes, commands' },
  { path: 'identity',  title: 'Identity Memory',   description: 'User preferences, personality traits, self-descriptions' },
  { path: 'hot',       title: 'Hot Memory',        description: 'Frequently accessed, high-importance recent facts' },
  { path: 'archive',   title: 'Archive',           description: 'Superseded or low-confidence facts' },
  { path: 'system',    title: 'System Memory',     description: 'Internal system state, configuration, meta-memories' },
] as const;

/** Set of users whose directories have already been seeded this process lifetime. */
const seededUsers = new Set<string>();

/**
 * Compute effective confidence with time-based decay.
 * effectiveConfidence = baseConfidence × (decayFactor ^ daysSinceLastAccess)
 */
function computeEffectiveConfidence(mem: MemorySelect): number {
  if (!mem.lastAccessedAt) return mem.confidence;
  const daysSince = (Date.now() - new Date(mem.lastAccessedAt).getTime()) / (1000 * 60 * 60 * 24);
  return Math.round(mem.confidence * Math.pow(CONFIDENCE_DECAY_FACTOR, daysSince) * 1000) / 1000;
}

/**
 * Attach effectiveConfidence to a memory record and strip the embedding array.
 * We strip the embedding because returning 1024-float arrays to the agent 
 * wastes massive amounts of LLM context window tokens.
 */
function withDecay(mem: MemorySelect): Omit<MemorySelect, 'embedding'> & { effectiveConfidence: number } {
  const { embedding, ...rest } = mem;
  return { ...rest, effectiveConfidence: computeEffectiveConfidence(mem) };
}

export class MemoryService {

  // ─── Directory Seeding ──────────────────────────────────────────────

  /**
   * Ensure predefined directories exist for a user (lazy, once per process).
   */
  static async seedDirectories(userId: string): Promise<void> {
    if (seededUsers.has(userId)) return;

    for (const dir of PREDEFINED_DIRECTORIES) {
      const existing = await db.query.memory.findFirst({
        where: and(
          eq(memory.userId, userId),
          eq(memory.path, dir.path),
          eq(memory.type, 'directory')
        )
      });

      if (!existing) {
        await db.insert(memory).values({
          id: `mem_${randomUUID().replace(/-/g, '')}`,
          userId,
          path: dir.path,
          title: dir.title,
          type: 'directory',
          content: dir.description,
          state: 'system',
          source: 'system',
          metadata: {},
        });
      }
    }

    seededUsers.add(userId);
  }

  // ─── Store (with Auto-Evolution) ────────────────────────────────────

  /**
   * Store a memory. If an active memory exists at the same path:
   * 1. Close the old one (set valid_to, superseded_by, state='superseded')
   * 2. Insert the new one with version = old.version + 1
   *
   * If content is identical to the active record, returns early (duplicate prevention).
   */
  static async storeMemory(
    userId: string,
    path: string,
    data: Partial<MemoryInsert>
  ) {
    await this.seedDirectories(userId);

    const normalizedPath = path.replace(/^\/+|\/+$/g, '');
    const now = new Date();
    const newId = `mem_${randomUUID().replace(/-/g, '')}`;

    // Find the currently active record at this path
    const existing = await db.query.memory.findFirst({
      where: and(
        eq(memory.userId, userId),
        eq(memory.path, normalizedPath),
        eq(memory.state, 'active'),
        isNull(memory.validTo)
      )
    });

    if (existing) {
      // Exact duplicate prevention: if content is identical, skip
      if (existing.content === (data.content ?? '')) {
        return { ...withDecay(existing), _duplicate: true };
      }

      const newTitle = data.title || existing.title;
      const newContent = data.content ?? '';
      const contentToEmbed = `Title: ${newTitle}\nPath: ${normalizedPath}\nContent: ${newContent}`;
      const embedding = await generateEmbedding(contentToEmbed);

      // Auto-evolution: close the old fact
      await db.update(memory).set({
        validTo: now,
        supersededBy: newId,
        state: 'superseded',
        updatedAt: now,
      }).where(eq(memory.id, existing.id));

      // Insert the evolved version
      const [inserted] = await db.insert(memory).values({
        id: newId,
        userId,
        path: normalizedPath,
        title: newTitle,
        type: data.type || existing.type,
        content: newContent,
        metadata: data.metadata || existing.metadata,
        importance: data.importance ?? existing.importance,
        confidence: data.confidence ?? existing.confidence,
        source: data.source as string || 'agent',
        version: existing.version + 1,
        validFrom: now,
        state: 'active',
        embedding,
      }).returning();

      return inserted ? withDecay(inserted) : null;
    }

    const newTitle = data.title || normalizedPath.split('/').pop() || 'Untitled';
    const newContent = data.content ?? '';
    const contentToEmbed = `Title: ${newTitle}\nPath: ${normalizedPath}\nContent: ${newContent}`;
    const embedding = await generateEmbedding(contentToEmbed);

    const [inserted] = await db.insert(memory).values({
      id: newId,
      userId,
      path: normalizedPath,
      title: newTitle,
      type: data.type,
      content: newContent,
      metadata: data.metadata || {},
      importance: data.importance,
      confidence: data.confidence,
      source: data.source as string || 'agent',
      version: 1,
      validFrom: data.validFrom ? new Date(data.validFrom as unknown as string) : now,
      state: 'active',
      embedding,
    }).returning();

    return inserted ? withDecay(inserted) : null;
  }

  // ─── Read ───────────────────────────────────────────────────────────

  /**
   * Get a single memory by ID or path (active only by default).
   * Increments access count in the background.
   */
  static async getMemory(userId: string, idOrPath: string) {
    await this.seedDirectories(userId);

    const mem = await db.query.memory.findFirst({
      where: and(
        eq(memory.userId, userId),
        or(eq(memory.id, idOrPath), eq(memory.path, idOrPath)),
        eq(memory.state, 'active')
      )
    });

    if (mem) {
      // Background: increment access count & last accessed
      db.update(memory)
        .set({
          accessCount: mem.accessCount + 1,
          lastAccessedAt: new Date()
        })
        .where(eq(memory.id, mem.id))
        .execute()
        .catch(console.error);
    }

    return mem ? withDecay(mem) : null;
  }

  // ─── List ───────────────────────────────────────────────────────────

  /**
   * List memories. By default returns only active (current truth).
   * Set includeSuperseded = true to include historical versions.
   * Always excludes type='directory' system entries.
   */
  static async listMemories(userId: string, includeSuperseded = false) {
    await this.seedDirectories(userId);

    const conditions = [eq(memory.userId, userId)];

    if (!includeSuperseded) {
      conditions.push(eq(memory.state, 'active'));
    }

    const results = await db.query.memory.findMany({
      where: and(...conditions),
      orderBy: (memories, { desc }) => [desc(memories.updatedAt)]
    });

    // Filter out directory placeholders from list results
    return results
      .filter(m => m.type !== 'directory')
      .map(withDecay);
  }

  // ─── Query (fuzzy search) ───────────────────────────────────────────

  /**
   * Fuzzy search across title, content, and path.
   * Only searches active memories by default.
   */
  static async queryMemories(userId: string, query: string) {
    if (!query.trim()) return [];

    // Use Postgres Full-Text Search. This handles stemming (e.g. database = databases),
    // stop words (the, and, is), and does not require exact substring matches.
    const searchCondition = sql`
      to_tsvector('english', ${memory.title} || ' ' || ${memory.content} || ' ' || ${memory.path}) 
      @@ websearch_to_tsquery('english', ${query})
    `;

    const results = await db.query.memory.findMany({
      where: and(
        eq(memory.userId, userId),
        eq(memory.state, 'active'),
        searchCondition
      ),
      orderBy: (memories, { desc }) => [desc(memories.importance), desc(memories.updatedAt)],
      limit: 20
    });

    return results
      .filter(m => m.type !== 'directory')
      .map(withDecay);
  }

  // ─── Semantic Search ────────────────────────────────────────────────

  /**
   * Semantic search using pgvector cosine similarity.
   */
  static async semanticSearch(userId: string, query: string, limit = 5) {
    if (!query.trim()) return [];
    
    const queryVector = await generateEmbedding(query);
    if (!queryVector) {
      // Fallback to text search if embedding fails
      return this.queryMemories(userId, query);
    }
    
    const vectorLiteral = `[${queryVector.join(',')}]`;

    const results = await db.query.memory.findMany({
      where: and(
        eq(memory.userId, userId),
        eq(memory.state, 'active'),
        isNotNull(memory.embedding)
      ),
      orderBy: (memories, { asc }) => [asc(sql`${memories.embedding} <=> ${vectorLiteral}::vector`)],
      limit
    });

    return results
      .filter(m => m.type !== 'directory')
      .map(withDecay);
  }

  // ─── Delete ─────────────────────────────────────────────────────────

  /**
   * Delete a memory (hard delete).
   */
  static async deleteMemory(userId: string, idOrPath: string) {
    return await db
      .delete(memory)
      .where(
        and(
          eq(memory.userId, userId),
          or(eq(memory.id, idOrPath), eq(memory.path, idOrPath))
        )
      )
      .returning();
  }

  // ─── Timeline ───────────────────────────────────────────────────────

  /**
   * Get all versions of a fact at a given path, ordered newest first.
   * Reconstructs the full history of changes.
   */
  static async getTimeline(userId: string, path: string) {
    const normalizedPath = path.replace(/^\/+|\/+$/g, '');

    const results = await db.query.memory.findMany({
      where: and(
        eq(memory.userId, userId),
        eq(memory.path, normalizedPath)
      ),
      orderBy: (memories, { desc }) => [desc(memories.validFrom)]
    });

    return results
      .filter(m => m.type !== 'directory')
      .map(withDecay);
  }

  // ─── Point-in-Time Query ────────────────────────────────────────────

  /**
   * Return memories that were valid (true) at a specific point in time.
   * valid_from <= asOf AND (valid_to IS NULL OR valid_to > asOf)
   */
  static async queryAtPointInTime(userId: string, query: string, asOf: Date) {
    const searchTerm = `%${query}%`;

    const results = await db.query.memory.findMany({
      where: and(
        eq(memory.userId, userId),
        lte(memory.validFrom, asOf),
        or(
          isNull(memory.validTo),
          gt(memory.validTo, asOf)
        ),
        or(
          like(memory.title, searchTerm),
          like(memory.content, searchTerm),
          like(memory.path, searchTerm)
        )
      ),
      orderBy: (memories, { desc }) => [desc(memories.importance), desc(memories.updatedAt)],
      limit: 20
    });

    return results
      .filter(m => m.type !== 'directory')
      .map(withDecay);
  }

  // ─── Change Detection ───────────────────────────────────────────────

  /**
   * Return facts whose valid_from or valid_to changed after a given timestamp.
   * Useful for detecting what flipped since last check.
   */
  static async getChanges(userId: string, since: Date) {
    const results = await db.query.memory.findMany({
      where: and(
        eq(memory.userId, userId),
        or(
          gte(memory.validFrom, since),
          and(gte(memory.validTo, since), isNotNull(memory.validTo))
        )
      ),
      orderBy: (memories, { desc }) => [desc(memories.updatedAt)]
    });

    return results
      .filter(m => m.type !== 'directory')
      .map(withDecay);
  }

  // ─── Tree ───────────────────────────────────────────────────────────

  /**
   * Build an ASCII tree of the memory vault.
   * Always shows predefined directories. Shows version counts for multi-version files.
   */
  static async getMemoryTreeASCII(userId: string): Promise<string> {
    await this.seedDirectories(userId);

    const allMemories = await db.query.memory.findMany({
      where: eq(memory.userId, userId),
      orderBy: (memories, { desc }) => [desc(memories.validFrom)]
    });

    // Build tree structure
    const tree: Record<string, any> = {};

    // Ensure predefined dirs appear even when empty
    for (const dir of PREDEFINED_DIRECTORIES) {
      tree[dir.path] = {};
    }

    // Group active file memories into the tree
    for (const mem of allMemories) {
      if (mem.type === 'directory') continue;
      if (mem.state !== 'active') continue;

      const parts = mem.path.split('/').filter(Boolean);
      let current = tree;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!part) continue;
        if (i === parts.length - 1) {
          current[part] = { _file: true, id: mem.id, version: mem.version };
        } else {
          if (!current[part] || current[part]._file) current[part] = {};
          current = current[part];
        }
      }
    }

    // Render ASCII
    let output = 'memory/\n';
    const printNode = (node: Record<string, any>, prefix: string = '') => {
      const keys = Object.keys(node).filter(k => !k.startsWith('_')).sort();
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!key) continue;
        const child = node[key];
        if (!child) continue;
        const isLast = i === keys.length - 1;
        const pointer = isLast ? '└── ' : '├── ';
        const isFile = !!child._file;

        if (isFile) {
          const ver = child.version > 1 ? ` (v${child.version})` : '';
          output += `${prefix}${pointer}${key}${ver}\n`;
        } else {
          output += `${prefix}${pointer}${key}/\n`;
          printNode(child, prefix + (isLast ? '    ' : '│   '));
        }
      }
    };

    printNode(tree);
    return output;
  }

  // ─── Get Predefined Directories ─────────────────────────────────────

  /**
   * Return the list of predefined directories (for UI rendering).
   */
  static getPredefinedDirectories() {
    return PREDEFINED_DIRECTORIES.map(d => ({ ...d }));
  }
}
