import type { Connect } from 'vite'
import type { NextHandleFunction } from 'connect'

const timestampRE = /\bt=\d{13}&?\b/
const trailingSeparatorRE = /[?&]$/

// TODO extract middleware for vite

function requestMiddleware() {
  // eslint-disable-next-line unused-imports/no-unused-vars, unicorn/consistent-function-scoping
  const middleware: NextHandleFunction = (req, res, next) => {}

  return middleware
}

export function createVitePlugin() {
  const serverPerf: {
    middleware?: Record<string, { name: string, total: number, self: number }[]>
  } = {
    middleware: {},
  }

  // a hack for wrapping connect server stack
  // see https://github.com/senchalabs/connect/blob/0a71c6b139b4c0b7d34c0f3fca32490595ecfd60/index.js#L50-L55
  function setupMiddlewarePerf(middlewares: Connect.Server['stack']) {
    let firstMiddlewareIndex = -1
    middlewares.forEach((middleware, index) => {
      const { handle: originalHandle } = middleware
      if (typeof originalHandle !== 'function' || !originalHandle.name)
        return middleware

      middleware.handle = (...middlewareArgs: any[]) => {
        let req: any
        if (middlewareArgs.length === 4)
          [, req] = middlewareArgs
        else
          [req] = middlewareArgs

        const start = Date.now()
        const url = req.url?.replace(timestampRE, '').replace(trailingSeparatorRE, '')
        serverPerf.middleware![url] ??= []

        if (firstMiddlewareIndex < 0)
          firstMiddlewareIndex = index

        // clear middleware timing
        if (index === firstMiddlewareIndex)
          serverPerf.middleware![url] = []

        // @ts-expect-error handle needs 3 or 4 arguments
        const result = originalHandle(...middlewareArgs)

        Promise.resolve(result).then(() => {
          const total = Date.now() - start
          const metrics = serverPerf.middleware![url]

          // middleware selfTime = totalTime - next.totalTime
          serverPerf.middleware![url].push({
            self: metrics.length ? Math.max(total - metrics[metrics.length - 1].total, 0) : total,
            total,
            name: originalHandle.name,
          })
        })

        return result
      }

      Object.defineProperty(middleware.handle, 'name', {
        value: originalHandle.name,
        configurable: true,
        enumerable: true,
      })

      return middleware
    })
  }

  return {
    serverPerf,
    setupMiddlewarePerf,

    requestMiddleware,
  }
}
