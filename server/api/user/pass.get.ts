import { auth } from '../../utils/auth';
import { db } from '../../db';
import { user } from '../../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });

  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const dbUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
    columns: {
      specialPass: true,
    }
  });

  return {
    specialPass: dbUser?.specialPass ?? null,
  };
});
