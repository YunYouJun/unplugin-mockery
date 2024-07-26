import type Server from 'webpack-dev-server'
import bodyParser from 'body-parser'

import chokidar from 'chokidar'

import consola from 'consola'
import chalk from 'chalk'
import { glob } from 'fast-glob'

import type { Application } from 'express'
import type { MockMethod, Options } from '../types'

// eslint-disable-next-line ts/no-require-imports
const jiti = require('jiti')(__filename, {
  // clear cache
  requireCache: false,
})

export function mockServer(devServer: Server, options: Options) {
  if (options.debug) {
    consola.debug('Mock Server Starting...')
  }
  const files = glob.sync('**/*.ts', {
    cwd: options.mockDir,
    absolute: true,
  })

  /**
   * Register a mock route by file
   * @param app
   * @param file
   */
  function registerRoute(app: Application, file: string) {
    consola.info(`Registering Mock Server: ${chalk.dim(file)}`)
    const mockMethods = jiti(file).default as MockMethod[]

    mockMethods.forEach((mockMethod) => {
      const { method, url, response, rawResponse } = mockMethod

      // unregister route
      app._router.stack = app._router.stack.filter((i: any) => {
        return !(i.route && i.route.path === url)
      })

      app[method || 'get'](url, (req, res) => {
        setTimeout(async () => {
          if (rawResponse) {
            res.json(
              await rawResponse(
                req,
                res,
              ),
            )
          }
          else {
            res.json(response)
          }
        }, mockMethod.timeout || 0)
      })
    })
  }

  function registerRoutes(app: Application) {
    if (options.debug) {
      consola.info(`Registering all routes in ${chalk.dim(options.mockDir)}`)
    }
    for (const file of files) {
      registerRoute(app, file)
    }
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

  registerRoutes(app)
  consola.success(`Mock Server Registered success!`)

  chokidar
    .watch(options.mockDir, {
      ignoreInitial: true,
    })
    .on('all', (event, path) => {
      if (event === 'change' || event === 'add') {
        try {
          // clear route in register
          registerRoute(app, path)
          consola.success(` Mock Server hot reload success! changed  ${chalk.dim(path)}`)
        }
        catch (error) {
          consola.error(error)
        }
      }
    })
}
