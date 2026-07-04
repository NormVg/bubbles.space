import { defineTool } from "eve/tools";
import { z } from "zod";
import { mem } from "../utils/memory";

export default defineTool({
  description: "Search for relevant memories in OpenMemory based on a query string.",
  inputSchema: z.object({
    query: z.string().describe("The search text to query memory for."),
    user_id: z.string().optional().describe("Filter memories by a specific user identifier."),
    limit: z.number().optional().describe("Maximum number of results to return (default: 10)."),
    sectors: z.array(z.string()).optional().describe("Filter by specific cognitive sectors (episodic, semantic, procedural, emotional, reflective)."),
  }),
  async execute({ query, user_id, limit, sectors }) {
    try {
      const results = await mem.search(query, {
        user_id,
        limit,
        sectors,
      });
      return { success: true, results };
    } catch (error: any) {
      throw new Error(`Failed to query memory: ${error.message}`);
    }
  },
});
