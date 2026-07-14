import { defineEventHandler, createError } from 'h3'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  let formData: FormData
  try {
    formData = await event.request.formData()
  } catch (err) {
    console.error('Form data parsing error:', err)
    throw createError({ statusCode: 400, statusMessage: 'Failed to parse upload data' })
  }

  const files = formData.getAll('files') as File[]
  if (!files || files.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No files uploaded' })
  }

  const uploadedFiles = []
  
  // Ensure the uploads directory exists
  const uploadDir = join(process.cwd(), 'public', 'uploads')
  try {
    await mkdir(uploadDir, { recursive: true })
  } catch (err) {
    console.error('Failed to create upload dir', err)
  }

  for (const file of files) {
    if (file.name) {
      // Create a unique filename
      const ext = file.name.split('.').pop()
      const uniqueFilename = `${randomUUID()}.${ext}`
      const filePath = join(uploadDir, uniqueFilename)
      
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(filePath, buffer)
      
      uploadedFiles.push({
        originalName: file.name,
        url: `/uploads/${uniqueFilename}`,
        mimeType: file.type
      })
    }
  }

  return { files: uploadedFiles }
})
