import type Server from 'webpack-dev-server'

import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import consola from 'consola'
import type { Options } from './types'
import { mockServer } from './webpack/mock-server'
import { defaultOptions } from './core/options'
import { getWebpackConfig } from './webpack/get-config'

export * from './types'

const PLUGIN_NAME = 'unplugin:webpack'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options) => {
  options = { ...defaultOptions, ...options }

  return {
    name: 'unplugin-mockery',
    transformInclude(id) {
      return id.endsWith('main.ts')
    },
    transform(code) {
      return code.replace('__UNPLUGIN__', `Hello Unplugin! ${options}`)
    },

    webpack(compiler) {
      compiler.hooks.environment.tap(PLUGIN_NAME, () => {
        const { setupMiddlewares } = getWebpackConfig(options)
        compiler.options.devServer = {
          ...compiler.options.devServer,
          setupMiddlewares,
        }
      })
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
