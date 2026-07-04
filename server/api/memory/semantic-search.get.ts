import { auth } from '../../utils/auth';
import { MemoryService } from '../../services/memory.service';

export default defineEventHandler(async (event) => {
  const internalSecret = getHeader(event, 'x-internal-secret');
  let userId = '';

  if (internalSecret === 'eve-bubbles-secret') {
    userId = getHeader(event, 'x-user-id') || '';
  } else {
    const session = await auth.api.getSession({
      headers: event.headers
    });

    if (!session || !session.user) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }
    userId = session.user.id;
  }

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const query = getQuery(event);
  const q = typeof query.q === 'string' ? query.q : '';

  if (!q) {
    return [];
  }

  try {
    const results = await MemoryService.semanticSearch(userId, q);
    return results;
  } catch (error) {
    console.error('Failed semantic search:', error);
    throw createError({ statusCode: 500, statusMessage: 'Search failed' });
  }
});
