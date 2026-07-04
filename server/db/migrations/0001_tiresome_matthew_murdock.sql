CREATE EXTENSION IF NOT EXISTS vector;
DROP INDEX "path_user_idx";--> statement-breakpoint
ALTER TABLE "memory" ADD COLUMN "embedding" vector;--> statement-breakpoint
ALTER TABLE "memory" ADD COLUMN "valid_from" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "memory" ADD COLUMN "valid_to" timestamp;--> statement-breakpoint
ALTER TABLE "memory" ADD COLUMN "superseded_by" text;--> statement-breakpoint
ALTER TABLE "memory" ADD COLUMN "source" text DEFAULT 'agent' NOT NULL;--> statement-breakpoint
ALTER TABLE "memory" ADD COLUMN "version" integer DEFAULT 1 NOT NULL;