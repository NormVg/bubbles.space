import { defineTool } from 'eve/tools'
import { z } from 'zod'

export default defineTool({
  description: 'Search the web using Ollama API to find real-time information, news, or facts. Use this tool when you need up-to-date knowledge.',
  inputSchema: z.object({
    query: z.string().min(1).describe('The search query')
  }),
  async execute({ query }) {
    try {
      const apiKey = process.env.OLLAMA_API_KEY
      if (!apiKey) {
        return { error: 'OLLAMA_API_KEY environment variable is missing. Please set it in your environment variables.' }
      }

      const response = await fetch('https://ollama.com/api/web_search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      })

      if (!response.ok) {
        return { error: `Ollama Search API responded with status ${response.status}` }
      }

      const data = await response.json()
      const results: Array<{ title: string, url: string, snippet: string }> = []

      if (data && data.results && Array.isArray(data.results)) {
        for (const item of data.results) {
          if (item.title && item.url && item.content) {
            results.push({
              title: item.title,
              url: item.url,
              snippet: item.content // map 'content' to 'snippet' for backward compatibility
            })
          }
        }
      }

      if (results.length === 0) {
        return { message: 'No results found.' }
      }

      return { results }
    } catch (error: any) {
      return { error: error.message || 'Unknown error occurred during web search.' }
    }
  },
  toModelOutput(output) {
    if ('error' in output) {
      return { type: 'json', value: { error: output.error } }
    }
    if ('message' in output) {
      return { type: 'json', value: { message: output.message } }
    }
    return { type: 'json', value: output.results }
  }
})
