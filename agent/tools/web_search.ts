import { defineTool } from 'eve/tools'
import { z } from 'zod'
import * as cheerio from 'cheerio'

export default defineTool({
  description: 'Search the web using DuckDuckGo to find real-time information, news, or facts. Use this tool when you need up-to-date knowledge.',
  inputSchema: z.object({
    query: z.string().min(1).describe('The search query')
  }),
  async execute({ query }) {
    try {
      const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      })
      
      if (!response.ok) {
        return { error: `DuckDuckGo responded with status ${response.status}` }
      }

      const html = await response.text()
      const $ = cheerio.load(html)
      const results: Array<{ title: string, url: string, snippet: string }> = []

      $('.result').each((i, element) => {
        // Limit to top 5 results
        if (results.length >= 5) return false

        const titleElement = $(element).find('.result__title .result__a')
        const title = titleElement.text().trim()
        
        let url = titleElement.attr('href')
        if (url && url.startsWith('//duckduckgo.com/l/?uddg=')) {
          // Parse the actual URL from the redirect link
          try {
            const urlObj = new URL('https:' + url)
            const uddg = urlObj.searchParams.get('uddg')
            if (uddg) {
              url = decodeURIComponent(uddg)
            }
          } catch (e) {
            // keep original if parsing fails
          }
        }
        
        const snippet = $(element).find('.result__snippet').text().trim()

        if (title && url && snippet) {
          results.push({ title, url, snippet })
        }
      })

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
