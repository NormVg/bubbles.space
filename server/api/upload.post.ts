import { defineEventHandler, createError, readFormData } from 'h3'
import { Client, Storage, ID } from 'node-appwrite'
import { InputFile } from 'node-appwrite/file'
import { auth } from '../utils/auth'
import { db } from '../db'
import { userFile } from '../db/schema'

export default defineEventHandler(async (event) => {
  // Auth check
  const session = await auth.api.getSession({ headers: event.headers })
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  const userId = session.user.id

  let formData: FormData
  try {
    formData = await readFormData(event)
  } catch (err) {
    console.error('Form data parsing error:', err)
    throw createError({ statusCode: 400, statusMessage: 'Failed to parse upload data' })
  }

  const files = formData.getAll('files') as File[]
  if (!files || files.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No files uploaded' })
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
  const uploadedFiles = []

  for (const file of files) {
    if (file.name) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const inputFile = InputFile.fromBuffer(buffer, file.name)
      const res = await storage.createFile(bucketId, ID.unique(), inputFile)

      // Construct view URL
      const fileUrl = `${endpoint}/storage/buckets/${bucketId}/files/${res.$id}/view?project=${projectId}`
      const fileId = res.$id

        // Persist to database
        await db.insert(userFile).values({
          id: crypto.randomUUID(),
          userId,
          appwriteFileId: fileId,
          originalName: file.name,
          mimeType: file.type || 'application/octet-stream',
          url: fileUrl,
        })

        uploadedFiles.push({
          appwriteFileId: fileId,
          originalName: file.name,
          url: fileUrl,
          mimeType: file.type
        })
    }
  }

  return { files: uploadedFiles }
})
