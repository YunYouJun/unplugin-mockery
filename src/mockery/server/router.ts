import type { Mockery, MockeryItem } from '../../types'
import path from 'node:path'
import { TRPCError } from '@trpc/server'

import fs from 'fs-extra'

// @ts-expect-error launch-editor is not typed
import launch from 'launch-editor'
import { z } from 'zod'

import { getMockApiFiles, jiti } from '../../core/utils'
import { MockeryDB } from '../db'
import { resolveMockDir } from '../utils'
import { publicProcedure, router } from './trpc'

export const appRouter = router({
  ping: publicProcedure.query(() => ({
    message: 'pong',
  })),

  file: router({
    open: publicProcedure.input(z.string()).query(async ({ input }) => {
      const path = input
      if (!path) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Path is required',
        })
      }
      try {
        launch(path, 'code')
        return 'ok'
      }
      catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to open file',
        })
      }
    }),

    raw: publicProcedure.input(z.string()).query(async ({ input }) => {
      const path = input
      const content = await fs.readFile(path, 'utf-8')
      return content
    }),
  }),

  scene: router({
    /**
     * List all scenes
     */
    list: publicProcedure.query(async () => {
      const userOptions = MockeryDB.options
      const sceneDir = path.resolve(userOptions?.mockDir || '', 'scenes')
      const files = await fs.readdir(sceneDir)
      const list = files
        .filter(file => file.endsWith('.scene.json'))
        .map((file) => {
          return file.replace('.scene.json', '')
        })

      const curScene = MockeryDB.configDB.curScene
      const sceneDataPath = path.resolve(sceneDir, `${curScene}.scene.json`)
      const sceneData = await fs.readJSON(sceneDataPath)

      return {
        curScene,
        sceneData,
        list,
      }
    }),

    set: publicProcedure.input(z.string()).mutation(async ({ input }) => {
      const sceneName = input
      MockeryDB.configDB.curScene = sceneName
      const sceneDataPath = MockeryDB.getScenePath()
      const sceneData = await fs.readJSON(sceneDataPath)
      // trigger hot reload
      await MockeryDB.save()

      return {
        sceneName,
        sceneData,
      }
    }),
  }),

  mockery: router({
    list: publicProcedure.query(async () => {
      // resolve absolute path
      const mockDir = resolveMockDir()
      const files = getMockApiFiles({
        mockDir,
      })
      const list = files.map((file) => {
        const mockery = (jiti(file).default || {}) as Mockery
        if (mockery.results) {
          // parse function
          Object.keys(mockery.results).forEach((sceneId) => {
            const result = mockery.results?.[sceneId]
            if (result && typeof result === 'function') {
              mockery.results![sceneId] = (result as any)()
            }
          })
        }

        return {
          path: path.relative(mockDir, file),
          mockery,
        } as MockeryItem
      })

      return {
        list,
        mockDir,
      }
    }),
  }),

  result: router({
    toggle: publicProcedure.input(z.object({
      url: z.string(),
      resultKey: z.string(),
      curScene: z.string(),
    })).mutation(async ({ input }) => {
      const { url, resultKey, curScene } = input
      const userOptions = MockeryDB.options
      const sceneDataPath = path.resolve(userOptions?.mockDir || '', 'scenes', `${curScene}.scene.json`)

      let sceneData: Record<string, string> = {
        $schema: '../schemas/scene.schema.json',
      }
      if (await fs.exists(sceneDataPath)) {
        sceneData = await fs.readJSON(sceneDataPath)
      }
      else {
        await fs.writeJSON(sceneDataPath, sceneData, { spaces: 2 })
      }
      sceneData[url] = resultKey
      await fs.writeJSON(sceneDataPath, sceneData, { spaces: 2 })
      // append \n
      await fs.appendFile(sceneDataPath, '\n')

      return {
        resultKey,
        sceneData,
      }
    }),
  }),
})

// Export type router type signature, this is used by the client.
export type AppRouter = typeof appRouter
