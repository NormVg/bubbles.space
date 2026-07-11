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

  const query = getQuery(event);
  const includeSuperseded = query.includeSuperseded === 'true';
  
  try {
    if (query.q) {
      return await MemoryService.queryMemories(userId, query.q as string);
    }
    return await MemoryService.listMemories(userId, includeSuperseded);
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
