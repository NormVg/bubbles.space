


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
        // Read user preferences
        const prefs = ctx.session?.auth?.initiator?.attributes;
        const userPreferredModel = prefs?.preferredModel as string | undefined;
        const reasoningEffort = prefs?.reasoningEffort as string | undefined;
        
        if (userPreferredModel) {
          return {
            model: userPreferredModel,
            modelOptions: {
              // We pass the reasoning effort down to the provider options
              // The AI SDK will apply this to models that support it
              providerOptions: reasoningEffort ? { reasoning: reasoningEffort } : {}
            }
          };
        }
        
        return null;
      }
    }
  }),
  // Default reasoning effort if not overridden dynamically
  reasoning: "high",
  build: {
    // yt-search dynamically requires cheerio at runtime.
    externalDependencies: ['yt-search', 'cheerio'],
  },
});

