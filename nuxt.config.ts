// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', 'eve/nuxt', '@vueuse/nuxt', 'nuxt-lucide-icons'],
  css: ['~/assets/base.css'],
  app: {
    head: {
      title: 'Bubbles — Your Spatial AI Workspace',
      meta: [
        { name: 'description', content: 'A spatial canvas workspace powered by AI. Organize your thoughts, notes, and media in an infinite, intelligent space.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Bubbles — Your Spatial AI Workspace' },
        { property: 'og:description', content: 'A spatial canvas workspace powered by AI. Organize your thoughts, notes, and media in an infinite, intelligent space.' },
        { property: 'og:image', content: 'https://bubbles.taohq.org/og.png' },
        { property: 'og:url', content: 'https://bubbles.taohq.org' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Bubbles — Your Spatial AI Workspace' },
        { name: 'twitter:description', content: 'A spatial canvas workspace powered by AI. Organize your thoughts, notes, and media in an infinite, intelligent space.' },
        { name: 'twitter:image', content: 'https://bubbles.taohq.org/og.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
  nitro: {
    experimental: { websocket: true }
  },
  runtimeConfig: {
    ablyApiKey: process.env.ABLY_API_KEY || '',
    upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL || '',
    upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    public: {
      appLocked: process.env.APP_LOCKED === 'true',
      whitelistedEmails: process.env.WHITELISTED_EMAILS || ''
    }
  }
})