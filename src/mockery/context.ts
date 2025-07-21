import type { SetupServerApi } from 'msw/node'
import type { ViteDevServer } from 'vite'
import type { defineMockerySetup } from '../core/define'
import type { ResolvedOptions } from '../core/options'
import type { MockeryOptions, MockeryRequest } from '../types'
import { resolve } from 'node:path'
import process from 'node:process'
import { consola, LogLevels } from 'consola'
import { colors } from 'consola/utils'
import { setupServer } from 'msw/node'
import { createServer } from 'vite'
import { ViteNodeRunner } from 'vite-node/client'
import { ViteNodeServer } from 'vite-node/server'
import { MockeryWatcher } from '../core/node/watcher'
import { resolveOptions } from '../core/options'
import { getMockApiFiles } from '../core/utils'
import { MockeryDB } from './db'
import { isMockery, MOCKERY_NAMESPACE } from './utils'

export class MockeryContext {
  root = process.cwd()
  options: ResolvedOptions

  db: MockeryDB

  /**
   * msw server
   * @see https://mswjs.io/docs/api/setup-server
   */
  server: SetupServerApi

  private readonly watcher: MockeryWatcher
  viteServer?: ViteDevServer
  viteNodeServer?: ViteNodeServer
  viteNodeRunner?: ViteNodeRunner

  constructor(private rawOptions: MockeryOptions) {
    this.options = resolveOptions(rawOptions)
    this.db = new MockeryDB(this)
    this.server = setupServer()

    // set consola level
    if (typeof this.options.logLevel !== 'undefined') {
      consola.level = this.options.logLevel
    }

    // TODO vite
    // this.watcher = new MockeryWatcher(this as MockeryContext)

    // set consola level
    if (typeof this.options.logLevel !== 'undefined') {
      consola.level = this.options.logLevel
    }

    this.watcher = new MockeryWatcher(this as MockeryContext)
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

    // resolve handlers from folder
    if (options.resolvedDirs) {
      await this.useMockeryDirs(options.resolvedDirs)
    }

    await this.setup()

    server.listen(options.msw?.listenOptions)

    // await this.db.init()
    // if (options.dts) {
    //   await this.db.initTypes()
    // }
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
        // await this.db.updateSceneSchema(use.mockery)
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
  async resolveMockeryRequest(filePath: string): Promise<MockeryRequest | void> {
    consola.debug(`  Registering Mock Server: ${colors.dim(filePath)}`)
    let mockeryRequest: MockeryRequest | ((options: ResolvedOptions) => MockeryRequest | Promise<MockeryRequest>)
    try {
      mockeryRequest = await (await this.viteNodeImport<{
        default: MockeryRequest | ((options: ResolvedOptions) => MockeryRequest | Promise<MockeryRequest>) | Promise<MockeryRequest>
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
  async useMockery(mockery: MockeryRequest | (() => Promise<MockeryRequest> | MockeryRequest)) {
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
      throw new Error('Mockery Key is required, please set `url` or `methodName`')
    }
    mockery = createMockeryRequest({
      mockery,
      mockeryContext: this as MockeryContext,
    })

    let handler

    if (handler)
      this.server.use(handler)

    mockery.handler = handler

    return {
      unUse: () => this.unUseMockery(mockery),
      handler,
    }
  }

  /**
   * do not mock this mockery
   */
  unUseMockery(mockery: MockeryRequest) {
    if (!isMockery(mockery)) {
      consola.error('UnUse Invalid Mockery:', mockery)
      return false
    }

    const url = getRequestUrl(mockery)

    const key = getMockeryKey(mockery)
    this.mockeryMap.delete(key)

    this.server.use(
      http.all(url, () => {
        return passthrough()
      }),
    )
    return true
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
