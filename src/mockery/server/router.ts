import type { Mockery, MockeryItem } from '../../types'
import process from 'node:process'

import { TRPCError } from '@trpc/server'

import fs from 'fs-extra'
import launch from 'launch-editor'

import { z } from 'zod'
import { getMockeryKey } from '../../../packages/shared'
import { GLOBAL_STATE } from '../../core'
import { publicProcedure, router } from './trpc'

function stringifyMockery(mockery: any): any {
  // with function toString
  return JSON.parse(
    JSON.stringify(mockery, (key, value) => {
      if (typeof value === 'function') {
        return value.toString()
      }
      return value
    }),
  )
}

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
      const DB = GLOBAL_STATE.mockeryCtx?.db
      if (!DB) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'MockeryDB not found',
        })
      }
      const sceneDir = DB.path.sceneDir
      if (!sceneDir) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Scene directory not found',
        })
      }
      const files = await fs.readdir(sceneDir)
      const list = files
        .filter(file => file.endsWith('.scene.json'))
        .map((file) => {
          return file.replace('.scene.json', '')
        })

      const curScene = DB.configDB?.data.curScene
      await DB.readScene(curScene)

      return {
        curScene,
        sceneData: DB.curSceneDB?.data,
        list,
      }
    }),

    set: publicProcedure.input(z.string()).mutation(async ({ input }) => {
      const DB = GLOBAL_STATE.mockeryCtx?.db
      if (!DB) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'MockeryDB not found',
        })
      }
      const sceneName = input
      await DB.configDB?.update(data => data.curScene = sceneName)
      const sceneDataPath = await DB.getScenePath()
      const sceneData = await fs.readJSON(sceneDataPath)
      return {
        sceneName,
        sceneData,
      }
    }),
  }),

  mockery: router({
    /**
     * get response from mockery context
     */
    request: publicProcedure.input(z.object({
      filePath: z.string(),
    })).query(async ({ input }) => {
      const { filePath } = input
      const mCtx = GLOBAL_STATE.mockeryCtx
      const { mockery } = mCtx?.state.filesMap.get(filePath) || {}
      if (!mockery) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Mockery not found',
        })
      }
      const response = await mCtx?.getResponse(mockery)
      const data = await response?.json()
      return data
    }),

    list: publicProcedure.input(z.object({
      type: z.string(),
    })).query(async ({ input }) => {
      const { type } = input

      const options = GLOBAL_STATE.mockeryCtx?.options
      const resolvedDirs = options?.resolvedDirs || []
      // resolve absolute path
      // const files = await getMockApiFiles({
      //   dirs: resolvedDirs,
      //   include: options?.include,
      //   exclude: options?.exclude,
      // })
      const mCtx = GLOBAL_STATE.mockeryCtx
      const filesMap = mCtx?.state.filesMap
      if (!filesMap) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'FilesMap not found',
        })
      }
      const list: MockeryItem[] = Array.from(filesMap, ([key, value]) => ({
        path: key,
        // stringify mockery function to show in client
        mockery: stringifyMockery(value.mockery || {}),
      }))
      const filteredList = list.filter(item => item.mockery && item.mockery.type === type)
      return {
        list: filteredList,
        dirs: resolvedDirs,
        root: options?.root || process.cwd(),
      }
    }),
  }),

  result: router({
    toggle: publicProcedure.input(
      z.object({
        path: z.string(),
        type: z.enum(['http']),
        resultKey: z.string(),
        curScene: z.string(),
        status: z.string(),
      }),
    ).mutation(async ({ input }) => {
      const { status, curScene } = input
      const DB = GLOBAL_STATE.mockeryCtx?.db
      if (!DB) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'MockeryDB not found',
        })
      }

      const key = getMockeryKey(input as Mockery) || ''
      if (!key) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'url or methodName is required',
        })
      }
      // console.log('key', key)
      await DB.readScene(curScene)
      await DB.curSceneDB?.update((data) => {
        data[key] = status
      })

      return {
        status,
        sceneData: DB.curSceneDB?.data,
      }
    }),
  }),
})

// Export type router type signature, this is used by the client.
export type AppRouter = typeof appRouter
