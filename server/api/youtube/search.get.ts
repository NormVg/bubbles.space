import YouTubeSR from 'youtube-sr'
import { z } from 'zod'

const searchSchema = z.object({
  q: z.string().min(1),
  type: z.enum(['video', 'channel', 'playlist', 'all']).default('all'),
  safeSearch: z.boolean().default(false).or(z.string().transform(v => v === 'true')),
  limit: z.number().max(50).default(20).or(z.string().transform(v => parseInt(v, 10)))
})

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const params = searchSchema.parse(query)

    const results = await YouTubeSR.default.search(params.q, {
      type: params.type,
      safeSearch: !!params.safeSearch,
      limit: params.limit as number
    })

    return {
      success: true,
      data: results
    }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message || 'Failed to search YouTube'
    })
  }
})
