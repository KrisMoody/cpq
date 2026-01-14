import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/ui'],

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'system'
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || ''
  },

  nitro: {
    // Note: @prisma/client alias removed - imports use generated client directly
    // The new prisma-client generator requires @prisma/client/runtime to remain unaliased
  }
})
