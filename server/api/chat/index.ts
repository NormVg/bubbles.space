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

  if (event.method === 'GET') {
    try {
      const data = await ChatService.getMetadataList(userId);
      return data;
    } catch (error: any) {
      console.error('Failed to get chat metadata:', error);
      throw createError({ statusCode: 500, statusMessage: 'Failed to retrieve chat data' });
    }
  }

  if (event.method === 'POST') {
    try {
      const body = await readBody(event);
      if (!body || !body.id) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid payload: Expected conversation object with id' });
      }
      
      const result = await ChatService.syncData(userId, body);
      return result;
    } catch (error: any) {
      console.error('Failed to sync chat data:', error);
      throw createError({ statusCode: 500, statusMessage: 'Failed to sync chat data' });
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
