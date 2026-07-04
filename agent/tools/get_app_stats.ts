import { defineTool } from "eve/tools";
import { z } from "zod";
import { getBaseUrl } from "../lib/utils";

export default defineTool({
  description: "Get the current health and statistics of the Bubbles server, including memory usage, uptime, and node version.",
  inputSchema: z.object({}),
  async execute() {
    try {
      // The Nitro server exposes this endpoint. 
      // We try fetching it locally.
      const url = `${getBaseUrl()}/api/health`;
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      // Fallback if network request fails, we can just return process metrics directly 
      // since the agent is running in the same Node environment!
      return {
        status: 'fallback_direct_read',
        warning: 'Could not reach /api/health over HTTP. Returning direct process stats.',
        error: error.message,
        uptime: process.uptime(),
        memoryUsage: {
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB',
          heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
          heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        },
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: new Date().toISOString()
      };
    }
  },
});
