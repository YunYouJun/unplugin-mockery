import { Router } from 'express'
import { getActiveScene, toggleMockScene } from '../mockery/server/api/utils'

export const router = Router()

router.use('/active-scene', async (req, res) => {
  const scene = await getActiveScene(req.query as {
    filePath: string
    url: string
  })
  res.json({
    scene,
  })
})

router.use('/toggle-scene', async (req, res) => {
  const code = await toggleMockScene(req.query as {
    filePath: string
    sceneName: string
    url: string
  })
  res.send(code || '')
})
