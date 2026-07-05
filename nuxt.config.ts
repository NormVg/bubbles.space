// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', 'eve/nuxt', '@vueuse/nuxt', 'nuxt-lucide-icons'],
  css: ['~/assets/base.css'],
  app: {
    head: {
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