import YouTubeSR from 'youtube-sr'
import { z } from 'zod'

const playlistSchema = z.object({
  urlOrId: z.string().min(1),
  limit: z.number().max(200).default(50).or(z.string().transform(v => parseInt(v, 10)))
})

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const params = playlistSchema.parse(query)

    const playlist = await YouTubeSR.default.getPlaylist(params.urlOrId, { limit: params.limit as number })

    return {
      success: true,
      data: playlist
    }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message || 'Failed to fetch YouTube playlist'
    })
  }
})
