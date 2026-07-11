import { defineTool } from "eve/tools";
import { z } from "zod";
import { getBaseUrl } from "../lib/utils";
import { requireUserId } from "../lib/auth";

export default defineTool({
  description: "Query memories at a specific point in time. Returns facts that were considered true (valid) at the given timestamp. Useful for answering 'what did we know about X on date Y?'",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
    asOf: z.string().describe("ISO 8601 timestamp for the point in time (e.g., '2026-01-15T00:00:00Z')"),
  }),
  async execute({ query, asOf }, ctx) {
    const userId = requireUserId(ctx);

    const url = `${getBaseUrl()}/api/memory/at?q=${encodeURIComponent(query)}&asOf=${encodeURIComponent(asOf)}`;
    const response = await fetch(url, {
      headers: { 'x-internal-secret': 'eve-bubbles-secret', 'x-user-id': userId },
    });

    if (!response.ok) throw new Error('Failed to query point-in-time');
    const results = await response.json();

    if (!results.length) return `No memories matched "${query}" as of ${asOf}.`;
    return results;
  },
});
