


import { defineAgent, defineDynamic } from "eve";
import { createOllama } from "ai-sdk-ollama";

const ollama = createOllama({
  apiKey: process.env.OLLAMA_API_KEY,
  baseURL: "https://ollama.com",
});

export default defineAgent({
  model: defineDynamic({
    // The fallback model is used if dynamic selection returns null
    fallback: ollama("gemma4:31b-cloud"),
    events: {
      "session.started": (_event, ctx) => {
        // Read the user's preferred model from their session auth attributes
        const userPreferredModel = ctx.session?.auth?.initiator?.attributes?.preferredModel as string | undefined;
        
        if (userPreferredModel) {
          // If a preference exists, route to it dynamically and optionally set context window
          return {
            model: userPreferredModel
          };
        }
        
        // Return null to drop back to the fallback model
        return null;
      }
    }
  }),
  // Pass the context window tokens for the fallback model
  modelOptions: {
    // Other options can go here
  },
  // Set reasoning effort to high
  reasoning: "high",
  build: {
    // yt-search dynamically requires cheerio at runtime.
    // Eve's compiler can't trace dynamic requires, so we list them here
    // to keep them external and trace them into the Vercel output.
    externalDependencies: ['yt-search', 'cheerio'],
  },
});

