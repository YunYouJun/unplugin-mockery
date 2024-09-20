import type { NextHandleFunction } from 'connect'
import type { Connect, ResolvedConfig } from 'vite'
import type { MethodType, MockeryRequest, Options } from '../../types'
import { parse } from 'node:querystring'
import { URL } from 'node:url'
import consola from 'consola'
import { match } from 'path-to-regexp'
import colors from 'picocolors'
import { MockeryDB } from '../../mockery/db'
import { getCurResponse, MOCKERY_NAMESPACE, printRequestLog, resolveMockeryRequest } from '../../mockery/utils'

import { createWatcher } from '../../mockery/utils/watch'
import { getMockApiFiles, isFunction, sleep } from '../utils'
import { parseJson } from './utils'

const timestampRE = /\bt=\d{13}&?\b/
const trailingSeparatorRE = /[?&]$/

// TODO extract middleware for vite

// eslint-disable-next-line import/no-mutable-exports
export let mockData: MockeryRequest[] = []

async function getMockConfig(options: Options, _config: ResolvedConfig) {
  let ret: MockeryRequest[] = []

  const mockFiles = getMockApiFiles({
    mockDir: options.mockDir,
  })

  try {
    ret = []
    const resolveMockeryPromiseList = []

    for (let index = 0; index < mockFiles.length; index++) {
      const mockFile = mockFiles[index]
      resolveMockeryPromiseList.push(resolveMockeryRequest(mockFile))
      consola.debug(`${MOCKERY_NAMESPACE} load ${mockFile}`)
    }

    const loadAllResult = await Promise.all(resolveMockeryPromiseList)
    for (const resultModule of loadAllResult) {
      const mod = resultModule
      ret = [...ret, mod]
    }
  }
  catch (error: any) {
    consola.error(`mock reload error`, error)
    ret = []
  }
  return ret
}

/**
 * mock server for vite
 * @param options
 * @param config
 */
export async function createMockServer(options: Options, config: ResolvedConfig) {
  mockData = await getMockConfig(options, config)
  createWatch(options, config)
}

/**
 * ref https://github.com/vbenjs/vite-plugin-mock
 */
export async function requestMiddleware(_options: Options) {
  const middleware: NextHandleFunction = async (req, res, next) => {
    if (!req.url)
      return next()

    const url = new URL(req.url || '', `http://${req.headers.host}`)
    let query = parse(url.search.slice(1))

    const reqUrl = url.pathname

    const matchRequest = mockData.find((item) => {
      if (!reqUrl || !item || !item.url) {
        return false
      }
      if (item.method && item.method.toUpperCase() !== req.method) {
        return false
      }
      return match(item.url)(reqUrl)
    })

    if (matchRequest) {
      const isGet = req.method && req.method.toUpperCase() === 'GET'
      const { response, rawResponse, timeout, statusCode, url, results = {} } = matchRequest

      if (timeout) {
        await sleep(timeout)
      }

      // parse query for get request
      const urlMatch = match(url, { decode: decodeURIComponent })
      if (reqUrl) {
        if ((isGet && JSON.stringify(query) === '{}') || !isGet) {
          const params = (urlMatch(reqUrl) as any).params
          if (JSON.stringify(params) !== '{}') {
            query = (urlMatch(reqUrl) as any).params || {}
          }
        }
      }

      if (isFunction(rawResponse)) {
        await rawResponse(req as any, res as any)
      }
      else {
        const body = await parseJson(req)
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')

        res.statusCode = statusCode || 200

        let mockResponse = response
        if (response) {
          mockResponse = isFunction(response)
            ? response({
              url: req.url as any,
              body,
              query,
              headers: req.headers,
            } as any)
            : response
        }
        else if (Object.keys(results).length > 0) {
          mockResponse = getCurResponse(matchRequest)
        }
        res.end(JSON.stringify(mockResponse || {}))
      }

      printRequestLog({
        method: req.method as MethodType || 'get',
        url: req.url,
      })
      return
    }
    next()
  }
  return middleware
}

/**
 * create watch mock
 */
export function createWatch(options: Options, config: ResolvedConfig) {
  const watcher = createWatcher({
    mockDir: options.mockDir,
    onTSFileChange: async () => {
      consola.info(`${colors.cyan('[MOCKERY]')} File changed, reloading all routes`)
      mockData = await getMockConfig(options, config)
    },
    onSceneFileChange: async (path) => {
      await MockeryDB.update()
      // *.scene.json
      const sceneName = path.replace(/\.scene\.json$/, '')
      MockeryDB.readScene(sceneName)
      consola.info(`${colors.cyan('[MOCKERY]')} scene.json changed, reloading all routes`)
      mockData = await getMockConfig(options, config)
      await MockeryDB.updateConfigSchema()
    },
    onConfigFileChange: async () => {
      await MockeryDB.update()
      MockeryDB.readScene()
      consola.info(`${colors.cyan('[MOCKERY]')} config.json changed, reloading all routes`)
      mockData = await getMockConfig(options, config)
    },
  })
  return watcher
}

export function createVitePlugin() {
  const serverPerf: {
    middleware?: Record<string, { name: string, total: number, self: number }[]>
  } = {
    middleware: {},
  }

  // a hack for wrapping connect server stack
  // see https://github.com/senchalabs/connect/blob/0a71c6b139b4c0b7d34c0f3fca32490595ecfd60/index.js#L50-L55
  function setupMiddlewarePerf(middlewares: Connect.Server['stack']) {
    let firstMiddlewareIndex = -1
    middlewares.forEach((middleware, index) => {
      const { handle: originalHandle } = middleware
      if (typeof originalHandle !== 'function' || !originalHandle.name)
        return middleware

      middleware.handle = (...middlewareArgs: any[]) => {
        let req: any
        if (middlewareArgs.length === 4)
          [, req] = middlewareArgs
        else
          [req] = middlewareArgs

        const start = Date.now()
        const url = req.url?.replace(timestampRE, '').replace(trailingSeparatorRE, '')
        serverPerf.middleware![url] ??= []

        if (firstMiddlewareIndex < 0)
          firstMiddlewareIndex = index

        // clear middleware timing
        if (index === firstMiddlewareIndex)
          serverPerf.middleware![url] = []

        // @ts-expect-error handle needs 3 or 4 arguments
        const result = originalHandle(...middlewareArgs)

        Promise.resolve(result).then(() => {
          const total = Date.now() - start
          const metrics = serverPerf.middleware![url]

          // middleware selfTime = totalTime - next.totalTime
          serverPerf.middleware![url].push({
            self: metrics.length ? Math.max(total - metrics[metrics.length - 1].total, 0) : total,
            total,
            name: originalHandle.name,
          })
        })

        return result
      }

      Object.defineProperty(middleware.handle, 'name', {
        value: originalHandle.name,
        configurable: true,
        enumerable: true,
      })

      return middleware
    })
  }

  return {
    serverPerf,
    setupMiddlewarePerf,

    requestMiddleware,
  }
}
