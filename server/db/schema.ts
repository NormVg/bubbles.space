import { pgTable, text, timestamp, boolean, jsonb, real, integer, uniqueIndex, index, halfvec } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";


export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull(),
	image: text('image'),
	systemPrompt: text('system_prompt'),
	aboutMe: text('about_me'),
	preferredModel: text('preferred_model'),
	reasoningEffort: text('reasoning_effort'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});

export const workspace = pgTable("workspace", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
	label: text("label").notNull(),
	canvasState: jsonb("canvas_state").notNull().$type<{ x: number, y: number, scale: number }>(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const widget = pgTable("widget", {
	id: text("id").primaryKey(),
	workspaceId: text("workspace_id").notNull().references(() => workspace.id, { onDelete: 'cascade' }),
	type: text("type").notNull(),
	x: real("x").notNull(),
	y: real("y").notNull(),
	width: real("width").notNull(),
	height: real("height").notNull(),
	zIndex: integer("z_index").default(0).notNull(),
	title: text("title"),
	data: jsonb("data").notNull().$type<Record<string, any>>(),
	isArchived: boolean("is_archived").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const conversation = pgTable('conversation', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull().default('New chat'),
  messageCount: integer('message_count').default(0).notNull(),
  lastMessagePreview: text('last_message_preview').default(''),
  session: jsonb('session'), // Eve agent session state
  events: jsonb('events').default([]).notNull(), // Chat history event array
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const memory = pgTable('memory', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  path: text('path').notNull(),
  title: text('title').notNull(),
  type: text('type'),
  content: text('content').default(''),
  metadata: jsonb('metadata').default({}).notNull(),
  importance: integer('importance').default(5).notNull(),
  confidence: real('confidence').default(1.0).notNull(),
  accessCount: integer('access_count').default(0).notNull(),
  state: text('state').default('active').notNull(),
  embedding: halfvec('embedding', { dimensions: 2048 }),
  // Temporal truth-window columns
  validFrom: timestamp('valid_from').defaultNow().notNull(),
  validTo: timestamp('valid_to'),
  supersededBy: text('superseded_by'),
  source: text('source').default('agent').notNull(),
  version: integer('version').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastAccessedAt: timestamp('last_accessed_at').defaultNow()
}, (table) => ({
  embeddingIndex: index('embedding_idx').using('hnsw', sql`${table.embedding} halfvec_cosine_ops`)
}));
