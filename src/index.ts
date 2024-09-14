import type { UnpluginFactory } from 'unplugin'

import type { ResolvedConfig, ViteDevServer } from 'vite'
import type Server from 'webpack-dev-server'
import type { Options } from './types'
import escapeHtml from 'escape-html'
import c from 'picocolors'
import { createUnplugin } from 'unplugin'
import { serveClient } from './core/client'
import { clientDistFolder } from './core/constants'

import { defaultOptions } from './core/options'
import { createMockServer, createVitePlugin } from './core/vite'
import { getWebpackConfig } from './core/webpack'
import { MockeryDB, MockeryServer } from './mockery'

export * from './core'
export * from './types'

const PLUGIN_NAME = 'unplugin:webpack'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options) => {
  options = {
    ...defaultOptions,
    ...options,
    client: {
      ...defaultOptions.client,
      ...options?.client,
    },
  }

  let viteConfig: ResolvedConfig

  const {
    setupMiddlewarePerf,
    requestMiddleware,
  } = createVitePlugin()

  return {
    name: 'unplugin-mockery',
    transformInclude(id) {
      return id.endsWith('main.ts')
    },
    transform(code) {
      const htmlCodeLines = [
        '<h1>Hello Unplugin!</h1>',
        `<pre><code>${escapeHtml(JSON.stringify(options || {}))}</code></pre>`,
      ]
      return code.replace('__UNPLUGIN__', htmlCodeLines.join(''))
    },

    webpack(compiler) {
      compiler.hooks.environment.tap(PLUGIN_NAME, async () => {
        const webpackConfig = await getWebpackConfig(options)
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

      /**
       * add script to html
       */
      function addScriptToHtml(html: string) {
        const script = [
          `<script src="http://localhost:${MockeryDB.options.client?.port}/"></script>`,
          `<script>`,
          `  window.__MOCKERY__ = ${JSON.stringify(MockeryDB.options)};`,
          `</script>`,
        ].join('\n')
        return html.replace('</head>', `${script}</head>`)
      }

      // mount tools for page
      compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
        // @ts-expect-error html webpack plugin api
        const htmlWebpackPluginBeforeHtmlProcessing = compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing
        if (htmlWebpackPluginBeforeHtmlProcessing) {
          htmlWebpackPluginBeforeHtmlProcessing.tapAsync(PLUGIN_NAME, async (data: { html: string }, cb: (arg0: null, arg1: any) => void) => {
            data.html = addScriptToHtml(data.html)
            cb(null, data)
          })
        }
        else {
          // eslint-disable-next-line ts/no-require-imports
          require('html-webpack-plugin')
            .getHooks(compilation)
            .beforeEmit
            .tapAsync(PLUGIN_NAME, async (data: { html: string }, cb: (arg0: null, arg1: any) => void) => {
              data.html = addScriptToHtml(data.html)
              cb(null, data)
            })
        }
      })
    },

    vite: {
      name: PLUGIN_NAME,
      enforce: 'pre',

      apply(_, { command }) {
        if (command === 'serve')
          return true
        if (command === 'build')
          return true
        return false
      },

      configResolved(config) {
        viteConfig = config
        createMockServer(options, config)
      },

      async configureServer(server: ViteDevServer) {
        const base = (options.base ?? server.config.base) || '/'

        // init
        const mockeryServer = new MockeryServer(options)
        await mockeryServer.init()

        const { listener } = serveClient({
          staticPath: clientDistFolder,
        })
        const address = listener.address()
        const port = typeof address === 'string' ? 0 : address?.port

        if (!port) {
          server.config.logger.error('Failed to get port')
          return
        }

        const _print = server.printUrls
        server.printUrls = () => {
          const host = `${viteConfig.server.https ? 'https' : 'http'}://localhost:${port}`

          _print()

          // print
          const colorUrl = (url: string) => c.magenta(url.replace(/:(\d+)\//, (_, port) => `:${c.bold(port)}/`))
          viteConfig.logger.info(`  ${c.green('➜')}  ${c.bold('Mockery')}: ${colorUrl(`${host}${base}`)}`)
        }

        // middleware
        const middleware = await requestMiddleware(options)
        server.middlewares.use(middleware)

        return () => {
          setupMiddlewarePerf(server.middlewares.stack)
        }
      },
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
