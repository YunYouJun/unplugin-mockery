import type Server from 'webpack-dev-server'

import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { defaultOptions } from './core/options'
import { getWebpackConfig } from './webpack/get-config'

export * from './core'
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
        const webpackConfig = getWebpackConfig(options)
        compiler.options.devServer = {
          ...compiler.options.devServer,
          setupMiddleware: (middlewares: Server.Middleware[], devServer: Server) => {
            webpackConfig.devServer.setupMiddlewares?.(middlewares, devServer)
            // @ts-expect-error use private API
            compiler.options.devServer?.setupMiddlewares?.(middlewares, devServer)

            return middlewares
          },
        }
      })
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
