import { defineTool } from "eve/tools";
import { z } from "zod";
import { mem } from "./_memory";

export default defineTool({
  description: "Store a new memory in OpenMemory.",
  inputSchema: z.object({
    content: z.string().describe("The text content of the memory to store."),
    user_id: z.string().optional().describe("The user identifier this memory belongs to."),
    tags: z.array(z.string()).optional().describe("An optional list of tags for the memory."),
  }),
  async execute({ content, user_id, tags }) {
    try {
      const metadata = {
        user_id,
        tags,
        created_at: Date.now(),
      };
      
      const memory = await mem.add(content, metadata);
      return { success: true, memory };
    } catch (error: any) {
      throw new Error(`Failed to store memory: ${error.message}`);
    }
  },
});
