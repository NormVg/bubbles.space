import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Update an existing widget on the user's canvas. Use this to modify its content or move it around.",
  inputSchema: z.object({
    id: z.string().describe("The ID of the widget to update."),
    width: z.number().optional().describe("The new width in pixels (optional)."),
    height: z.number().optional().describe("The new height in pixels (optional)."),
    x: z.number().optional().describe("The new X coordinate (optional)."),
    y: z.number().optional().describe("The new Y coordinate (optional)."),
    title: z.string().optional().describe("A new title (optional)."),
    data: z.record(z.any()).optional().describe("The new data content (optional). For timers, you can pass { action: 'start' | 'pause' | 'reset' } to control it.")
  }),
  async execute(input) {
    return {
      action: "update_widget",
      payload: input
    };
  },
});
