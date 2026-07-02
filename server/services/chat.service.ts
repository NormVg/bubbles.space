import { ChatRepository, NewConversationRecord } from '../repositories/chat.repository';

export class ChatService {
  static async getMetadataList(userId: string) {
    return await ChatRepository.getMetadataList(userId);
  }

  static async getDetail(userId: string, conversationId: string) {
    const record = await ChatRepository.getDetail(userId, conversationId);
    if (!record) return null;
    return record;
  }

  static async syncData(userId: string, frontendConversation: any) {
    const data: NewConversationRecord = {
      id: frontendConversation.id,
      userId: userId,
      title: frontendConversation.title || 'New chat',
      messageCount: frontendConversation.messageCount || 0,
      lastMessagePreview: frontendConversation.lastMessagePreview || '',
      session: frontendConversation.session || {},
      events: frontendConversation.events || [],
    };

    await ChatRepository.upsert(data);
    return { success: true, timestamp: new Date().toISOString() };
  }

  static async deleteConversation(userId: string, conversationId: string) {
    await ChatRepository.delete(userId, conversationId);
  }
}
