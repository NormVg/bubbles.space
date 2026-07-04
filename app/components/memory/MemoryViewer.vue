<script setup lang="ts">
import { ref, watch } from 'vue'

interface MemoryItem {
  id: string
  path: string
  title: string
  content: string
  type: string | null
  state: string
  version: number
  source: string
  importance: number
  confidence: number
  effectiveConfidence: number
  accessCount: number
  validFrom: string
  validTo: string | null
  supersededBy: string | null
  createdAt: string
  updatedAt: string
  lastAccessedAt: string | null
}

const props = defineProps<{
  memory: MemoryItem | null
}>()

const emit = defineEmits(['save', 'delete'])

const editableContent = ref('')
const isEditing = ref(false)
const activeTab = ref<'content' | 'history'>('content')
const timeline = ref<MemoryItem[]>([])
const isLoadingTimeline = ref(false)

watch(() => props.memory, (newMem) => {
  if (newMem) {
    editableContent.value = newMem.content || ''
    isEditing.value = false
    activeTab.value = 'content'
    timeline.value = []
  }
}, { immediate: true })

function handleSave() {
  emit('save', { ...props.memory, content: editableContent.value })
  isEditing.value = false
}

async function loadTimeline() {
  if (!props.memory) return
  isLoadingTimeline.value = true
  try {
    const res = await $fetch(`/api/memory/timeline?path=${encodeURIComponent(props.memory.path)}`)
    timeline.value = res as MemoryItem[]
  } catch (err) {
    console.error('Failed to load timeline:', err)
  } finally {
    isLoadingTimeline.value = false
  }
}

function switchTab(tab: 'content' | 'history') {
  activeTab.value = tab
  if (tab === 'history' && timeline.value.length === 0) loadTimeline()
}

function confidenceColor(v: number): string {
  if (v > 0.7) return 'var(--success)'
  if (v > 0.4) return 'var(--warning)'
  return 'var(--danger)'
}

function formatDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function relativeTime(d: string | null): string {
  if (!d) return '—'
  const ms = Date.now() - new Date(d).getTime()
  const m = Math.floor(ms / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const days = Math.floor(h / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}
</script>

<template>
  <div class="viewer" v-if="memory">
    <!-- ─── Top bar ──────────────── -->
    <header class="viewer-top">
      <div class="top-left">
        <h1 class="viewer-title">{{ memory.title }}</h1>
        <div class="chip-row">
          <span class="chip chip-path">{{ memory.path }}</span>
          <span class="chip" :class="'chip-' + memory.state">{{ memory.state }}</span>
          <span class="chip chip-source">{{ memory.source }}</span>
          <span v-if="memory.version > 1" class="chip chip-version">v{{ memory.version }}</span>
        </div>
      </div>
      <div class="top-actions">
        <button v-if="!isEditing" class="act-btn" @click="isEditing = true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
          Edit
        </button>
        <template v-if="isEditing">
          <button class="act-btn act-primary" @click="handleSave">Save</button>
          <button class="act-btn" @click="isEditing = false">Cancel</button>
        </template>
        <button class="act-btn act-danger" @click="emit('delete', memory.id)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </header>

    <!-- ─── Meta strip ───────────── -->
    <div class="meta-strip">
      <div class="meta-cell">
        <span class="meta-label">Valid from</span>
        <span class="meta-val">{{ formatDate(memory.validFrom) }}</span>
      </div>
      <div class="meta-sep" />
      <div class="meta-cell">
        <span class="meta-label">Valid to</span>
        <span class="meta-val" :class="{ current: !memory.validTo }">
          {{ memory.validTo ? formatDate(memory.validTo) : 'Now' }}
        </span>
      </div>
      <div class="meta-sep" />
      <div class="meta-cell">
        <span class="meta-label">Confidence</span>
        <div class="confidence-row">
          <div class="conf-track">
            <div
              class="conf-fill"
              :style="{ width: Math.round(memory.effectiveConfidence * 100) + '%', background: confidenceColor(memory.effectiveConfidence) }"
            />
          </div>
          <span class="conf-pct">{{ Math.round(memory.effectiveConfidence * 100) }}%</span>
        </div>
      </div>
      <div class="meta-sep" />
      <div class="meta-cell">
        <span class="meta-label">Accessed</span>
        <span class="meta-val">{{ memory.accessCount }}× · {{ relativeTime(memory.lastAccessedAt) }}</span>
      </div>
    </div>

    <!-- ─── Tabs ─────────────────── -->
    <div class="tab-bar">
      <button class="tab" :class="{ on: activeTab === 'content' }" @click="switchTab('content')">Content</button>
      <button class="tab" :class="{ on: activeTab === 'history' }" @click="switchTab('history')">
        History
        <span v-if="memory.version > 1" class="tab-count">{{ memory.version }}</span>
      </button>
    </div>

    <!-- ─── Content ──────────────── -->
    <div class="viewer-body" v-if="activeTab === 'content'">
      <pre v-if="!isEditing" class="content-pre">{{ memory.content || '(empty)' }}</pre>
      <textarea
        v-else
        v-model="editableContent"
        class="content-editor"
        spellcheck="false"
        placeholder="Markdown content…"
      />
    </div>

    <!-- ─── History ──────────────── -->
    <div class="viewer-body" v-else>
      <div v-if="isLoadingTimeline" class="empty-hint">Loading…</div>
      <div v-else-if="timeline.length === 0" class="empty-hint">No version history.</div>
      <ol v-else class="timeline">
        <li
          v-for="(entry, i) in timeline"
          :key="entry.id"
          class="tl-item"
          :class="{ 'tl-current': entry.state === 'active' }"
        >
          <div class="tl-rail">
            <span class="tl-dot" :class="{ live: entry.state === 'active' }" />
            <span v-if="i < timeline.length - 1" class="tl-line" />
          </div>
          <div class="tl-card">
            <div class="tl-head">
              <span class="tl-ver">v{{ entry.version }}</span>
              <span class="tl-date">{{ formatDate(entry.validFrom) }}</span>
              <span v-if="entry.validTo" class="tl-arrow">→ {{ formatDate(entry.validTo) }}</span>
              <span v-else class="tl-now">current</span>
            </div>
            <pre class="tl-body">{{ entry.content }}</pre>
          </div>
        </li>
      </ol>
    </div>
  </div>

  <!-- ─── Empty state ──────────── -->
  <div class="empty-state" v-else>
    <div class="empty-orb" />
    <p class="empty-text">Select a memory to view its contents</p>
  </div>
</template>

<style scoped>
/* ─── Layout ─────────────────────── */
.viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
  -webkit-font-smoothing: antialiased;
}

/* ─── Top bar ────────────────────── */
.viewer-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 24px 28px 0;
}

.viewer-title {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
}

.chip-row {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.chip {
  font-size: 10px;
  font-weight: 500;
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.2px;
}

.chip-path {
  font-family: var(--font-mono);
  color: var(--text-secondary);
  background: var(--bg-muted);
}

.chip-active {
  color: var(--success);
  background: rgba(152, 195, 121, 0.1);
}

.chip-superseded {
  color: var(--text-muted);
  background: var(--bg-muted);
}

.chip-source {
  color: var(--text-muted);
}

.chip-version {
  color: var(--accent);
  background: var(--accent-glow);
}

/* ─── Action buttons ─────────────── */
.top-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
  padding-top: 2px;
}

.act-btn {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
  min-height: 30px;
}

.act-btn:hover { background: var(--hover-bg); color: var(--text-primary); }
.act-btn:active { transform: scale(0.96); }

.act-primary {
  background: var(--accent);
  color: var(--accent-foreground);
  border-color: transparent;
}
.act-primary:hover { background: var(--accent-hover); color: var(--accent-foreground); }

.act-danger { border-color: transparent; }
.act-danger:hover { color: var(--danger); background: rgba(224, 108, 117, 0.08); }

/* ─── Meta strip ─────────────────── */
.meta-strip {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 14px 28px;
  flex-wrap: wrap;
}

.meta-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 0 16px;
}

.meta-cell:first-child { padding-left: 0; }

.meta-sep {
  width: 1px;
  height: 24px;
  background: var(--border);
  flex-shrink: 0;
}

.meta-label {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--text-muted);
}

.meta-val {
  font-size: 12px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.meta-val.current {
  color: var(--success);
  font-weight: 500;
}

.confidence-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.conf-track {
  width: 48px;
  height: 3px;
  background: var(--bg-muted);
  border-radius: 9999px;
  overflow: hidden;
}

.conf-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 400ms cubic-bezier(0.19, 1, 0.22, 1);
}

.conf-pct {
  font-size: 11px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
  min-width: 28px;
}

/* ─── Tabs ───────────────────────── */
.tab-bar {
  display: flex;
  padding: 0 28px;
  border-bottom: 1px solid var(--border);
}

.tab {
  all: unset;
  box-sizing: border-box;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color var(--transition-fast), border-color var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 5px;
}

.tab:hover { color: var(--text-secondary); }

.tab.on {
  color: var(--text-primary);
  border-bottom-color: var(--accent);
}

.tab-count {
  font-size: 9px;
  font-weight: 600;
  background: var(--bg-muted);
  padding: 1px 5px;
  border-radius: 9999px;
  color: var(--text-muted);
}

/* ─── Body ───────────────────────── */
.viewer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
}

.viewer-body::-webkit-scrollbar { width: 4px; }
.viewer-body::-webkit-scrollbar-track { background: transparent; }
.viewer-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 9999px; }

.content-pre {
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  color: var(--text-secondary);
}

.content-editor {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  resize: none;
  outline: none;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-primary);
}

/* ─── Timeline ───────────────────── */
.timeline {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tl-item {
  display: flex;
  gap: 14px;
}

.tl-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 12px;
  flex-shrink: 0;
  padding-top: 7px;
}

.tl-dot {
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: var(--bg-muted);
  border: 1.5px solid var(--border);
  flex-shrink: 0;
  transition: background 250ms cubic-bezier(0.19, 1, 0.22, 1), border-color 250ms cubic-bezier(0.19, 1, 0.22, 1), box-shadow 250ms cubic-bezier(0.19, 1, 0.22, 1);
}

.tl-dot.live {
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 8px var(--accent-glow);
}

.tl-line {
  flex: 1;
  width: 1px;
  background: var(--border-subtle);
  margin: 3px 0;
  min-height: 20px;
}

.tl-card {
  flex: 1;
  background: var(--bg-muted);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  margin-bottom: 10px;
  transition: border-color var(--transition-fast);
}

.tl-current .tl-card {
  border-color: rgba(205, 198, 247, 0.15);
  background: linear-gradient(180deg, rgba(205, 198, 247, 0.03) 0%, transparent 100%), var(--bg-muted);
}

.tl-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.tl-ver {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
}

.tl-date {
  font-size: 11px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.tl-arrow {
  font-size: 11px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.tl-now {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--success);
  background: rgba(152, 195, 121, 0.1);
  padding: 1px 6px;
  border-radius: 4px;
}

.tl-body {
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  color: var(--text-secondary);
  max-height: 100px;
  overflow-y: auto;
}

/* ─── Empty state ────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
}

.empty-orb {
  width: 48px;
  height: 48px;
  border-radius: 9999px;
  background: radial-gradient(circle at 40% 35%, var(--accent-glow), transparent 70%);
  border: 1px solid var(--border);
  opacity: 0.5;
}

.empty-text {
  font-size: 13px;
  color: var(--text-muted);
}

.empty-hint {
  font-size: 13px;
  color: var(--text-muted);
  padding: 8px 0;
}
</style>
