import { auth } from '../../utils/auth';
import { MemoryService } from '../../services/memory.service';

export default defineEventHandler(async (event) => {
  let userId = '';
  const internalSecret = getHeader(event, 'x-internal-secret');
  if (internalSecret === 'eve-bubbles-secret') {
    userId = getHeader(event, 'x-user-id') || '';
  } else {
    const session = await auth.api.getSession({ headers: event.headers });
    userId = session?.user?.id || '';
  }
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });

  const body = await readBody(event);
  if (!body.path || !body.title) {
    throw createError({ statusCode: 400, statusMessage: 'Path and title are required' });
  }
  const validRoots = [
    'working', 'episodic', 'semantic', 'procedural',
    'identity', 'hot', 'archive', 'system'
  ];
  const rootDir = body.path.split('/')[0];
  if (!validRoots.includes(rootDir)) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: `Path must start with a predefined cognitive directory: ${validRoots.join(', ')}`
    });
  }

  try {
    const mem = await MemoryService.storeMemory(userId, body.path, {
      title: body.title,
      type: body.type,
      content: body.content,
      metadata: body.metadata,
      importance: body.importance,
      confidence: body.confidence,
      source: body.source,
      validFrom: body.validFrom,
    });
    return mem;
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
