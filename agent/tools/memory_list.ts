import { defineTool } from "eve/tools";
import { z } from "zod";
import { getBaseUrl } from "../lib/utils";

export default defineTool({
  description: "List all memories stored in the vault.",
  inputSchema: z.object({
    userId: z.string().describe("Extract this exactly from 'System Info (Hidden): UserID=\"...\"' in the system context. If not found, output 'MISSING'."),
  }),
  async execute({ userId }) {
    if (!userId || userId === 'MISSING' || userId === 'undefined') {
      return "Error: Cannot access memory because the UserID is missing from the system context. The user might not be logged in or the session is still loading.";
    }
    
    const url = `${getBaseUrl()}/api/memory`;
    const response = await fetch(url, { headers: { 'x-internal-secret': 'eve-bubbles-secret', 'x-user-id': userId } });
    
    if (!response.ok) throw new Error('Failed to list memories');
    return await response.json();
  },
});
