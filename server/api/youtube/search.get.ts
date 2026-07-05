import ytSearch from 'yt-search'
import { z } from 'zod'

const searchSchema = z.object({
  q: z.string().min(1),
  type: z.enum(['video', 'channel', 'playlist', 'all']).default('all'),
  limit: z.number().max(50).default(20).or(z.string().transform(v => parseInt(v, 10)))
})

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const params = searchSchema.parse(query)

    const results = await ytSearch(params.q)
    
    const items = results.videos.slice(0, params.limit as number).map(item => ({
      type: 'video',
      id: item.videoId,
      title: item.title,
      url: item.url,
      thumbnail: { url: item.image },
      durationFormatted: item.timestamp,
      channel: { name: item.author?.name },
      views: item.views
    }));

    return {
      success: true,
      data: items
    }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message || 'Failed to search YouTube'
    })
  }
})
