import type Server from 'webpack-dev-server'
import consola from 'consola'
import colors from 'picocolors'
import type { Options } from '../types'
import { defaultOptions } from '../core/options'
import { serveClient } from '../core/client'
import { globalState } from '../core/env'
import { clientDistFolder } from '../core/constants'

import { mockServer } from './mock-server'

/**
 * Get webpack config
 * @param options
 */
export function getWebpackConfig(options: Options = defaultOptions) {
  globalState.startTimestamp = performance.now()

  options = Object.assign({}, defaultOptions, options)

  const webpackConfig: {
    devServer: Server.Configuration
  } = {
    devServer: {
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined')
        }

        // maybe add custom
        // middlewares.unshift((req, res, next) => {
        //   console.log(`Request URL: ${req.url}`)
        //   next()
        // })

        // eslint-disable-next-line no-console
        console.log()
        consola.start('Mock Server Starting...')

        const startTimestamp = performance.now()
        mockServer(devServer, options)
        const consumedTime = performance.now() - startTimestamp
        consola.success(`Mock Server Started: ${colors.green(`${consumedTime.toFixed(2)}ms`)}`)

        return middlewares
      },
    },
  }

  globalState.userOptions = options
  serveClient({
    staticPath: clientDistFolder,
    port: options.client?.port,
  })

  return webpackConfig
}
