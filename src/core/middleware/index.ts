/**
 * middleware for vite & webpack
 */

import type { NextHandleFunction } from 'connect'

import type { MockeryContext } from '../../mockery'
import { colors } from 'consola/utils'
import { parseJson } from './utils'

/**
 * for vite & webpack
 *
 * custom middleware
 * not same with express middleware app
 */
export function getRequestMiddleware(ctx: MockeryContext) {
  const middleware: NextHandleFunction = async (req, res, next) => {
    if (!req.url)
      return next()

    const url = new URL(req.url || '', `http://${req.headers.host}`)

    const isGet = req.method
      ? req.method.toUpperCase() === 'GET'
      : true

    // msw/node fetch
    const request = new Request(url.toString(), {
      method: req.method,
      headers: req.headers as any,
      body: isGet ? undefined : JSON.stringify(await parseJson(req)),
    })
    // timeout had executed in msw
    const mockRes = await ctx.getResponse(request)
    if (mockRes) {
      try {
        const headers = new Headers({
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain; charset=utf-8',
        })
        mockRes.headers.forEach((value, key) => {
          headers.set(key, value)
        })
        res.setHeaders(headers)
        res.statusCode = mockRes?.status || 200
        res.statusMessage = mockRes?.statusText || 'OK'

        if (mockRes.headers.get('Content-Type')?.includes('application/json')) {
          const data = await mockRes?.json()
          res.end(JSON.stringify(data || {}))
        }
        else {
          const data = await mockRes?.text()
          res.end(data)
        }
      }
      catch (e) {
        console.error('🤡', colors.red('[error]'), `${colors.blue(req.url)}:`, colors.red((e as Error)?.message))
        res.end()
      }
      return
    }
    next()
  }
  return middleware
}
