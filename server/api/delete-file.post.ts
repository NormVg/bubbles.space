import { defineEventHandler, createError, readBody } from 'h3'
import { Client, Storage } from 'node-appwrite'
import { auth } from '../utils/auth'
import { db } from '../db'
import { userFile } from '../db/schema'
import { eq, and, inArray } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers })
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  const userId = session.user.id

  const body = await readBody(event)
  const { fileIds } = body as { fileIds?: string[] }

  if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
    return { success: true, deleted: [], failed: [] }
  }

  const endpoint = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
  const projectId = process.env.APPWRITE_PROJECT_ID
  const apiKey = process.env.APPWRITE_API_KEY
  const bucketId = process.env.APPWRITE_BUCKET_ID

  if (!projectId || !apiKey || !bucketId) {
    throw createError({ statusCode: 500, statusMessage: 'Appwrite storage credentials missing' })
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey)

  const storage = new Storage(client)

  const deleted: string[] = []
  const failed: string[] = []

  for (const appwriteFileId of fileIds) {
    try {
      await storage.deleteFile(bucketId, appwriteFileId)
      deleted.push(appwriteFileId)
    } catch (err: any) {
      console.error(`Failed to delete Appwrite file ${appwriteFileId}:`, err?.message || err)
      failed.push(appwriteFileId)
    }
  }

  // Remove all successfully deleted records from DB
  if (deleted.length > 0) {
    await db.delete(userFile).where(
      and(
        eq(userFile.userId, userId),
        inArray(userFile.appwriteFileId, deleted)
      )
    )
  }

  return { success: true, deleted, failed }
})
