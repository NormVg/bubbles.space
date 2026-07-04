import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

async function main() {
  const embedding = await openrouter.embeddings.generate({
    requestBody: {
      model: "nvidia/llama-nemotron-embed-vl-1b-v2:free",
      input: ["What is in this text?"],
      encodingFormat: "float"
    }
  });

  console.log("Vector dimensions:", embedding.data[0].embedding.length);
}

main().catch(console.error);
