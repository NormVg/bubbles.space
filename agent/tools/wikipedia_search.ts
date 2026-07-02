import { defineTool } from 'eve/tools'
import { z } from 'zod'

export default defineTool({
  description: 'Search Wikipedia to find encyclopedic facts, history, and background information about a topic.',
  inputSchema: z.object({
    query: z.string().min(1).describe('The search query')
  }),
  async execute({ query }) {
    try {
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json`)
      
      if (!response.ok) {
        return { error: `Wikipedia responded with status ${response.status}` }
      }

      const data = await response.json()
      const results: Array<{ title: string, url: string, snippet: string }> = []

      if (data?.query?.search) {
        for (const item of data.query.search.slice(0, 5)) {
          // Remove HTML tags from snippet
          const cleanSnippet = item.snippet.replace(/<\/?[^>]+(>|$)/g, "")
          results.push({
            title: item.title,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
            snippet: cleanSnippet
          })
        }
      }

      if (results.length === 0) {
        return { message: 'No results found on Wikipedia.' }
      }

      return { results }
    } catch (error: any) {
      return { error: error.message || 'Unknown error occurred during Wikipedia search.' }
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
