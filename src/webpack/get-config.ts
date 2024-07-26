import type Server from 'webpack-dev-server'
import consola from 'consola'
import type { MockMethod, Options } from '../types'
import { defaultOptions } from '../core/options'
import { mockServer } from './mock-server'

/**
 * Get webpack config
 * @param options
 */
export function getWebpackConfig(options: Options = defaultOptions) {
  options = Object.assign({}, defaultOptions, options)

  const webpackConfig: {
    devServer: Server.Configuration
  } = {
    devServer: {
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined')
        }

        // add custom

        // // 插入自定义中间件
        // middlewares.unshift((req, res, next) => {
        //   console.log(`Request URL: ${req.url}`)
        //   next()
        // })

        consola.info('Mock Server Starting...')
        mockServer(devServer, options)

        return middlewares
      },
    },
  }

  return webpackConfig
}
