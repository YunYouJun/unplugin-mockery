import type Server from 'webpack-dev-server'

import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import consola from 'consola'
import type { Options } from './types'
import { mockServer } from './webpack/mock-server'
import { defaultOptions } from './core/options'

export * from './types'

export * from './webpack/mock-server'

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
      compiler.hooks.afterEnvironment.tap('unplugin-mockery', () => {
        consola.debug('After Environment Hook done!')

        compiler.options.devServer = {
          ...compiler.options.devServer,
          setupMiddlewares(middlewares, devServer) {
            // add custom
            mockServer(devServer, options)

            return middlewares
          },
        } as Server.Configuration
      })
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
