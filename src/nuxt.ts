import type { Options } from './types'
import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import { defaultOptions } from './core/options'
import vite from './vite'
import '@nuxt/schema'

export interface ModuleOptions extends Options {

}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-unplugin-mockery',
    configKey: 'unpluginMocker',
  },
  defaults: {
    // ...default options
    ...defaultOptions,
  },
  setup(options, _nuxt) {
    addVitePlugin(() => vite(options), {
      dev: true,
      build: true,
      client: true,
      server: false,
    })
    // addWebpackPlugin(() => webpack(options))
    // ...
  },
})
