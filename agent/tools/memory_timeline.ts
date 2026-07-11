import { defineTool } from "eve/tools";
import { z } from "zod";
import { getBaseUrl } from "../lib/utils";

export default defineTool({
  description: "Get the full version history (timeline) of a memory at a given path. Shows all versions from newest to oldest, including when each version was valid and what replaced it.",
  inputSchema: z.object({
    userId: z.string().describe("Extract this exactly from 'System Info (Hidden): UserID=\"...\"' in the system context. If not found, output 'MISSING'."),
    path: z.string().describe("The virtual path to get the timeline for (e.g., 'identity/editor.md')"),
  }),
  async execute({ userId, path }) {
    if (!userId || userId === 'MISSING' || userId === 'undefined') {
      return "Error: Cannot access memory because the UserID is missing from the system context. The user might not be logged in or the session is still loading.";
    }

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
