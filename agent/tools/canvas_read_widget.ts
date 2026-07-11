import { defineTool } from "eve/tools";
import { z } from "zod";
import { db } from "../../server/db";
import { widget } from "../../server/db/schema";
import { eq } from "drizzle-orm";

export default defineTool({
  description: 'Read the full contents of a widget on the canvas using its ID. Use this when you need to see the exact text, markdown, or diagram source code of a specific widget.',
  inputSchema: z.object({
    id: z.string().describe("The ID of the widget to read."),
  }),
  async execute({ id }, ctx) {
    // Attempt to read from the database if the client did not intercept
    const userId = ctx.session.auth?.current?.principalId;
    if (!userId) {
       throw new Error("Unauthorized: Cannot read widget without a valid user session.");
    }
    
    const records = await db.select().from(widget).where(eq(widget.id, id)).limit(1);
    const w = records[0];
    
    if (!w) {
       return `Widget with ID ${id} not found on canvas.`;
    }
    
    // Check ownership by joining workspace, or just trust the widget exists
    // (Actually, checking ownership is safer)
    const { workspace } = await import("../../server/db/schema");
    const wsRecords = await db.select().from(workspace).where(eq(workspace.id, w.workspaceId)).limit(1);
    const ws = wsRecords[0];
    
    if (!ws || ws.userId !== userId) {
       throw new Error("Unauthorized: Widget does not belong to the current user.");
    }

    let textContent = ''
    if (w.type === 'markdown') {
      textContent = (w.data as any)?.content || ''
    } else if (w.type === 'mermaid') {
      textContent = `\`\`\`mermaid\n${(w.data as any)?.chart || ''}\n\`\`\``
    } else {
      textContent = JSON.stringify(w.data)
    }
    
    return `Content of ${w.title || w.type} (ID: ${id}):\n\n${textContent}`
  },
});
