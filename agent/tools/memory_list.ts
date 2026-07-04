import { defineTool } from "eve/tools";
import { z } from "zod";
import { getBaseUrl } from "../lib/utils";

export default defineTool({
  description: "List all memories stored in the vault.",
  inputSchema: z.object({
    userId: z.string().describe("Extract this exactly from 'System Info (Hidden): UserID=\"...\"' in the system context."),
  }),
  async execute({ userId }) {
    if (!userId) throw new Error("userId is required");
    
    const url = `${getBaseUrl()}/api/memory`;
    const response = await fetch(url, { headers: { 'x-internal-secret': 'eve-bubbles-secret', 'x-user-id': userId } });
    
    if (!response.ok) throw new Error('Failed to list memories');
    return await response.json();
  },
});
