import { auth } from '../../utils/auth';
import { MemoryService } from '../../services/memory.service';

export default defineEventHandler(async (event) => {
  let userId = '';
  const internalSecret = getHeader(event, 'x-internal-secret');
  if (internalSecret === 'eve-bubbles-secret') {
    userId = getHeader(event, 'x-user-id') || '';
    userId = userId.replace(/^["']|["']$/g, '').trim();
  } else {
    const session = await auth.api.getSession({ headers: event.headers });
    userId = session?.user?.id || '';
  }
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });

  // Get the ID or Path from the URL, remember to decode it
  const idOrPath = decodeURIComponent(getRouterParam(event, 'id') || '');
  if (!idOrPath) throw createError({ statusCode: 400, statusMessage: 'ID or Path is required' });

  if (event.method === 'GET') {
    const mem = await MemoryService.getMemory(userId, idOrPath);
    if (!mem) throw createError({ statusCode: 404, statusMessage: 'Memory not found' });
    return mem;
  }

  if (event.method === 'DELETE') {
    await MemoryService.deleteMemory(userId, idOrPath);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
