import { auth } from '../../utils/auth'
import { db } from '../../db'
import { userFile } from '../../db/schema'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers })
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const files = await db
    .select()
    .from(userFile)
    .where(eq(userFile.userId, session.user.id))
    .orderBy(desc(userFile.createdAt))

  return { files }
})
