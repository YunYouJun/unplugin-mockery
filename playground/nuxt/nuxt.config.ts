import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  vite: {
    plugins: [],
  },

  modules: [
    ['unplugin-mockery/nuxt', {
      mockDir: fileURLToPath(new URL('../mock', import.meta.url)),
    }],
  ],
})
