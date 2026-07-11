import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    // Determine the Ollama endpoint from env variables, or default to localhost
    const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
    
    const response = await fetch(`${ollamaHost}/api/tags`);
    if (!response.ok) {
      throw new Error(`Ollama API responded with status ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      models: data.models || [],
    };
  } catch (error) {
    console.error('Failed to fetch Ollama models:', error);
    return {
      success: false,
      models: [],
      error: 'Failed to fetch models from Ollama. Ensure Ollama is running.',
    };
  }
});
