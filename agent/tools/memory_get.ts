import { defineTool } from "eve/tools";
import { z } from "zod";
import { getBaseUrl } from "../lib/utils";
import { requireUserId } from "../lib/auth";

export default defineTool({
  description: "Get a specific memory by its ID or virtual path.",
  inputSchema: z.object({
    idOrPath: z.string().describe("The ID or virtual path of the memory to fetch"),
  }),
  async execute({ idOrPath }, ctx) {
    const userId = requireUserId(ctx);

    const url = `${getBaseUrl()}/api/memory/${encodeURIComponent(idOrPath)}`;
    const response = await fetch(url, { headers: { 'x-internal-secret': 'eve-bubbles-secret', 'x-user-id': userId } });

    if (!response.ok) {
      if (response.status === 404) return "Memory not found.";
      throw new Error('Failed to get memory');
    }
    return await response.json();
  },
});
