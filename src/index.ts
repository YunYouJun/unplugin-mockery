import type Server from 'webpack-dev-server'

import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { mockServer } from './webpack/mock-server'
import { defaultOptions } from './core/options'

export * from './types'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options) => {
  options = { ...defaultOptions, ...options }

  return {
    name: 'unplugin-mocker',
    transformInclude(id) {
      return id.endsWith('main.ts')
    },
    transform(code) {
      return code.replace('__UNPLUGIN__', `Hello Unplugin! ${options}`)
    },

    webpack(compiler) {
      compiler.hooks.afterEnvironment.tap('unplugin-mocker', () => {
        // console.log('Webpack done!')
        const devServer = compiler.options.devServer as Server.Configuration
        if (devServer) {
          devServer.setupMiddlewares = (middlewares, devServer) => {
            // add custom
            mockServer(devServer, options)

            return middlewares
          }
        }
      })
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
