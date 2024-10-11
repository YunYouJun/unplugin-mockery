import { type Application, Router } from 'express'

const router = Router()

/**
 * Register the client API routes
 */
export function registerClientAPI(app: Application) {
  app.get('/hello', (req, res) => {
    res.json({ message: 'Hello World' })
  })

  app.use('/_mockery_api_', router)
}
