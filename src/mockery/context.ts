import type { HttpHandler } from 'msw'
import type { SetupServerApi } from 'msw/node'
import type { ViteDevServer } from 'vite'
import type { defineMockerySetup } from '../core/define'
import type { ResolvedOptions } from '../core/options'
import type { Mockery, MockeryOptions } from '../types'
import type { MockeryMapType } from './typed-map'
import { resolve } from 'node:path'
import process from 'node:process'
import { consola, LogLevels } from 'consola'
import { colors } from 'consola/utils'
import { getResponse, http, HttpResponse, passthrough, RequestHandler } from 'msw'
import { setupServer } from 'msw/node'
import { createServer } from 'vite'
import { ViteNodeRunner } from 'vite-node/client'
import { ViteNodeServer } from 'vite-node/server'
import { GLOBAL_STATE, MOCKERY_NAMESPACE } from '..'
import { getMockeryKey } from '../../packages/shared'
import { MockeryWatcher } from '../core/node/watcher'
import { defaultOptions, resolveOptions } from '../core/options'
import { getMockApiFiles } from '../core/utils'
import { MockeryDB } from './db'
import { StateManager } from './state'
import { TypedMockeryMap } from './typed-map'
import { getRequestUrl, isMockery } from './utils'
import { createMockeryRequest } from './utils/factory'

export class MockeryContext<T extends Record<string, any> = MockeryMapType> {
  root = process.cwd()
  options: ResolvedOptions

  db: MockeryDB<T>

  /**
   * msw server
   * @see https://mswjs.io/docs/api/setup-server
   */
  server: SetupServerApi

  mockeryMap = new TypedMockeryMap<T>()

  private readonly watcher: MockeryWatcher
  viteServer?: ViteDevServer
  viteNodeServer?: ViteNodeServer
  viteNodeRunner?: ViteNodeRunner

  private _state: StateManager = new StateManager()

  constructor(rawOptions: MockeryOptions) {
    this.options = resolveOptions(rawOptions, this.root)
    this.db = new MockeryDB<T>(this)
    this.server = setupServer()

    // set consola level
    if (typeof this.options.logLevel !== 'undefined') {
      consola.level = this.options.logLevel
    }

    this.watcher = new MockeryWatcher(this as MockeryContext)
  }

  /**
   * global state manager
   * @experimental The State API is experimental and not subject to semver.
   */
  get state(): StateManager {
    return this._state
  }

  async _setServer(server?: ViteDevServer) {
    const start = Date.now()
    this.watcher.unregisterWatcher()

    // create vite server
    if (!server) {
      server = await createServer({
        root: this.root,
        configFile: false,
        optimizeDeps: {
          noDiscovery: true,
        },
        server: {
          cors: true,
        },
        ...this.options.vite,
      })
      this.viteServer = server
    }

    if (this.options.watch) {
      this.watcher.registerWatcher()
    }

    this.viteNodeServer = new ViteNodeServer(server)
    const node = this.viteNodeServer
    this.viteNodeRunner = new ViteNodeRunner({
      debug: this.options.debug,
      root: server.config.root,
      base: server.config.base,
      fetchModule(id: string) {
        return node.fetchModule(id)
      },
      resolveId(id: string, importer?: string) {
        return node.resolveId(id, importer)
      },
    })

    if (consola.level >= LogLevels.debug) {
      const consumedTime = Date.now() - start
      consola.log('')
      consola.success(`Start ${colors.green('Vite Node Server')} in ${colors.green(`${consumedTime}ms`)}`)
    }
  }

  /**
   * - init db
   * - load handlers
   * - msw server listen
   * - create watcher
   */
  async init() {
    await this._setServer()
    const { options, server } = this

    // init db to read resolver key
    await this.db.init()
    // resolve handlers from folder
    if (options.resolvedDirs) {
      await this.useMockeryDirs(options.resolvedDirs)
    }

    await this.setup()
    server.listen(options.msw?.listenOptions)

    if (options.dts) {
      await this.db.initTypes()
    }
  }

  /**
   * use handler from mockery dir
   *
   * 从指定目录加载所有的 mockery 文件
   *
   * @example
   * ```ts
   * await ctx.useMockeryDirs([
   *   'mocks/api',
   * ])
   * ```
   */
  async useMockeryDirs(dirs: string[]) {
    const files = await getMockApiFiles({
      dirs,
      include: this.options.include,
      exclude: this.options.exclude,
    })
    consola.debug('Use Mockery Files:', files)

    // const spinner = ora('Loading Mockery Files')
    // if (consola.level >= LogLevels.log) {
    //   spinner.start()
    // }

    const useResults: NonNullable<Awaited<ReturnType<typeof this.useMockeryFile>>>[] = []
    for (const file of files) {
      const use = await this.useMockeryFile(file)
      if (use) {
        useResults.push(use)
        await this.db.updateSceneSchema(use.mockery)
      }
    }
    const handlers = useResults.map(res => res.handler)
    if (consola.level >= LogLevels.log) {
      // spinner.succeed(`Use ${colors.cyan(handlers.length)} handlers in 📂 ${colors.cyan(dirs.join(','))}`)
      consola.log('')
      consola.success(` ${MOCKERY_NAMESPACE}  Use ${colors.cyan(handlers.length)} handlers in 📂 ${colors.cyan(dirs.join(','))}`)
    }

    return {
      unUse: () => {
        useResults.forEach((res) => {
          res.unUse?.()
        })
      },
      handlers,
    }
  }

  /**
   * resolve mockery request from file
   *
   * 从文件中解析 Mockery 请求
   */
  async resolveMockeryRequest(filePath: string): Promise<Mockery | void> {
    consola.debug(`  Registering Mock Server: ${colors.dim(filePath)}`)
    let mockeryRequest: Mockery | ((options: ResolvedOptions) => Mockery | Promise<Mockery>)
    try {
      mockeryRequest = await (await this.viteNodeImport<{
        default: Mockery | ((options: ResolvedOptions) => Mockery | Promise<Mockery>) | Promise<Mockery>
      }>(filePath)).default;

      // for internal hmr, remove query
      (mockeryRequest as any)._filepath = filePath.replace(/\?.*$/, '')
    }
    catch (error) {
      consola.error(`Failed to load Mockery file: ${filePath}`)
      consola.error(error)
      return
    }

    if (!mockeryRequest) {
      return
    }

    if (typeof mockeryRequest === 'function') {
      mockeryRequest = await mockeryRequest(this.options)
    }

    if (typeof mockeryRequest === 'object') {
      return mockeryRequest
    }
    else {
      throw new TypeError('mockery must be a function or object')
    }
  }

  /**
   * use handler from file
   * mockery file path -> msw handler
   *
   * 从指定文件加载 mockery
   *
   * @example
   * ```ts
   * const { mockery, handler } = await ctx.useMockeryFile('mock/api/xxx.ts')
   * ```
   */
  async useMockeryFile(filePath: string) {
    const mockery = await this.resolveMockeryRequest(filePath)
    if (mockery && isMockery(mockery)) {
      if (mockery._filepath) {
        this.state.filesMap.set(mockery._filepath, {
          mockery,
        })
      }

      const useCtx = await this.useMockery(mockery)
      return {
        mockery,
        ...useCtx,
        unUse: () => {
          if (mockery._filepath)
            this.state.filesMap.delete(mockery._filepath)
          this.unUseMockery(mockery)
        },
      }
    }
  }

  /**
   * add a new mockery
   * @example
   * ```ts
   * ctx.useMockery({
   *   type: 'jsapi',
   *   methodName: 'TEST_METHOD',
   *   response: {
   *     ok: true,
   *   }
   * })
   * ```
   */
  async useMockery(mockery: Mockery | (() => Promise<Mockery> | Mockery)) {
    if (typeof mockery === 'function') {
      mockery = await mockery()
    }
    mockery.type = mockery.type || 'http'

    if (!isMockery(mockery)) {
      consola.error('Invalid Mockery:', mockery)
      return
    }

    // set in map
    const key = getMockeryKey(mockery)
    if (!key) {
      throw new Error('Mockery Key is required, please set `path` or `methodName`')
    }
    mockery = createMockeryRequest({
      mockery,
      mockeryContext: this as MockeryContext,
    })

    const handler = this.getHandlerFromMockery(mockery)
    if (handler) {
      this.server.use(handler)
      this.mockeryMap.set(key, mockery)
    }

    mockery.handler = handler

    return {
      unUse: () => this.unUseMockery(mockery),
      handler,
    }
  }

  /**
   * get cur key in scene
   *
   * 获取当前 Mockery 的结果状态
   */
  getMockeryStatus(mockery: Mockery): string {
    const statusMap = mockery.statusMap || {}
    const mockeryKey = getMockeryKey(mockery)
    const curStatusInScene = mockery._curStatus || this.db?.curSceneDB?.data[mockeryKey]
    const status = curStatusInScene || mockery.defaultStatus || (Object.keys(statusMap)[0])
    return status
  }

  /**
   * get msw handler from mockery
   * @param mockery ge
   */
  getHandlerFromMockery(mockery: Mockery) {
    let handler: HttpHandler
    let resolver = mockery.resolver || (() => HttpResponse.json(mockery.response || {}))

    if (mockery.statusMap && Object.keys(mockery.statusMap).length > 0) {
      const status = this.getMockeryStatus(mockery)
      resolver = mockery.statusMap[status]?.resolver || resolver
    }

    switch (mockery.type) {
      case 'http':
      default:{
        const path = mockery.path
          ? mockery.path
          : mockery.url
            ? mockery.url.toString().startsWith('*')
              ? mockery.url.toString()
              : `*${mockery.url.toString()}`
            : '*'
        handler = http[mockery.method || 'all'](path, resolver, mockery.options)
        break
      }
    }
    return handler
  }

  /**
   * do not mock this mockery
   */
  unUseMockery(mockery: Mockery) {
    if (!isMockery(mockery)) {
      consola.error('UnUse Invalid Mockery:', mockery)
      return false
    }

    const url = getRequestUrl(mockery)

    // const key = getMockeryKey(mockery)
    // this.mockeryMap.delete(key)

    this.server.use(
      http.all(url, () => {
        return passthrough()
      }),
    )
    return true
  }

  /**
   * wrap msw getResponse
   *
   * 根据传入的 Mockery/Request 获取对应的 Response
   *
   * @example
   * ```ts
   * const response = await ctx.getResponse(new Request('http://localhost/api/xxx'))
   * ```
   */
  async getResponse(request: Request | Mockery) {
    if (isMockery(request)) {
      const mockery = request as Mockery
      const url = new URL(getRequestUrl(mockery), `http://localhost`)

      const isGet = 'method' in mockery
        ? mockery.method?.toUpperCase() === 'GET'
        : true

      request = new Request(url.toString(), {
        method: 'method' in mockery ? mockery.method : 'post',
        body: isGet ? undefined : JSON.stringify({}),
      })
    }
    const handlers = this.server.listHandlers().filter((handler) => {
      return handler instanceof RequestHandler
    })
    const response = await getResponse(handlers, request)
    return response
  }

  /**
   * Import a file using Vite module runner. The file will be transformed by Vite and executed in a separate context.
   */
  public viteNodeImport<T>(filepath: string): Promise<T> {
    return this.viteNodeRunner!.executeFile(filepath)
  }

  /**
   * load setup file
   */
  async setup() {
    const filePath = this.options.globalSetup ? resolve(this.root, this.options.globalSetup) : ''
    if (!filePath)
      return

    try {
      const setupFunc = await (await this.viteNodeImport<{
        default: Parameters<typeof defineMockerySetup>[0] | Promise<Parameters<typeof defineMockerySetup>[0]>
      }>(filePath)).default
      await setupFunc(this as MockeryContext)
      consola.info(` ${MOCKERY_NAMESPACE}  globalSetup:`, colors.dim(filePath))
    }
    catch (e) {
      consola.debug(` ${MOCKERY_NAMESPACE}  Not use globalSetup`)
      consola.debug(e)
    }
  }

  async destroy() {
    this.server.close()
    await this.viteServer?.close()
  }
}

/**
 * 创建 Mockery 上下文
 *
 * @example
 * ```ts
 * const ctx = createMockeryContext({
 *   dirs: ['mocks'],
 *   // watch: true,
 *   // 设置 mode: 'test' 等价于设置 `watch: false`和 `dotFiles: false`
 *   mode: 'test',
 * })
 * await ctx.init()
 * ```
 */
export function createMockeryContext(options: MockeryOptions = defaultOptions): MockeryContext {
  const ctx = new MockeryContext(options)
  // for unplugin client
  GLOBAL_STATE.mockeryCtx = ctx
  return ctx
}
