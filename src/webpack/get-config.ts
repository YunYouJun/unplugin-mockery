import type Server from 'webpack-dev-server'
import consola from 'consola'
import colors from 'picocolors'
import type { Options } from '../types'
import { defaultOptions } from '../core/options'
import { serveClient } from '../core/client'
import { globalState } from '../core/env'
import { clientDistFolder } from '../core/constants'

import { MockeryServer } from '../mockery'
import { mockServer } from './mock-server'

/**
 * Get webpack config
 * @param options
 */
export async function getWebpackConfig(options: Options = defaultOptions) {
  globalState.startTimestamp = performance.now()

  options = Object.assign({}, defaultOptions, options)

  const startTimestamp = performance.now()
  const mockeryServer = new MockeryServer(options)
  // do not async to avoid register api failed
  await mockeryServer.init()

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

        mockServer(devServer, options)
        mockeryServer.writeSceneSchema().then(() => {
          const consumedTime = performance.now() - startTimestamp
          consola.success(`Mock Server Started: ${colors.green(`${consumedTime.toFixed(2)}ms`)}`)
        })

        return middlewares
      },
    },
  }

  if (options.client?.enable) {
    serveClient({
      staticPath: clientDistFolder,
      port: options.client?.port,
    })
  }
  else {
    consola.info('Mockery Client is disabled')
  }

  return webpackConfig
}
