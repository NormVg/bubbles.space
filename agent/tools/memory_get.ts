import { defineTool } from "eve/tools";
import { z } from "zod";
import { getBaseUrl } from "../lib/utils";

export default defineTool({
  description: "Get a specific memory by its ID or virtual path.",
  inputSchema: z.object({
    userId: z.string().describe("Extract this exactly from 'System Info (Hidden): UserID=\"...\"' in the system context."),
    idOrPath: z.string().describe("The ID or virtual path of the memory to fetch"),
  }),
  async execute({ userId, idOrPath }) {
    if (!userId) throw new Error("userId is required");
    
    const url = `${getBaseUrl()}/api/memory/${encodeURIComponent(idOrPath)}`;
    const response = await fetch(url, { headers: { 'x-internal-secret': 'eve-bubbles-secret', 'x-user-id': userId } });
    
    if (!response.ok) {
      if (response.status === 404) return "Memory not found.";
      throw new Error('Failed to get memory');
    }
    return await response.json();
  },
});
