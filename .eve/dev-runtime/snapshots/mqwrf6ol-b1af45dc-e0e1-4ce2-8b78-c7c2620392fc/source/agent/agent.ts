


import { defineAgent } from "eve";
import { createOllama } from "ai-sdk-ollama";

const ollama = createOllama({
  apiKey: "6827c781947f4138ada2c9deb599adba.oGzunrznyQnE4kHJMM7lRmim",
  baseURL: "https://ollama.com",
});

export default defineAgent({
	model: ollama("gemma4:31b-cloud"),
  modelContextWindowTokens: 128000,
});

