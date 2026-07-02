import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: 'Read the full contents of a widget on the canvas using its ID. Use this when you need to see the exact text, markdown, or diagram source code of a specific widget.',
  inputSchema: z.object({
    id: z.string().describe("The ID of the widget to read."),
  }),
  async execute({ id }) {
    // This tool is intercepted by the client, which injects the result.
    // If the server reaches this, it means the client didn't handle it.
    throw new Error(`Widget read failed: Client did not intercept the tool call for widget ID ${id}.`)
  },
});
