import path from 'node:path'
import { Router } from 'express'
import fs from 'fs-extra'

// @ts-expect-error launch-editor is not typed
import launch from 'launch-editor'

import { MockeryDB } from '../mockery/db'
import { getMockApiFiles, jiti } from './utils'
import { globalState } from './env'
import { defaultOptions } from './options'

import { getActiveScene, toggleMockScene } from './server/api/utils'

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

router.use('/toggle-result', async (req, res) => {
  const { JSONFilePreset } = await import('lowdb/node')
  const { url, resultKey, curScene } = req.query as {
    curScene: string
    url: string
    resultKey: string
  }
  const userOptions = globalState.userOptions
  const sceneDataPath = path.resolve(userOptions?.mockDir || '', 'scenes', `${curScene}.scene.json`)
  const db = await JSONFilePreset<{
    [url: string]: string
  }>(sceneDataPath, {
    $schema: '../schemas/scene.schema.json',
  })
  db.data[url] = resultKey
  await db.write()
  // append \n
  await fs.appendFile(sceneDataPath, '\n')

  res.json({
    resultKey,
  })
})

/**
 * Get scene list
 */
router.use('/scene-list', async (req, res) => {
  const userOptions = globalState.userOptions
  const sceneDir = path.resolve(userOptions?.mockDir || '', 'scenes')
  const files = await fs.readdir(sceneDir)
  const list = files
    .filter(file => file.endsWith('.scene.json'))
    .map((file) => {
      return file.replace('.scene.json', '')
    })

  const curScene = MockeryDB.configDB.data.curScene
  const sceneDataPath = path.resolve(sceneDir, `${curScene}.scene.json`)
  const sceneData = await fs.readJSON(sceneDataPath)

  res.json({
    curScene,
    sceneData,
    list,
  })
})

/**
 * Set cur scene
 */
router.use('/set-scene', async (req, res) => {
  const sceneName = req.query.sceneName as string
  MockeryDB.configDB.data.curScene = sceneName
  await MockeryDB.save()

  const sceneData = await fs.readJSON(path.resolve(globalState.userOptions?.mockDir || '', 'scenes', `${sceneName}.scene.json`))
  res.json({
    sceneName,
    sceneData,
  })
})

router.use('/mock-list', (req, res) => {
  const files = getMockApiFiles(globalState.userOptions?.mockDir || defaultOptions.mockDir)
  const list = files.map((file) => {
    const mockery = jiti(file).default || {}
    if (mockery.results) {
      // parse function
      Object.keys(mockery.results).forEach((sceneId) => {
        const result = mockery.results[sceneId]
        if (typeof result === 'function') {
          mockery.results[sceneId] = result()
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
