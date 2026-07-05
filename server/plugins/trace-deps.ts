// Force Nitro to trace and include these transitive dependencies in the Vercel deployment bundle.
// yt-search dynamically requires cheerio at runtime, which Vercel's dependency tracer misses.
// A static import here ensures cheerio is included in the serverless function output.
import 'cheerio'

export default defineNitroPlugin(() => {})
