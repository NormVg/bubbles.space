import { defineTool } from "eve/tools";
import { z } from "zod";
import { mem } from "./_memory";

export default defineTool({
  description: "List recent memories from OpenMemory for a specific user.",
  inputSchema: z.object({
    user_id: z.string().optional().describe("Filter memories by user_id."),
    limit: z.number().optional().describe("Maximum number of memories to return (default: 20)."),
  }),
  async execute({ user_id, limit = 20 }) {
    try {
      // In OpenMemory, searching with empty string or '*' usually lists recent,
      // or we can use search with no query text but with limits.
      const results = await mem.search("", {
        user_id,
        limit,
      });
      return { success: true, results };
    } catch (error: any) {
      throw new Error(`Failed to list memories: ${error.message}`);
    }
  },
});
