import { eq, desc, and } from 'drizzle-orm';
import { db } from '../db';
import { conversation } from '../db/schema';

export type ConversationRecord = typeof conversation.$inferSelect;
export type NewConversationRecord = typeof conversation.$inferInsert;

export class ChatRepository {
  /**
   * Fetches all conversations (metadata only - omit large JSON) for a given user.
   */
  static async getMetadataList(userId: string) {
    return await db.query.conversation.findMany({
      where: eq(conversation.userId, userId),
      columns: {
        id: true,
        userId: true,
        title: true,
        messageCount: true,
        lastMessagePreview: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [desc(conversation.updatedAt)],
    });
  }

  /**
   * Fetches a single conversation with full details (session + events).
   */
  static async getDetail(userId: string, conversationId: string) {
    const result = await db.query.conversation.findFirst({
      where: (conv, { and, eq }) => and(eq(conv.id, conversationId), eq(conv.userId, userId)),
    });
    return result || null;
  }

  /**
   * Upserts a single conversation.
   */
  static async upsert(data: NewConversationRecord) {
    await db
      .insert(conversation)
      .values(data)
      .onConflictDoUpdate({
        target: conversation.id,
        set: {
          title: data.title,
          messageCount: data.messageCount,
          lastMessagePreview: data.lastMessagePreview,
          session: data.session,
          events: data.events,
          updatedAt: new Date(),
        },
      });
  }

  /**
   * Deletes a conversation.
   */
  static async delete(userId: string, conversationId: string) {
    await db
      .delete(conversation)
      .where(and(eq(conversation.id, conversationId), eq(conversation.userId, userId)));
  }
}
