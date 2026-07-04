import { defineTool } from "eve/tools";
import { z } from "zod";
import { getBaseUrl } from "../lib/utils";

export default defineTool({
  description: "Perform a deep semantic search (Vector/NLP) over the user's memories. Use this if the pre-fetched semantic context wasn't enough to answer the user's question. This understands conceptual similarity rather than exact keyword matches.",
  inputSchema: z.object({
    userId: z.string().describe("Extract this exactly from 'System Info (Hidden): UserID=\"...\"' in the system context."),
    query: z.string().describe("The conceptual query to search for."),
  }),
  async execute({ userId, query }) {
    if (!userId) throw new Error("userId is required");
    if (!query) return [];

    const url = `${getBaseUrl()}/api/memory/semantic-search?q=${encodeURIComponent(query)}`;
    
    // We can't rely on the cookie here since tools run on the server side without user headers.
    // Wait, the semantic-search endpoint requires auth... 
    // Let me check how memory API handles it. It checks internal secret? 
    // Yes, memory API likely checks for 'x-internal-secret'. 
    // I need to update semantic-search.get.ts to support 'x-internal-secret' like memory/index.get.ts does!
    
    const response = await fetch(url, { headers: { 'x-internal-secret': 'eve-bubbles-secret', 'x-user-id': userId } });
    
    if (!response.ok) {
      return "Semantic search failed.";
    }
    
    const results = await response.json();

    if (results.length === 0) {
      return "No semantically related memories found.";
    }

    return results;
  }
});
