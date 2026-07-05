import { defineTool } from "eve/tools";
import { z } from "zod";
import YouTubeSR from "youtube-sr";

export default defineTool({
  description: "Search YouTube for videos, channels, or playlists without needing an API key.",
  inputSchema: z.object({
    query: z.string().describe("The search query."),
    type: z.enum(['video', 'channel', 'playlist', 'all']).optional().describe("The type of search to perform. Defaults to 'video'."),
    safeSearch: z.boolean().optional().describe("Enable safe search to filter out explicit content. Defaults to false."),
    limit: z.number().max(50).optional().describe("The maximum number of results to return. Defaults to 5.")
  }),
  async execute({ query, type = 'video', safeSearch = false, limit = 5 }) {
    try {
      const results = await YouTubeSR.search(query, {
        type,
        safeSearch,
        limit
      });

      return results.map(item => {
        if (item.type === 'video') {
          return {
            type: 'video',
            id: item.id,
            title: item.title,
            url: item.url,
            duration: item.durationFormatted,
            channel: item.channel?.name,
            views: item.views
          };
        } else if (item.type === 'channel') {
          return {
            type: 'channel',
            id: item.id,
            name: item.name,
            url: item.url,
            subscribers: item.subscribers
          };
        } else if (item.type === 'playlist') {
          return {
            type: 'playlist',
            id: item.id,
            title: item.title,
            url: item.url,
            videoCount: item.videoCount
          };
        }
        return item;
      });
    } catch (error: any) {
      throw new Error(`Failed to search YouTube: ${error.message}`);
    }
  },
});
