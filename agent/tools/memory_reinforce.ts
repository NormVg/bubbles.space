import { defineTool } from "eve/tools";
import { z } from "zod";
import { getBaseUrl } from "../lib/utils";
import { requireUserId } from "../lib/auth";

export default defineTool({
  description: "Reinforce a memory by increasing its access count and updating its last accessed timestamp.",
  inputSchema: z.object({
    idOrPath: z.string().describe("The ID or virtual path of the memory to reinforce"),
  }),
  async execute({ idOrPath }, ctx) {
    const userId = requireUserId(ctx);

    const url = `${getBaseUrl()}/api/memory/${encodeURIComponent(idOrPath)}`;
    const response = await fetch(url, { headers: { 'x-internal-secret': 'eve-bubbles-secret', 'x-user-id': userId } });

    if (!response.ok) {
      if (response.status === 404) return "Memory not found.";
      throw new Error('Failed to reinforce memory');
    }
    return "Memory successfully reinforced.";
  },
});
