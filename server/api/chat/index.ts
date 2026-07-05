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
        const cached = await redis.get(`user:${userId}:chats`);
        if (cached) {
          return typeof cached === 'string' ? JSON.parse(cached) : cached;
        }
      }

      const data = await ChatService.getMetadataList(userId);

      if (redis) {
        event.waitUntil(redis.set(`user:${userId}:chats`, JSON.stringify(data), { ex: 86400 }));
      }

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
      
      if (redis) {
        // Cache the detailed chat object instantly
        await redis.set(`user:${userId}:chat:${body.id}`, JSON.stringify(body), { ex: 86400 });
        // Invalidate the cached metadata list so the sidebar updates on next fetch
        await redis.del(`user:${userId}:chats`);
        
        // Sync to DB in the background
        event.waitUntil(
          ChatService.syncData(userId, body).catch(e => console.error('Failed DB chat sync:', e))
        );
        return { success: true, message: 'Saved to chat cache' };
      } else {
        const result = await ChatService.syncData(userId, body);
        return result;
      }
    } catch (error: any) {
      console.error('Failed to sync chat data:', error);
      throw createError({ statusCode: 500, statusMessage: 'Failed to sync chat data' });
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
