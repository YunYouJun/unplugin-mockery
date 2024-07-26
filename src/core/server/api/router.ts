import { Router } from 'express'
import fs from 'fs-extra'

// @ts-expect-error launch-editor is not typed
import launch from 'launch-editor'

import { getMockFiles, jiti } from '../../utils'
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
  res.json(scene)
})

router.use('/toggle-scene', async (req, _res) => {
  await toggleMockScene(req.query as {
    filePath: string
    sceneName: string
    url: string
  })
})

router.use('/mock-list', (req, res) => {
  const files = getMockFiles(globalState.userOptions?.mockDir || defaultOptions.mockDir)

  const list = files.map(file => ({
    path: file,
    methods: jiti(file).default,
  }))

  res.json({
    list,
  })
})

router.use('/', (req, res) => {
  res.json({
    message: 'Hello Mockery API',
  })
})
