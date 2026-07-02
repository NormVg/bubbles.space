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
      // 1. Try DuckDuckGo
      const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      })
      
      let useFallback = false
      const results: Array<{ title: string, url: string, snippet: string }> = []

      if (response.ok) {
        const html = await response.text()
        const $ = cheerio.load(html)
        
        // Check for DDG Captcha/Block page
        if (html.includes('anomaly-modal') || html.includes('Unfortunately, bots use DuckDuckGo too')) {
          useFallback = true
        } else {
          $('.result').each((i, element) => {
            if (results.length >= 5) return false

            const titleElement = $(element).find('.result__title .result__a')
            const title = titleElement.text().trim()
            
            let url = titleElement.attr('href')
            if (url && url.startsWith('//duckduckgo.com/l/?uddg=')) {
              try {
                const urlObj = new URL('https:' + url)
                const uddg = urlObj.searchParams.get('uddg')
                if (uddg) {
                  url = decodeURIComponent(uddg)
                }
              } catch (e) {}
            }
            
            const snippet = $(element).find('.result__snippet').text().trim()

            if (title && url && snippet) {
              results.push({ title, url, snippet })
            }
          })
        }
      } else {
        useFallback = true
      }

      // 2. Fallback to Wikipedia API if DDG fails or blocks
      if (useFallback || results.length === 0) {
        try {
          const wikiResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json`)
          if (wikiResponse.ok) {
            const wikiData = await wikiResponse.json()
            if (wikiData?.query?.search) {
              for (const item of wikiData.query.search.slice(0, 5)) {
                // Remove HTML tags from snippet
                const cleanSnippet = item.snippet.replace(/<\/?[^>]+(>|$)/g, "")
                results.push({
                  title: item.title,
                  url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
                  snippet: cleanSnippet
                })
              }
            }
          }
        } catch (wikiError) {
          console.error("Wikipedia fallback failed", wikiError)
        }
      }

      if (results.length === 0) {
        if (!response.ok && useFallback) {
           return { error: `Search failed. DuckDuckGo responded with status ${response.status} and Wikipedia fallback yielded no results.` }
        }
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
