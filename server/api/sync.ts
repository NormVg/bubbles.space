import { auth } from '../utils/auth';
import { WorkspaceService } from '../services/workspace.service';
import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

export default defineEventHandler(async (event) => {
  // 1. Authenticate user
  const session = await auth.api.getSession({
    headers: event.headers
  });

  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

  const userId = session.user.id;
  const config = useRuntimeConfig();

  if (config.upstashRedisRestUrl && config.upstashRedisRestToken && !redis) {
    redis = new Redis({
      url: config.upstashRedisRestUrl,
      token: config.upstashRedisRestToken,
    });
  }

  // 2. Handle GET /api/sync
  if (event.method === 'GET') {
    try {
      if (redis) {
        const cached = await redis.get(`user:${userId}:workspaces`);
        if (cached) {
          console.log(`[Cache Hit] user:${userId}:workspaces`);
          return typeof cached === 'string' ? JSON.parse(cached) : cached;
        }
      }

      console.log(`[Cache Miss] user:${userId}:workspaces - Fetching from DB`);
      const data = await WorkspaceService.getSyncData(userId);
      
      if (redis) {
        event.waitUntil(redis.set(`user:${userId}:workspaces`, JSON.stringify(data), { ex: 86400 }));
      }

      return data;
    } catch (error: any) {
      console.error('Failed to get sync data:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve workspace data'
      });
    }
  }

  // 3. Handle POST /api/sync
  if (event.method === 'POST') {
    try {
      const body = await readBody(event);
      
      if (!body || !Array.isArray(body)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid payload: Expected an array of workspaces'
        });
      }

      if (redis) {
        // 1. Write to Redis instantly
        await redis.set(`user:${userId}:workspaces`, JSON.stringify(body), { ex: 86400 });
        
        // 2. Write to DB in the background
        event.waitUntil(
          WorkspaceService.syncData(userId, body).catch(e => {
            console.error('Failed background DB sync:', e);
          })
        );
        return { success: true, message: 'Saved to cache and queued for DB sync' };
      } else {
        const result = await WorkspaceService.syncData(userId, body);
        return result;
      }
    } catch (error: any) {
      console.error('Failed to sync data:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to sync workspace data'
      });
    }
  }

  // 4. Method not allowed
  throw createError({
    statusCode: 405,
    statusMessage: 'Method Not Allowed'
  });
});
