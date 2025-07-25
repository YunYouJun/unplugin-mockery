import type { WebpackCompiler } from 'unplugin'
import type Server from 'webpack-dev-server'
import type { MockeryOptions } from '../../types'
import { consola } from 'consola'
import { serveClient } from '../../core/client'
import { CLIENT_DIST_DIR } from '../../core/constants'

import { defaultOptions, resolveOptions } from '../../core/options'
import { createMockeryContext } from '../../mockery'
import { loadMockeryConfig } from '../../mockery/config'
import { PLUGIN_NAME } from '../config'
import { GLOBAL_STATE } from '../env'
import { getRequestMiddleware } from '../middleware'

/**
 * Get webpack config
 * @param options
 */
export async function getWebpackConfig(options: MockeryOptions = defaultOptions) {
  options = Object.assign({}, defaultOptions, options)

  const resolvedConfig = await loadMockeryConfig('', options)
  const ctx = createMockeryContext(resolvedConfig.config)
  await ctx.init()
  const middleware = getRequestMiddleware(ctx)

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
        middlewares.unshift(middleware)
        return middlewares
      },
    },
  }

  if (options.client?.enable) {
    serveClient({
      staticPath: CLIENT_DIST_DIR,
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
  const options = GLOBAL_STATE.mockeryCtx?.options || defaultOptions
  const script = [
    `<script src="http://localhost:${options.client?.port}/"></script>`,
    `<script>`,
    `  window.__MOCKERY__ = ${JSON.stringify(options)};`,
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
  constructor(public options: MockeryOptions = defaultOptions) {
    this.options = resolveOptions(options)
  }

  apply(compiler: WebpackCompiler) {
    const port = (GLOBAL_STATE.mockeryCtx?.options.client?.port || 0).toString()
    // eslint-disable-next-line node/prefer-global/process
    process.env.MOCKERY_CLIENT_PORT = port
    // eslint-disable-next-line node/prefer-global/process
    process.env.VUE_APP_MOCKERY_CLIENT_PORT = port
    // eslint-disable-next-line node/prefer-global/process
    process.env.NUXT_MOCKERY_CLIENT_PORT = port

    // mount tools for page
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      consola.info('[unplugin-mockery] inject by html-webpack-plugin ...')
      applyToHtmlWebpackPlugin(compilation)
    })
  }
}
