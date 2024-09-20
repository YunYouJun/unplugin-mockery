import type { WebpackCompiler } from 'unplugin'
import type Server from 'webpack-dev-server'
import type { Options } from '../../types'
import consola from 'consola'
import colors from 'picocolors'
import { serveClient } from '../../core/client'
import { clientDistFolder } from '../../core/constants'
import { globalState } from '../../core/env'

import { defaultOptions, resolveOptions } from '../../core/options'
import { MockeryDB, MockeryServer } from '../../mockery'
import { PLUGIN_NAME } from '../config'
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

/**
 * add script to html
 */
export function addScriptToHtml(html: string) {
  const script = [
    `<script src="http://localhost:${MockeryDB.options.client?.port}/"></script>`,
    `<script>`,
    `  window.__MOCKERY__ = ${JSON.stringify(MockeryDB.options)};`,
    `</script>`,
  ].join('\n')
  return html.replace('</head>', `${script}</head>`)
}

function applyToHtmlWebpackPlugin(compilation: any) {
  // html-webpack-plugin v4
  // eslint-disable-next-line ts/no-require-imports
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  HtmlWebpackPlugin.getHooks(compilation)
    .beforeEmit
    .tapAsync(PLUGIN_NAME, (data: { html: string }, cb: (arg0: null, arg1: any) => void) => {
      // Manipulate the content
      data.html = addScriptToHtml(data.html)
      cb(null, data)
    })
}

/**
 * config.plugin('html) for vue-cli
 * mount script
 */
export function configHtmlWebpackPlugin(config: any) {
  const htmlPlugin = config.plugin('html')
  htmlPlugin.tap((args: any) => {
    return args
  })
}

/**
 * Mockery Mount IFrame Plugin
 */
export class MockeryMountIFramePlugin {
  constructor(public options: Options = defaultOptions) {
    this.options = resolveOptions(options)
  }

  apply(compiler: WebpackCompiler) {
    const port = (MockeryDB.options.client?.port || 0).toString()
    // eslint-disable-next-line node/prefer-global/process
    process.env.MOCKERY_CLIENT_PORT = port
    // eslint-disable-next-line node/prefer-global/process
    process.env.VUE_APP_MOCKERY_CLIENT_PORT = port

    // mount tools for page
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      consola.info('[unplugin-mockery] inject by html-webpack-plugin ...')
      applyToHtmlWebpackPlugin(compilation)
    })
  }
}
