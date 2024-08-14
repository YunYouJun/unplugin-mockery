import type { Application } from 'express'
import colors from 'picocolors'
import consola from 'consola'
import { isMockery } from '../utils'
import type { MockeryRequest } from '../../types'
import { MockeryDB } from '../db'

import { jiti } from '../../core/utils'

/**
 * Register a mock route by file
 * @param app
 */
export function registerRoute(app: Application, mockery: MockeryRequest) {
  // not a mockery
  if (!isMockery(mockery)) {
    return
  }

  const { method = 'get', url, response, rawResponse, results = {} } = mockery

  // unregister route
  app._router.stack = app._router.stack.filter((i: any) => {
    return !(i.route && i.route.path === url)
  })

  if (response) {
    app[method || 'get'](url, (req, res) => {
      setTimeout(async () => {
        if (typeof response === 'function') {
          const resData = await response(req)
          res.json(resData)
        }
        else if (typeof response === 'object') {
          res.json(response)
        }
        else {
          throw new TypeError('response must be a function or object')
        }
      }, mockery.timeout || 0)
    })
  }
  else if (rawResponse) {
    if (typeof rawResponse !== 'function') {
      throw new TypeError('rawResponse must be a function')
    }
    app[method || 'get'](url, (req, res) => {
      setTimeout(async () => {
        await rawResponse?.(
          req,
          res,
        )
      }, mockery.timeout || 0)
    })
  }
  else if (Object.keys(results).length > 0) {
    const curKeyInScene = MockeryDB.sceneData[mockery.url]
    const resultKey = curKeyInScene || (Object.keys(results)[0])
    const response = results[resultKey] || {}

    app[method || 'get'](url, (req, res) => {
      setTimeout(() => {
        res.json(response)
      }, mockery.timeout || 0)
    })
  }
}

export async function registerRoutes(app: Application, files: string[]) {
  consola.info(`${colors.dim('Registering all routes') + colors.cyan(`(${files.length})`)} 📂 ${colors.cyan(MockeryDB.options.mockDir)}`)
  consola.debug('files', files)
  for (const file of files) {
    // clear route in register
    const mockeryRequest = jiti(file).default as MockeryRequest || {}
    consola.debug(`  Registering Mock Server: ${colors.dim(file)}`)

    registerRoute(app, mockeryRequest)
    MockeryDB.updateSceneSchema(mockeryRequest)
  }
}
