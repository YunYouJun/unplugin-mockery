// server for mock client
import express from 'express'
import serveStatic from 'serve-static'

import { registerClientAPI } from '../../mockery/server/api'
import { appRouter } from './router'

import { createContext, trpcExpress } from './trpc'

export * from './class'
export * from './router'

export function createMockClientServer(options: {
  staticRoot?: string
}) {
  const app = express()
  if (options.staticRoot)
    app.use(serveStatic(options.staticRoot))

  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  )

  registerClientAPI(app)
  return app
}
