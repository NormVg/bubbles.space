


import { defineAgent, defineDynamic } from "eve";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export default defineAgent({
  model: defineDynamic({
    // The fallback model is used if dynamic selection returns null
    fallback: openrouter("anthropic/claude-3.5-sonnet:beta"),
    events: {
      "session.started": (_event, ctx) => {
        // Read user preferences
        const prefs = ctx.session?.auth?.initiator?.attributes;
        const userPreferredModel = prefs?.preferredModel as string | undefined;
        
        if (userPreferredModel) {
          return {
            model: userPreferredModel,
            modelOptions: {}
          };
        }
        
        return null;
      }
    }
  }),
  // Required when using a fallback model that doesn't have known Gateway metadata
  modelContextWindowTokens: 128000,
  reasoning: "medium",
  build: {
    // yt-search dynamically requires cheerio at runtime.
    externalDependencies: ['yt-search', 'cheerio'],
  },
});

