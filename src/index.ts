import escapeHtml from 'escape-html'

import c from 'picocolors'
import { createUnplugin } from 'unplugin'
import type { UnpluginFactory } from 'unplugin'
import type { ResolvedConfig, ViteDevServer } from 'vite'
import type Server from 'webpack-dev-server'
import { serveClient } from './core/client'
import { clientDistFolder } from './core/constants'
import { defaultOptions } from './core/options'

import { createMockServer, createVitePlugin } from './core/vite'
import { getWebpackConfig } from './core/webpack'
import { MockeryServer } from './mockery'
import type { Options } from './types'

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
