import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

export default defineTool({
  description: "Ask the user a clarifying question or a choice mid-turn and park until they answer.",
  inputSchema: z.object({
    prompt: z.string().describe("The question to put to the user."),
    options: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        style: z.enum(["primary", "default", "danger", "ghost"]).optional().default("default")
      })
    ).optional().describe("An optional list of choices to offer the user."),
    allowFreeform: z.boolean().optional().default(true).describe("Whether the user may answer with free text."),
  }),
  // By using always(), we durably pause the agent's execution.
  // The system will emit an 'input.requested' event to the frontend.
  approval: always(),
  
  async execute(input) {
    // When the user answers the question, the system resumes the execution here.
    // The user's answer will be processed by the framework and appended to the 
    // conversation history, so we don't necessarily need to return anything complex here.
    return {
      status: "Question asked and answered",
      details: "The user has provided their input. Proceed with their response."
    };
  }
});
