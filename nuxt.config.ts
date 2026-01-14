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
    alias: {
      '@prisma/client': resolve(__dirname, 'app/generated/prisma')
    }
  },

  alias: {
    '@prisma/client': resolve(__dirname, 'app/generated/prisma')
  }
})
