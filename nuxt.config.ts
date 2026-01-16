// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxt/eslint'],

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'system'
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || '',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    neonAuthUrl: process.env.NEON_AUTH_URL || '',
    public: {
      neonAuthUrl: process.env.NEON_AUTH_URL || ''
    }
  },

  nitro: {
    // Note: @prisma/client alias removed - imports use generated client directly
    // The new prisma-client generator requires @prisma/client/runtime to remain unaliased
  },

  routeRules: {
    '/api/**': {
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  }
})
