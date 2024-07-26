// server for mock client
import express from 'express'
import serveStatic from 'serve-static'

import { registerClientAPI } from './api'

export function createMockClientServer(options: {
  staticRoot?: string
}) {
  const app = express()

  registerClientAPI(app)

  if (options.staticRoot)
    app.use(serveStatic(options.staticRoot))

  return app
}
