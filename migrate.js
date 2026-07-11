import postgres from 'postgres';
import fs from 'node:fs';

// Node 20.6+ native environment loading
try {
  if (fs.existsSync('.env')) {
    process.loadEnvFile('.env');
  }
} catch (e) {
  // Ignore
}

async function run() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Please set it in your .env file or environment variables.");
  }
  const sql = postgres(process.env.DATABASE_URL);
  
  // Step 1: Create the table if it doesn't exist (initial install)
  const createTable = `
    CREATE TABLE IF NOT EXISTS "memory" (
      "id" text PRIMARY KEY NOT NULL,
      "user_id" text NOT NULL,
      "path" text NOT NULL,
      "title" text NOT NULL,
      "type" text,
      "content" text DEFAULT '',
      "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
      "importance" integer DEFAULT 5 NOT NULL,
      "confidence" real DEFAULT 1 NOT NULL,
      "access_count" integer DEFAULT 0 NOT NULL,
      "state" text DEFAULT 'active' NOT NULL,
      "valid_from" timestamp DEFAULT now() NOT NULL,
      "valid_to" timestamp,
      "superseded_by" text,
      "source" text DEFAULT 'agent' NOT NULL,
      "version" integer DEFAULT 1 NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL,
      "last_accessed_at" timestamp DEFAULT now()
    );
    
    DO $$ BEGIN
      ALTER TABLE "memory" ADD CONSTRAINT "memory_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `;
  
  await sql.unsafe(createTable);
  console.log("✓ Memory table ensured.");

  // Step 2: Add temporal columns if they don't exist (upgrade path)
  const addColumns = `
    DO $$ BEGIN
      ALTER TABLE "memory" ADD COLUMN "valid_from" timestamp DEFAULT now() NOT NULL;
    EXCEPTION WHEN duplicate_column THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "memory" ADD COLUMN "valid_to" timestamp;
    EXCEPTION WHEN duplicate_column THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "memory" ADD COLUMN "superseded_by" text;
    EXCEPTION WHEN duplicate_column THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "memory" ADD COLUMN "source" text DEFAULT 'agent' NOT NULL;
    EXCEPTION WHEN duplicate_column THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "memory" ADD COLUMN "version" integer DEFAULT 1 NOT NULL;
    EXCEPTION WHEN duplicate_column THEN null; END $$;

    -- Update User table for Agent Engine
    DO $$ BEGIN
      ALTER TABLE "user" ADD COLUMN "preferred_model" text;
    EXCEPTION WHEN duplicate_column THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "user" ADD COLUMN "reasoning_effort" text;
    EXCEPTION WHEN duplicate_column THEN null; END $$;
  `;

  await sql.unsafe(addColumns);
  console.log("✓ Temporal and User schema columns ensured.");

  // Step 3: Drop the old unique index that conflicts with versioning
  // (multiple records at the same path are now valid — old versions have valid_to set)
  const dropOldIndex = `
    DROP INDEX IF EXISTS "path_user_idx";
  `;

  await sql.unsafe(dropOldIndex);
  console.log("✓ Old unique path index dropped (versioning allows multiple rows per path).");

  // Step 4: Create new composite indexes for temporal queries
  const createIndexes = `
    CREATE INDEX IF NOT EXISTS "memory_user_state_idx" ON "memory" ("user_id", "state");
    CREATE INDEX IF NOT EXISTS "memory_user_path_idx" ON "memory" ("user_id", "path");
    CREATE INDEX IF NOT EXISTS "memory_valid_window_idx" ON "memory" ("user_id", "valid_from", "valid_to");
  `;

  await sql.unsafe(createIndexes);
  console.log("✓ Temporal indexes created.");

  console.log("\n✅ Migration complete.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
