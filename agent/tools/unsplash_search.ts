import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Search for high-quality images on Unsplash by a keyword or query. Returns a list of image URLs. Useful for populating image gallery widgets.",
  inputSchema: z.object({
    query: z.string().describe("The search query (e.g. 'futuristic city', 'nature', 'office workspace')"),
    count: z.number().optional().describe("Number of images to return (max 10, default 3)"),
  }),
  async execute({ query, count = 3 }) {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      throw new Error("UNSPLASH_ACCESS_KEY environment variable is missing. Please add it to your .env file.");
    }

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&client_id=${accessKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        return { images: [] };
      }

      // Return the 'regular' size URLs for best balance of quality and performance
      const imageUrls = data.results.map((img: any) => img.urls.regular);
      
      return {
        query,
        images: imageUrls,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch images from Unsplash: ${error.message}`);
    }
  },
});
