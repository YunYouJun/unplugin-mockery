import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import '@nuxt/schema'
import { defaultOptions } from './core/options'
import vite from './vite'
import webpack from './webpack'
import type { Options } from './types'

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
    addVitePlugin(() => vite(options))
    addWebpackPlugin(() => webpack(options))

    // ...
  },
})
