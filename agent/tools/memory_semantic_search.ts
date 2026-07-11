import { defineTool } from "eve/tools";
import { z } from "zod";
import { getBaseUrl } from "../lib/utils";
import { requireUserId } from "../lib/auth";

export default defineTool({
  description: "Perform a deep semantic search (Vector/NLP) over the user's memories. Use this if the pre-fetched semantic context wasn't enough to answer the user's question. This understands conceptual similarity rather than exact keyword matches.",
  inputSchema: z.object({
    query: z.string().describe("The conceptual query to search for."),
  }),
  async execute({ query }, ctx) {
    const userId = requireUserId(ctx);
    if (!query) return [];

    const url = `${getBaseUrl()}/api/memory/semantic-search?q=${encodeURIComponent(query)}`;
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
