import { Router } from 'express'
import fs from 'fs-extra'

// @ts-expect-error launch-editor is not typed
import launch from 'launch-editor'

import { getMockApiFiles, jiti } from '../../utils'
import { globalState } from '../../env'
import { defaultOptions } from '../../options'

import { getActiveScene, toggleMockScene } from './utils'

export const router = Router()

router.use('/ping', (req, res) => {
  res.send('pong')
})

router.use('/open-file', (req, res) => {
  const path = req.query.path as string
  if (!path) {
    res.status(400).send('Path is required')
    return
  }
  try {
    launch(path, 'code')
    res.send('ok')
  }
  catch (e) {
    console.error(e)
    res.status(500).send('Failed to open file')
  }
})

router.use('/raw-file', async (req, res) => {
  const path = req.query.path as string
  const content = await fs.readFile(path, 'utf-8')
  res.send(content)
})

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

router.use('/mock-list', (req, res) => {
  const files = getMockApiFiles(globalState.userOptions?.mockDir || defaultOptions.mockDir)
  const list = files.map((file) => {
    const mockery = jiti(file).default || {}
    if (mockery.results) {
      // parse function
      Object.keys(mockery.results).forEach((sceneId) => {
        const scene = mockery.results[sceneId]
        if (typeof scene === 'function') {
          mockery.results[sceneId] = scene()
        }
      })
    }

    return {
      path: file,
      mockery,
    }
  })

  res.json({
    list,
  })
})

router.use('/', (req, res) => {
  res.json({
    message: 'Hello Mockery API',
  })
})
