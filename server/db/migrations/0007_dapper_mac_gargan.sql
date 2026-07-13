CREATE TABLE "crdt_sync_state" (
	"user_id" text PRIMARY KEY NOT NULL,
	"state" "bytea" NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "special_pass" text;--> statement-breakpoint
ALTER TABLE "crdt_sync_state" ADD CONSTRAINT "crdt_sync_state_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;