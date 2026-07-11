import { defineTool } from "eve/tools";
import { z } from "zod";
import { getBaseUrl } from "../lib/utils";
import { requireUserId } from "../lib/auth";

export default defineTool({
  description: "List all memories stored in the vault.",
  inputSchema: z.object({}),
  async execute(_input, ctx) {
    const userId = requireUserId(ctx);

    const url = `${getBaseUrl()}/api/memory`;
    const response = await fetch(url, { headers: { 'x-internal-secret': 'eve-bubbles-secret', 'x-user-id': userId } });

    if (!response.ok) throw new Error('Failed to list memories');
    return await response.json();
  },
});
