// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
  ],
  devtools: { enabled: true },
  runtimeConfig: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GOV_API_KEY: process.env.GOV_API_KEY,
    OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-01',
  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },
})
