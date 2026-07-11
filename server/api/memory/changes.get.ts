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
  const since = query.since as string;

  if (!since) {
    throw createError({ statusCode: 400, statusMessage: 'Query parameter "since" is required' });
  }

  const sinceDate = new Date(since);
  if (isNaN(sinceDate.getTime())) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid date format for "since"' });
  }

  try {
    const changes = await MemoryService.getChanges(userId, sinceDate);
    return changes;
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
