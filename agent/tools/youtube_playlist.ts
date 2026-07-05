import { defineTool } from "eve/tools";
import { z } from "zod";
import YouTubeSR from "youtube-sr";

export default defineTool({
  description: "Fetch all videos from a specific YouTube playlist using its URL or ID.",
  inputSchema: z.object({
    urlOrId: z.string().describe("The playlist URL or ID."),
    limit: z.number().max(200).optional().describe("The maximum number of videos to fetch. Defaults to 50.")
  }),
  async execute({ urlOrId, limit = 50 }) {
    try {
      const playlist = await YouTubeSR.getPlaylist(urlOrId, { limit });

      return {
        id: playlist.id,
        title: playlist.title,
        url: playlist.url,
        videoCount: playlist.videoCount,
        channel: playlist.channel?.name,
        videos: playlist.videos.map(v => ({
          id: v.id,
          title: v.title,
          url: v.url,
          duration: v.durationFormatted
        }))
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch YouTube playlist: ${error.message}`);
    }
  },
});
