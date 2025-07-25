import type { UnpluginFactory } from 'unplugin'

import type { ResolvedConfig, ViteDevServer } from 'vite'
import type Server from 'webpack-dev-server'
import type { MockeryContext } from './mockery'
import type { MockeryOptions } from './types'
import process from 'node:process'
import { colors } from 'consola/utils'
import fs from 'fs-extra'

import { createUnplugin } from 'unplugin'
import { CLIENT_DIST_DIR, WIDGET_CLIENT_ENTRY } from './constants'
import { PLUGIN_NAME } from './core'
import { serveClient } from './core/client'

import { getRequestMiddleware } from './core/middleware'
import { resolveOptions } from './core/options'
import { createVitePlugin } from './core/vite'
import { getWebpackConfig, MockeryMountIFramePlugin } from './core/webpack'
import { createMockeryContext } from './mockery'
import { loadMockeryConfig } from './mockery/config'

export * from './constants'
export * from './core'
export * from './mockery'
export * from './types'
export * from './utils'

export const unpluginFactory: UnpluginFactory<MockeryOptions | undefined> = (options) => {
  options = resolveOptions(options)

  let viteConfig: ResolvedConfig
  let mockeryCtx: MockeryContext

  const {
    setupMiddlewarePerf,
  } = createVitePlugin()

  return {
    name: 'unplugin-mockery',

    webpack(compiler) {
      if (process.env.NODE_ENV === 'development') {
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
        const mountIframe = new MockeryMountIFramePlugin(options)
        mountIframe.apply(compiler)
      }
    },

    vite: {
      name: PLUGIN_NAME,
      enforce: 'pre',

      apply(_, { command }) {
        if (command === 'serve')
          return true

        // do not run in build
        if (command === 'build')
          return false
        return false
      },

      async configResolved(config) {
        viteConfig = config

        // init
        // init mockery
        const resolvedConfig = await loadMockeryConfig('', options)
        mockeryCtx = createMockeryContext(resolvedConfig.config)
      },

      async configureServer(server: ViteDevServer) {
        const base = (options.base ?? server.config.base) || '/'
        const _print = server.printUrls

        // middleware
        const middleware = getRequestMiddleware(mockeryCtx)
        server.middlewares.use(middleware)

        return async () => {
          await mockeryCtx.init()

          const { listener } = await serveClient({
            staticPath: CLIENT_DIST_DIR,
            port: options.client?.port,
          })
          const address = listener.address()
          const port = typeof address === 'string' ? 0 : address?.port
          server.printUrls = () => {
            const host = `${viteConfig.server.https ? 'https' : 'http'}://localhost:${port}`

            _print()

            // print
            const colorUrl = (url: string) => colors.magenta(url.replace(/:(\d+)\//, (_, port) => `:${colors.bold(port)}/`))
            viteConfig.logger.info(`  ${colors.green('➜')}  ${colors.bold('Mockery')}: ${colorUrl(`${host}${base}`)}`)
          }
          setupMiddlewarePerf(server.middlewares.stack)
        }
      },

      async load(id) {
        if (id === 'unplugin-mockery/widget') {
          return await fs.readFile(WIDGET_CLIENT_ENTRY, 'utf-8')
        }
      },

      transformIndexHtml(html) {
        const resolvedOptions = mockeryCtx.options
        const script = `
import('${WIDGET_CLIENT_ENTRY}').then(({ main }) => {
  main({
    port: ${resolvedOptions.client?.port},
  })
})
        `

        return {
          html,
          tags: [
            {
              tag: 'script',
              injectTo: 'body',
              attrs: {
                type: 'module',
              },
              children: script,
            },
          ],
        }
      },
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
