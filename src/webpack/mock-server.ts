import type Server from 'webpack-dev-server'
import bodyParser from 'body-parser'

import chokidar from 'chokidar'

import consola from 'consola'
import colors from 'picocolors'

import type { Application } from 'express'
import type { MockMethod, Options } from '../types'
import { getMockFiles, jiti } from '../core/utils'

export function mockServer(devServer: Server, options: Options) {
  const files = getMockFiles(options.mockDir)
  /**
   * Register a mock route by file
   * @param app
   * @param file
   */
  function registerRoute(app: Application, file: string) {
    consola.debug(`  Registering Mock Server: ${colors.dim(file)}`)
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
      consola.info(`${colors.dim('Registering all routes in')} 📂 ${colors.cyan(options.mockDir)}`)
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

  chokidar
    .watch(options.mockDir, {
      ignoreInitial: true,
    })
    .on('all', (event, path) => {
      if (event === 'change' || event === 'add') {
        try {
          // clear route in register
          registerRoute(app, path)
          consola.success(`  Mock Server hot reload success! changed  ${colors.dim(path)}`)
        }
        catch (error) {
          consola.error(error)
        }
      }
    })
}
