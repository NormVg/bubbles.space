import { defineTool } from "eve/tools";
import { z } from "zod";
import ytSearch from "yt-search";

export default defineTool({
  description: "Search YouTube for videos, channels, or playlists without needing an API key.",
  inputSchema: z.object({
    query: z.string().describe("The search query."),
    type: z.enum(['video', 'channel', 'playlist', 'all']).optional().describe("The type of search to perform. Defaults to 'video'."),
    limit: z.number().max(50).optional().describe("The maximum number of results to return. Defaults to 5.")
  }),
  async execute({ query, type = 'video', limit = 5 }) {
    try {
      const results = await ytSearch(query);
      
      let items: any[] = [];
      if (type === 'all') {
        items = [...results.videos, ...results.channels, ...results.playlists];
      } else if (type === 'video') {
        items = results.videos;
      } else if (type === 'channel') {
        items = results.channels;
      } else if (type === 'playlist') {
        items = results.playlists;
      }

      // slice to limit
      items = items.slice(0, limit);

      return items.map(item => {
        if (item.type === 'video') {
          return {
            type: 'video',
            id: item.videoId,
            title: item.title,
            url: item.url,
            duration: item.timestamp,
            channel: item.author?.name,
            views: item.views
          };
        } else if (item.type === 'channel') {
          return {
            type: 'channel',
            id: item.id,
            name: item.name,
            url: item.url,
            subscribers: item.subCountLabel
          };
        } else if (item.type === 'list') {
          return {
            type: 'playlist',
            id: item.listId,
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
