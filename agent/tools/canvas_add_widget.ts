import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Add a new widget to the user's spatial canvas. Use this when you want to create a sticky note, markdown document, or mermaid diagram for the user to see.",
  inputSchema: z.object({
    type: z.enum(['markdown', 'mermaid', 'timer', 'graph']).describe("The type of widget to create."),
    width: z.number().describe("The width of the widget in pixels (e.g. 300 to 600)."),
    height: z.number().describe("The height of the widget in pixels (e.g. 200 to 500)."),
    title: z.string().describe("A short title for the widget."),
    data: z.record(z.any()).describe("The content of the widget. For markdown: { content: '...' }. For mermaid: { chart: '...' }. For timer: { duration: 300 } (duration is in seconds). For graph: { graphType: 'line' | 'bar' | 'pie', labels: ['Q1', 'Q2', 'Q3', 'Q4'], datasets: [{ label: 'Sales', values: [100, 200, 150, 300] }] }")
  }),
  async execute(input) {
    // We return a strictly formatted action payload.
    // The client UI intercepts this specific tool result and applies it to the Pinia widget store.
    return {
      action: "add_widget",
      payload: {
        id: crypto.randomUUID(),
        ...input,
        x: 1000, // Client will auto-layout if it collides
        y: 700
      }
    };
  },
});
