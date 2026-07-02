import { auth } from '../../utils/auth';
import { db } from '../../db';
import { user } from '../../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers
  });

  if (!session || !session.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  if (!body) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' });
  }
  
  const updateData: any = {};
  if (body.systemPrompt !== undefined) updateData.systemPrompt = body.systemPrompt;
  if (body.aboutMe !== undefined) updateData.aboutMe = body.aboutMe;
  
  if (Object.keys(updateData).length > 0) {
    updateData.updatedAt = new Date();
    await db.update(user)
      .set(updateData)
      .where(eq(user.id, session.user.id));
  }

  return { success: true };
});
