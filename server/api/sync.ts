import { auth } from '../utils/auth';
import { WorkspaceService } from '../services/workspace.service';

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

  // 2. Handle GET /api/sync
  if (event.method === 'GET') {
    try {
      const data = await WorkspaceService.getSyncData(userId);
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

      const result = await WorkspaceService.syncData(userId, body);
      return result;
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
