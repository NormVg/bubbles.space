


import { defineAgent } from "eve";
import { createOllama } from "ai-sdk-ollama";

const ollama = createOllama({
  apiKey: process.env.OLLAMA_API_KEY,
  baseURL: "https://ollama.com",
});

export default defineAgent({
	model: ollama("gemma4:31b-cloud"),
  modelContextWindowTokens: 128000,
  build: {
    // yt-search dynamically requires cheerio at runtime.
    // Eve's compiler can't trace dynamic requires, so we list them here
    // to keep them external and trace them into the Vercel output.
    externalDependencies: ['yt-search', 'cheerio'],
  },
});

