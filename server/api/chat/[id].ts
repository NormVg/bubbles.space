import { auth } from '../../utils/auth';
import { ChatService } from '../../services/chat.service';
import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

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

  const config = useRuntimeConfig();
  if (config.upstashRedisRestUrl && config.upstashRedisRestToken && !redis) {
    redis = new Redis({
      url: config.upstashRedisRestUrl,
      token: config.upstashRedisRestToken,
    });
  }

  if (event.method === 'GET') {
    try {
      if (redis) {
        const cached = await redis.get(`user:${userId}:chat:${conversationId}`);
        if (cached) {
          return typeof cached === 'string' ? JSON.parse(cached) : cached;
        }
      }

      const data = await ChatService.getDetail(userId, conversationId);
      if (!data) {
        throw createError({ statusCode: 404, statusMessage: 'Conversation not found' });
      }

      if (redis) {
        event.waitUntil(redis.set(`user:${userId}:chat:${conversationId}`, JSON.stringify(data), { ex: 86400 }));
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
      if (redis) {
        // Delete this chat from cache, and invalidate the metadata list
        await redis.del(`user:${userId}:chat:${conversationId}`);
        await redis.del(`user:${userId}:chats`);
      }
      
      await ChatService.deleteConversation(userId, conversationId);
      return { success: true };
    } catch (error: any) {
      console.error('Failed to delete chat:', error);
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete chat' });
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
