import type Server from 'webpack-dev-server'
import type { Options } from '../../types'
import path, { resolve } from 'node:path'

import bodyParser from 'body-parser'
import consola from 'consola'

import colors from 'picocolors'
import { getMockApiFiles } from '../../core/utils'
import { MockeryDB, registerRoute, registerRoutes, resolveMockeryRequest } from '../../mockery'
import { createWatcher } from '../../mockery/utils/watch'

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

  const mockDir = path.resolve(options.mockDir)
  createWatcher({
    mockDir,
    onTSFileChange: async (path) => {
      const filePath = resolve(options.mockDir, path)

      // clear route in register
      const mockeryRequest = await resolveMockeryRequest(filePath)
      registerRoute(app, mockeryRequest)
      consola.success(`${colors.magenta('Mock Server hot reload success!')} changed: ${colors.dim(filePath)}`)
      MockeryDB.updateSceneSchema(mockeryRequest)
      await MockeryDB.saveSceneSchema()
    },
    onSceneFileChange: async () => {
      await MockeryDB.update()
      MockeryDB.readScene()
      // reload all routes
      registerRoutes(app, files)
      await MockeryDB.updateConfigSchema()
    },
    onConfigFileChange: async () => {
      await MockeryDB.update()
      MockeryDB.readScene()
      // reload all routes
      registerRoutes(app, files)
    },
  })
}
