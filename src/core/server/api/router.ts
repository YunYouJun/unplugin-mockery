import { Router } from 'express'

export const router = Router()

router.use('/ping', (req, res) => {
  res.send('pong')
})
