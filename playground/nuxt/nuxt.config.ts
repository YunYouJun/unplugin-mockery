import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    // in prod
    // 'unplugin-mockery/nuxt',

    // for dev
    '../../src/nuxt',
  ],

  unpluginMockery: {
    dirs: [
      fileURLToPath(new URL('../mocks', import.meta.url)),
    ],
    client: {
      port: 51223,
    },
  },

  // vite: {
  //   plugins: [
  //     UnpluginMockery({
  //       mockDir,
  //       client: {
  //         port: 51223,
  //       },
  //     }),
  //   ],
  // },
})
