import { defineTool } from "eve/tools";
import { z } from "zod";
import { getBaseUrl } from "../lib/utils";
import { requireUserId } from "../lib/auth";

export default defineTool({
  description: "Search for memories using fuzzy matching on title, content, and metadata.",
  inputSchema: z.object({
    queries: z.array(z.string()).describe("An array of search queries. Provide multiple broad keywords to search for different concepts simultaneously."),
  }),
  async execute({ queries }, ctx) {
    const userId = requireUserId(ctx);
    if (!queries || queries.length === 0) return [];
    
    // Fetch all queries in parallel
    const promises = queries.map(async (query) => {
      const url = `${getBaseUrl()}/api/memory?q=${encodeURIComponent(query)}`;
      const response = await fetch(url, { headers: { 'x-internal-secret': 'eve-bubbles-secret', 'x-user-id': userId } });
      if (!response.ok) return [];
      return await response.json();
    });

    const resultsArray = await Promise.all(promises);
    
    // Flatten and deduplicate by memory id
    const allMemories = resultsArray.flat();
    const uniqueMemories = Array.from(new Map(allMemories.map((m: any) => [m.id, m])).values());
    
    // Sort by importance and update time, just like the backend does
    uniqueMemories.sort((a: any, b: any) => {
      if (b.importance !== a.importance) return b.importance - a.importance;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return uniqueMemories;
  },
});
