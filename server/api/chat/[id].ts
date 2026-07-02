import { auth } from '../../utils/auth';
import { ChatService } from '../../services/chat.service';

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers
  });

  if (!session || !session.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const userId = session.user.id;
  const conversationId = getRouterParam(event, 'id');

  if (!conversationId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing conversation ID' });
  }

  if (event.method === 'GET') {
    try {
      const data = await ChatService.getDetail(userId, conversationId);
      if (!data) {
        throw createError({ statusCode: 404, statusMessage: 'Conversation not found' });
      }
      return data;
    } catch (error: any) {
      if (error.statusCode === 404) throw error;
      console.error('Failed to get chat detail:', error);
      throw createError({ statusCode: 500, statusMessage: 'Failed to retrieve chat detail' });
    }
  }

  if (event.method === 'DELETE') {
    try {
      await ChatService.deleteConversation(userId, conversationId);
      return { success: true };
    } catch (error: any) {
      console.error('Failed to delete chat:', error);
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete chat' });
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
