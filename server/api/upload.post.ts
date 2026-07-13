import { defineEventHandler, createError, readMultipartFormData } from 'h3'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
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

  for (const field of formData) {
    if (field.filename) {
      // Create a unique filename
      const ext = field.filename.split('.').pop()
      const uniqueFilename = `${randomUUID()}.${ext}`
      const filePath = join(uploadDir, uniqueFilename)
      
      await writeFile(filePath, field.data)
      
      uploadedFiles.push({
        originalName: field.filename,
        url: `/uploads/${uniqueFilename}`,
        mimeType: field.type
      })
    }
  }

  return { files: uploadedFiles }
})
