import { defineTool } from "eve/tools";
import { z } from "zod";
import { getBaseUrl } from "../lib/utils";
import { requireUserId } from "../lib/auth";

export default defineTool({
  description: "Store a memory in the vault. Auto-evolution: if a memory at the same path already exists, the old one is closed (preserved as history) and the new one becomes the current truth. Exact duplicate content is silently skipped.",
  inputSchema: z.object({
    path: z.string().describe("Virtual path within the memory vault (e.g., 'identity/editor.md', 'semantic/tech-stack.md'). Must start with one of: working/, episodic/, semantic/, procedural/, identity/, hot/, archive/, system/"),
    title: z.string().describe("Human-readable title for the memory"),
    content: z.string().describe("The Markdown content of the memory"),
    source: z.enum(["agent", "user"]).optional().default("agent").describe("Who created this: 'agent' (you decided to save it) or 'user' (the user explicitly asked you to remember)"),
    metadata: z.record(z.any()).optional().describe("Optional metadata such as aliases, tags, or relations"),
  }),
  async execute({ path, title, content, source, metadata }, ctx) {
    const userId = requireUserId(ctx);

    const url = `${getBaseUrl()}/api/memory`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': 'eve-bubbles-secret',
        'x-user-id': userId,
      },
      body: JSON.stringify({ path, title, content, source, metadata }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to store memory: ${response.status} - ${text}`);
    }
    const result = await response.json();

    if (result._duplicate) {
      return "No duplicate added — identical content already exists at this path.";
    }

    return result.version > 1
      ? `Memory evolved to v${result.version} at ${result.path}.`
      : `Memory stored at ${result.path}.`;
  },
});
