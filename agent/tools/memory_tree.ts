import { defineTool } from "eve/tools";
import { z } from "zod";
import { getBaseUrl } from "../lib/utils";

export default defineTool({
  description: "Get an ASCII tree representation of the memory folder structure.",
  inputSchema: z.object({
    userId: z.string().describe("Extract this exactly from 'System Info (Hidden): UserID=\"...\"' in the system context."),
  }),
  async execute({ userId }) {
    if (!userId) throw new Error("userId is required");
    
    const url = `${getBaseUrl()}/api/memory/tree`;
    const response = await fetch(url, { headers: { 'x-internal-secret': 'eve-bubbles-secret', 'x-user-id': userId } });
    
    if (!response.ok) throw new Error('Failed to fetch memory tree');
    return await response.text();
  },
});
