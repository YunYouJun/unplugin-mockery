import type Server from 'webpack-dev-server'
import bodyParser from 'body-parser'

import chokidar from 'chokidar'

import consola from 'consola'
import chalk from 'chalk'
import { glob } from 'fast-glob'

import type { MockMethod, Options } from '../types'

// eslint-disable-next-line ts/no-require-imports
const jiti = require('jiti')(__filename)

export function mockServer(devServer: Server, options: Options) {
  const files = glob.sync('**/*.ts', {
    cwd: options.mockDir,
    absolute: true,
  })

  function registerRoutes(app: Exclude<Server['app'], undefined>) {
    const prevRouteNum = app._router.stack.length

    for (const file of files) {
      consola.info(` > Registering Mock Server: ${chalk.dim(file)}`)
      const mockMethods = jiti(file).default as MockMethod[]

      mockMethods.forEach((mockMethod) => {
        const { method, url, response, rawResponse } = mockMethod
        setTimeout(() => {
          app[method || 'get'](url, (req, res) => {
            if (rawResponse) {
              rawResponse(
                req,
                res,
              )
            }
            else {
              res.json(response)
            }
          })
        }, mockMethod.timeout || 0)
      })
    }

    const mockRoutesLength = app._router.stack.length - prevRouteNum
    return {
      mockRoutesLength,
      mockStartIndex: app._router.stack.length - mockRoutesLength,
    }
  }

  function unregisterRoutes() {
    Object.keys(require.cache).forEach((i) => {
      if (i.includes(options.mockDir)) {
        delete require.cache[require.resolve(i)]
      }
    })
  }

  const { app } = devServer
  if (!app) {
    return
  }

  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  )

  const mockRoutes = registerRoutes(app)
  consola.success(`\n > Mock Server Registered success!`)

  let mockRoutesLength = mockRoutes.mockRoutesLength
  let mockStartIndex = mockRoutes.mockStartIndex

  chokidar
    .watch(options.mockDir, {
      ignoreInitial: true,
    })
    .on('all', (event, path) => {
      if (event === 'change' || event === 'add') {
        try {
          // remove mock routes stack
          app._router.stack.splice(mockStartIndex, mockRoutesLength)

          // clear routes cache
          unregisterRoutes()

          const mockRoutes = registerRoutes(app)
          mockRoutesLength = mockRoutes.mockRoutesLength
          mockStartIndex = mockRoutes.mockStartIndex

          consola.success(`\n > Mock Server hot reload success! changed  ${chalk.dim(path)}`)
        }
        catch (error) {
          consola.error(error)
        }
      }
    })
}
