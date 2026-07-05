import { defineTool } from "eve/tools";
import { z } from "zod";
import ytSearch from "yt-search";
import "cheerio"; // Force Nitro to trace and bundle cheerio

export default defineTool({
  description: "Search YouTube for videos, channels, or playlists without needing an API key.",
  inputSchema: z.object({
    query: z.string().describe("The search query."),
    limit: z.number().max(50).optional().describe("The maximum number of results to return. Defaults to 5.")
  }),
  async execute({ query, limit = 5 }) {
    try {
      const results = await ytSearch(query);
      const items = results.videos.slice(0, limit);

      return items.map(item => ({
        type: 'video',
        id: item.videoId,
        title: item.title,
        url: item.url,
        duration: item.timestamp,
        channel: item.author?.name,
        views: item.views
      }));
    } catch (error: any) {
      throw new Error(`Failed to search YouTube: ${error.message}`);
    }
  },
});
