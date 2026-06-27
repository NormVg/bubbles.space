import { defineAgent } from "eve";
import { createOllama } from "ai-sdk-ollama";

const ollama = createOllama({
  apiKey: process.env.OLLAMA_API_KEY,
  baseURL: "https://ollama.com",
});

export default defineAgent({
	model: ollama("gemma4:31b-cloud"),
  modelContextWindowTokens: 128000,
});

