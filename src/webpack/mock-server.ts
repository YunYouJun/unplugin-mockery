import { resolve } from 'node:path'
import type Server from 'webpack-dev-server'
import bodyParser from 'body-parser'

import chokidar from 'chokidar'

import consola from 'consola'
import colors from 'picocolors'

import type { Application } from 'express'
import { MockeryDB } from '../mockery/db'
import type { MockeryRequest, Options } from '../types'
import { getMockApiFiles, jiti } from '../core/utils'

import { isMockery } from '../mockery/utils'

import { MockeryServer } from '../mockery'

export async function mockServer(devServer: Server, options: Options) {
  const mockeryServer = new MockeryServer(options)
  // do not async to avoid register api failed
  mockeryServer.init()

  const files = getMockApiFiles(options.mockDir)
  /**
   * Register a mock route by file
   * @param app
   */
  function registerRoute(app: Application, mockery: MockeryRequest) {
    const { method = 'get', url, response, rawResponse, results = {} } = mockery

    // not a mockery
    if (!isMockery(mockery)) {
      return
    }

    // unregister route
    app._router.stack = app._router.stack.filter((i: any) => {
      return !(i.route && i.route.path === url)
    })

    if (response || rawResponse) {
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
          else if (response) {
            res.json(response)
          }
        }, mockery.timeout || 0)
      })
    }
    else if (Object.keys(results).length > 0) {
      app[method || 'get'](url, (req, res) => {
        const curKeyInScene = mockeryServer.sceneData[mockery.url]
        const resultKey = curKeyInScene || (Object.keys(results)[0])
        const response = results[resultKey] || {}

        setTimeout(() => {
          res.json(response)
        }, mockery.timeout || 0)
      })
    }
  }

  async function registerRoutes(app: Application) {
    if (options.debug) {
      consola.info(`${colors.dim('Registering all routes in')} 📂 ${colors.cyan(options.mockDir)}`)
    }
    consola.debug('files', files)
    for (const file of files) {
      // clear route in register
      const mockeryRequest = jiti(file).default as MockeryRequest || {}
      consola.debug(`  Registering Mock Server: ${colors.dim(file)}`)

      registerRoute(app, mockeryRequest)
      MockeryDB.updateSceneSchema(mockeryRequest)
    }
  }

  const app = devServer.app
  if (!app) {
    throw new Error('No app found')
  }

  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  )

  registerRoutes(app)
  mockeryServer.writeSceneSchema()

  chokidar
    .watch('**/*.{ts,json}', {
      cwd: options.mockDir,
      ignoreInitial: true,
    })
    .on('all', async (event, path) => {
      if (event === 'change' || event === 'add') {
        try {
          if (path.endsWith('.ts')) {
            const filePath = resolve(options.mockDir, path)

            // clear route in register
            const mockeryRequest = jiti(filePath).default as MockeryRequest || {}
            consola.debug(`  Registering Mock Server: ${colors.dim(filePath)}`)
            MockeryDB.updateSceneSchema(mockeryRequest)
            registerRoute(app, mockeryRequest)
            consola.success(`${colors.magenta('Mock Server hot reload success!')} changed: ${colors.dim(filePath)}`)
            MockeryDB.saveSceneSchema()
          }
          else if (path.endsWith('.scene.json')) {
            await MockeryDB.updateConfigSchema()
          }
        }
        catch (error) {
          consola.error(error)
        }
      }
    })
}
