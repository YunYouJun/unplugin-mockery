import type { UnpluginFactory } from 'unplugin'

import type { ResolvedConfig, ViteDevServer } from 'vite'
import type Server from 'webpack-dev-server'
import type { Options } from './types'
import process from 'node:process'
import escapeHtml from 'escape-html'
import fs from 'fs-extra'
import c from 'picocolors'
import { createUnplugin } from 'unplugin'

import { PLUGIN_NAME } from './core'
import { serveClient } from './core/client'
import { clientDistFolder, widgetClientEntry } from './core/constants'
import { resolveOptions } from './core/options'
import { createMockServer, createVitePlugin } from './core/vite'

import { getWebpackConfig, MockeryMountIFramePlugin } from './core/webpack'
import { MockeryDB, MockeryServer } from './mockery'

export * from './core'
export * from './types'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options) => {
  options = resolveOptions(options)

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

      async load(id) {
        if (id === 'unplugin-mockery/client') {
          return await fs.readFile(widgetClientEntry, 'utf-8')
        }
      },

      transformIndexHtml(html) {
        const script = `
import('${widgetClientEntry}').then(({ main }) => {
  main({
    port: ${options.client?.port || MockeryDB.options.client?.port},
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
