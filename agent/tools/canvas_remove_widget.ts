import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Remove/delete an existing widget from the user's canvas.",
  inputSchema: z.object({
    id: z.string().describe("The ID of the widget to remove.")
  }),
  async execute(input) {
    return {
      action: "remove_widget",
      payload: input
    };
  },
});
