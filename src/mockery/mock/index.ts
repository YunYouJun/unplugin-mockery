import type { Application } from 'express'
import type { MockeryRequest } from '../../types'
import consola from 'consola'
import colors from 'picocolors'
import { sleep } from '../../core/utils'
import { MockeryDB } from '../db'
import { getCurResponse, isMockery, resolveMockeryRequest } from '../utils'

/**
 * Register a mock route by file
 * @param app
 */
export function registerRoute(app: Application, mockery: MockeryRequest) {
  // not a mockery
  if (!isMockery(mockery)) {
    return
  }

  const { method = 'all', url, response, rawResponse, results = {} } = mockery

  // unregister route
  app._router.stack = app._router.stack.filter((i: any) => {
    return !(i.route && i.route.path === url)
  })

  if (response) {
    app[method](url, async (req, res) => {
      await sleep(mockery.timeout || 0)
      // set status code
      if (mockery.statusCode) {
        res.statusCode = mockery.statusCode
      }
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
    })
  }
  else if (rawResponse) {
    if (typeof rawResponse !== 'function') {
      throw new TypeError('rawResponse must be a function')
    }
    app[method](url, async (req, res) => {
      await sleep(mockery.timeout || 0)
      await rawResponse?.(
        req,
        res,
      )
    })
  }
  else if (Object.keys(results).length > 0) {
    const response = getCurResponse(mockery)
    app[method](url, async (req, res) => {
      await sleep(mockery.timeout || 0)
      res.json(response)
    })
  }
}

/**
 * register all routes in the mockery directory by files
 */
export async function registerRoutes(app: Application, files: string[]) {
  consola.info(`${colors.dim('Registering all routes') + colors.cyan(`(${files.length})`)} 📂 ${colors.cyan(MockeryDB.options.mockDir)}`)
  consola.debug('files', files)
  for (const file of files) {
    // clear route in register
    const mockeryRequest = await resolveMockeryRequest(file)
    registerRoute(app, mockeryRequest)
    MockeryDB.updateSceneSchema(mockeryRequest)
  }
}
