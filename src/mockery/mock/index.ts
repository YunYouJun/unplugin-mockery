import type { Application } from 'express'
import { isMockery } from '../utils'
import type { MockeryRequest } from '../../types'
import { MockeryDB } from '../db'

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

  if (response || rawResponse) {
    app[method || 'get'](url, (req, res) => {
      setTimeout(async () => {
        if (rawResponse) {
          await rawResponse(
            req,
            res,
          )
        }

        const resData = typeof response === 'function' ? await response(req) : response
        res.json(resData)
      }, mockery.timeout || 0)
    })
  }
  else if (Object.keys(results).length > 0) {
    app[method || 'get'](url, (req, res) => {
      const curKeyInScene = MockeryDB.sceneData[mockery.url]
      const resultKey = curKeyInScene || (Object.keys(results)[0])
      const response = results[resultKey] || {}

      setTimeout(() => {
        res.json(response)
      }, mockery.timeout || 0)
    })
  }
}
