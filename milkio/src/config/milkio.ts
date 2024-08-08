import { defineConfig } from 'milkio'

export const configMilkio = defineConfig(({ config }) => {
  return config({
    debug: true,

    // http server
    ignorePathLevel: 0,
    corsAllowMethods: '*',
    corsAllowHeaders: '*',
    corsAllowOrigin: '*',
  }).done()
})
