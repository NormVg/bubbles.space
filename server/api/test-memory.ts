import { memoryService } from '../services/memory.service';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'POST') {
    const body = await readBody(event);
    if (!body || !body.content) {
      throw createError({
        statusCode: 400,
        message: 'Missing content in request body',
      });
    }

    try {
      const memory = await memoryService.addMemory(body.content, {
        user_id: body.userId || 'test-user',
        tags: body.tags || ['test'],
        created_at: Date.now(),
      });
      return { success: true, memory };
    } catch (e: any) {
      console.error('Error adding memory:', e);
      throw createError({
        statusCode: 500,
        message: 'Failed to add memory',
      });
    }
  }

  if (method === 'GET') {
    const query = getQuery(event);
    if (!query.q) {
      throw createError({
        statusCode: 400,
        message: 'Missing q (query) parameter',
      });
    }

    try {
      const results = await memoryService.searchMemory(query.q as string, {
        user_id: query.userId || 'test-user',
        limit: 10,
      });
      return { success: true, results };
    } catch (e: any) {
      console.error('Error searching memory:', e);
      throw createError({
        statusCode: 500,
        message: 'Failed to search memory',
      });
    }
  }

  throw createError({
    statusCode: 405,
    message: 'Method Not Allowed',
  });
});
