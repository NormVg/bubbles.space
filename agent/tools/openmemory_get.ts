import { defineTool } from "eve/tools";
import { z } from "zod";
import { mem } from "./_memory";

export default defineTool({
  description: "Retrieve a specific memory by its unique ID from OpenMemory.",
  inputSchema: z.object({
    id: z.string().describe("The unique identifier (UUID) of the memory."),
  }),
  async execute({ id }) {
    try {
      const memory = await mem.get(id);
      if (!memory) {
        return { success: false, message: `No memory found with ID: ${id}` };
      }
      return { success: true, memory };
    } catch (error: any) {
      throw new Error(`Failed to get memory by ID: ${error.message}`);
    }
  },
});
