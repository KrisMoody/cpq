// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxt/eslint'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },

  colorMode: {
    preference: 'light'
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || '',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    neonAuthUrl: process.env.NEON_AUTH_URL || '',
    disableAuth: process.env.DISABLE_AUTH === 'true',
    public: {
      neonAuthUrl: process.env.NEON_AUTH_URL || '',
      disableAuth: process.env.DISABLE_AUTH === 'true'
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
