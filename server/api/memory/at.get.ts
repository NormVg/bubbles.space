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
  const q = query.q as string;
  const asOf = query.asOf as string;

  if (!q || !asOf) {
    throw createError({ statusCode: 400, statusMessage: 'Query parameters "q" and "asOf" are required' });
  }

  const asOfDate = new Date(asOf);
  if (isNaN(asOfDate.getTime())) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid date format for "asOf"' });
  }

  try {
    const results = await MemoryService.queryAtPointInTime(userId, q, asOfDate);
    return results;
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
