import { defineTool } from "eve/tools";
import { z } from "zod";
import { getBaseUrl } from "../lib/utils";
import { requireUserId } from "../lib/auth";

export default defineTool({
  description: "Get the full version history (timeline) of a memory at a given path. Shows all versions from newest to oldest, including when each version was valid and what replaced it.",
  inputSchema: z.object({
    path: z.string().describe("The virtual path to get the timeline for (e.g., 'identity/editor.md')"),
  }),
  async execute({ path }, ctx) {
    const userId = requireUserId(ctx);

    const url = `${getBaseUrl()}/api/memory/timeline?path=${encodeURIComponent(path)}`;
    const response = await fetch(url, {
      headers: { 'x-internal-secret': 'eve-bubbles-secret', 'x-user-id': userId },
    });

    if (!response.ok) throw new Error('Failed to fetch timeline');
    const timeline = await response.json();

    if (!timeline.length) return `No history found for path: ${path}`;
    return timeline;
  },
});
