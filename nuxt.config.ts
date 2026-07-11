// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', 'eve/nuxt', '@vueuse/nuxt', 'nuxt-lucide-icons'],
  css: ['~/assets/base.css'],
  app: {
    head: {
      title: 'Bubbles.space — Your Persistent AI Workspace',
      meta: [
        { name: 'description', content: 'Bubbles.space is a persistent AI workspace that\'s always open, always in sync, and helps you think, build, and get things done in the AI era.' },
        { name: 'keywords', content: 'AI workspace, spatial canvas, persistent workspace, AI assistant, productivity, Bubbles, Bubbles.space, visual thinking' },
        { name: 'author', content: 'Tao HQ' },
        { name: 'theme-color', content: '#ffffff' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Bubbles.space — Your Persistent AI Workspace' },
        { property: 'og:description', content: 'Stop managing apps. Open one space, stay there, and let AI help you get things done. That\'s Bubbles.space.' },
        { property: 'og:image', content: 'https://bubbles.taohq.org/og.png' },
        { property: 'og:url', content: 'https://bubbles.taohq.org' },
        { property: 'og:site_name', content: 'Bubbles.space' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Bubbles.space — Your Persistent AI Workspace' },
        { name: 'twitter:description', content: 'Bubbles.space is an always-on AI workspace that remembers, syncs, and helps you get things done—like having your own Jarvis for the AI era.' },
        { name: 'twitter:image', content: 'https://bubbles.taohq.org/og.png' },
        { name: 'twitter:creator', content: '@taohq' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://bubbles.taohq.org' }
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