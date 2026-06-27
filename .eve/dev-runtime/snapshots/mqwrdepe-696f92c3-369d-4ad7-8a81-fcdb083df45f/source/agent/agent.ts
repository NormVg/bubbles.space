// import { defineAgent } from "eve";
// import { createOllama } from "ai-sdk-ollama";

// const ollama = createOllama({
//   // Use the system provided OLLAMA_API_KEY, but Ollama is local, so it might not need a key, just standard baseURL
//   // Note: For standard local Ollama, baseURL is usually http://localhost:11434/api
//   // but using what the user provided in ollama-eve.md:
//   baseURL: process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434/api",
// });

// export default defineAgent({
//   model: ollama("gemma4:31b-cloud"),
//   modelContextWindowTokens: 128000,
//   instructions: "You are a helpful AI assistant in a Nuxt application."
// });



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

