import { resolve } from 'node:path'
import bodyParser from 'body-parser'
import chokidar from 'chokidar'

import consola from 'consola'

import colors from 'picocolors'
import type Server from 'webpack-dev-server'

import { getMockApiFiles } from '../../core/utils'
import { MockeryDB, registerRoute, registerRoutes, resolveMockeryRequest } from '../../mockery'
import type { Options } from '../../types'

/**
 * adapt webpack-dev-server app
 * @param devServer
 * @param options
 */
export function mockServer(devServer: Server, options: Options) {
  const files = getMockApiFiles({
    mockDir: options.mockDir,
  })
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

  registerRoutes(app, files)

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
            const mockeryRequest = await resolveMockeryRequest(filePath)
            registerRoute(app, mockeryRequest)
            consola.success(`${colors.magenta('Mock Server hot reload success!')} changed: ${colors.dim(filePath)}`)
            MockeryDB.updateSceneSchema(mockeryRequest)
            await MockeryDB.saveSceneSchema()
          }
          else if (path.endsWith('.scene.json')) {
            await MockeryDB.update()
            MockeryDB.readScene()
            // reload all routes
            consola.info(`${colors.dim('Scene file changed, reloading all routes')}`)
            registerRoutes(app, files)
            await MockeryDB.updateConfigSchema()
          }
          else if (path.endsWith('config.json')) {
            await MockeryDB.update()
            MockeryDB.readScene()
            // reload all routes
            consola.info(`${colors.dim('Config file changed, reloading all routes')}`)
            registerRoutes(app, files)
          }
        }
        catch (error) {
          consola.error(error)
        }
      }
    })
}