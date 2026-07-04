DROP INDEX "embedding_idx";--> statement-breakpoint
CREATE INDEX "embedding_idx" ON "memory" USING hnsw ("embedding" halfvec_cosine_ops);