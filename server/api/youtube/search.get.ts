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
    
    let items: any[] = [];
    if (params.type === 'all') {
      items = [...results.videos, ...results.channels, ...results.playlists];
    } else if (params.type === 'video') {
      items = results.videos;
    } else if (params.type === 'channel') {
      items = results.channels;
    } else if (params.type === 'playlist') {
      items = results.playlists;
    }

    // Format them to match what the UI expects
    items = items.map(item => {
      if (item.type === 'video') {
        return {
          type: 'video',
          id: item.videoId,
          title: item.title,
          url: item.url,
          thumbnail: { url: item.image },
          durationFormatted: item.timestamp,
          channel: { name: item.author?.name },
          views: item.views
        };
      } else if (item.type === 'channel') {
        return {
          type: 'channel',
          id: item.id,
          title: item.name,
          url: item.url,
          thumbnail: { url: item.image },
          channel: { name: item.subCountLabel + ' subs' }
        };
      } else if (item.type === 'list') {
        return {
          type: 'playlist',
          id: item.listId,
          title: item.title,
          url: item.url,
          thumbnail: { url: item.image },
          channel: { name: item.author?.name },
          durationFormatted: item.videoCount + ' videos'
        };
      }
      return item;
    });

    // limit
    items = items.slice(0, params.limit as number);

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
