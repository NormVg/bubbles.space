import { defineTool } from "eve/tools";
import { z } from "zod";
import { getBaseUrl } from "../lib/utils";
import { requireUserId } from "../lib/auth";

export default defineTool({
  description: "Get a list of all files uploaded by the user to their workspace.",
  inputSchema: z.object({}),
  async execute(_input, ctx) {
    const userId = requireUserId(ctx);

    const url = `${getBaseUrl()}/api/files`;
    const response = await fetch(url, { headers: { 'x-internal-secret': 'eve-bubbles-secret', 'x-user-id': userId } });

    if (!response.ok) throw new Error('Failed to fetch user files');
    const data = await response.json();
    return data.files || [];
  },
});
