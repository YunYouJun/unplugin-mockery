import type { MockeryContext } from '../../mockery/context'
import { createFilter } from '@rollup/pluginutils'
import { colors } from 'consola/utils'
import mm from 'micromatch'
import { consola, getMockeryLogInfo, logger, noop, slash } from '../utils'

/**
 * @todo
 *
 * for module graph hmr
 */
export class MockeryWatcher {
  /**
   * Mock files that have changed and need to be rerun.
   */
  public readonly changedMocks: Set<string> = new Set()

  private readonly _onRerun: ((file: string) => void)[] = []

  filter: ReturnType<typeof createFilter>

  constructor(private mockeryContext: MockeryContext) {
    const options = this.mockeryContext.options
    this.filter = createFilter(
      options.include || [/\.mock\.ts$/, /\.mockery\.ts$/],
      options.exclude || [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
    )

    this.onWatcherRerun(async (file) => {
      try {
        if (file.endsWith('.ts')) {
          // vite has logger
          // logger.info(`${colors.bold(colors.blue('TS'))} file changed: ${colors.dim(file)}`)
          await this.onTSFileChange?.(file)
        }
        else if (file.endsWith('.scene.json')) {
          logger.info(`${colors.green('Scene')} file changed: ${colors.dim(file)}`)
          await this.onSceneFileChange?.(file)
        }
        else if (file.endsWith('config.json')) {
          logger.info(`${colors.cyan('Config')} file changed: ${colors.dim(file)}`)
          await this.onConfigFileChange?.(file)
        }
      }
      catch (e) {
        consola.error('Error in watch file:', colors.dim(file))
        console.error(e)
      }
    })
    this.onWatcherRerun(async (_file) => {
      for (const file of this.changedMocks) {
        await this.onMockeryFileChange?.(file)
      }

      this.changedMocks.clear()
    })
  }

  /**
   * Register a handler that will be called when test files need to be rerun.
   * The callback can receive several files in case the changed file is imported by several test files.
   * Several invocations of this method will add multiple handlers.
   * @internal
   */
  onWatcherRerun(cb: (file: string) => void): this {
    this._onRerun.push(cb)
    return this
  }

  public unregisterWatcher: () => void = noop
  public registerWatcher() {
    const watcher = this.mockeryContext.viteServer?.watcher

    if (!watcher)
      return this

    if (this.mockeryContext.options.forceRerunTriggers?.length) {
      watcher.add(this.mockeryContext.options.forceRerunTriggers)
    }

    watcher.add(this.mockeryContext.options.resolvedDirs)

    watcher.on('change', this.onChange)
    watcher.on('unlink', this.onUnlink)
    watcher.on('add', this.onAdd)

    this.unregisterWatcher = () => {
      watcher.off('change', this.onChange)
      watcher.off('unlink', this.onUnlink)
      watcher.off('add', this.onAdd)
      this.unregisterWatcher = noop
    }

    return this
  }

  private scheduleRerun(file: string): void {
    this._onRerun.forEach(fn => fn(file))
  }

  private onChange = async (id: string) => {
    id = slash(id)

    const needsRerun = this.handleFileChanged(id)
    if (needsRerun) {
      this.scheduleRerun(id)
    }
  }

  private onUnlink = (id: string): void => {
    id = slash(id)
    const moduleCache = this.mockeryContext.viteNodeRunner?.moduleCache
    moduleCache?.delete(id)

    if (this.mockeryContext.state.filesMap.has(id)) {
      // remove
      const mockeryFile = this.mockeryContext.state.filesMap.get(id)
      const mockery = mockeryFile?.mockery
      if (mockery) {
        this.mockeryContext.state.filesMap.delete(id)
        this.changedMocks.delete(id)

        this.mockeryContext.unUseMockery(mockery)
        setTimeout(() => {
          consola.success(`${colors.magenta('Mock Server HMR: ')}`, colors.bgRedBright(' REMOVE '), ...getMockeryLogInfo(mockery))
        }, 1)
      }
    }
  }

  private onAdd = (id: string): void => {
    id = slash(id)

    if (id.endsWith('mock.ts')) {
      this.changedMocks.add(id)
      this.scheduleRerun(id)
    }
    else {
      const needsRerun = this.handleFileChanged(id)
      if (needsRerun) {
        this.scheduleRerun(id)
      }
    }
  }

  /**
   * rerun changedMocks
   */
  private handleFileChanged(filepath: string): boolean {
    if (this.changedMocks.has(filepath)) {
      return false
    }

    if (mm.isMatch(filepath, this.mockeryContext.options.forceRerunTriggers || [])) {
      return true
    }

    const files: string[] = []
    const mods = this.mockeryContext.viteServer?.moduleGraph.getModulesByFile(filepath)

    const moduleCache = this.mockeryContext.viteNodeRunner?.moduleCache
    if (mods && mods.size) {
      moduleCache?.delete(filepath)

      if (this.mockeryContext.state.filesMap.has(filepath)) {
        this.changedMocks.add(filepath)
        files.push(filepath)
      }
      else {
        let rerun = false
        for (const mod of mods) {
          mod.importers.forEach((importer) => {
            if (!importer.file)
              return

            const needsRerun = this.handleFileChanged(importer.file)
            if (needsRerun) {
              rerun = true
            }
          })
        }

        if (rerun) {
          files.push(filepath)
        }
      }
    }
    return !!files.length
  }

  /**
   * when ts file changes
   */
  onTSFileChange?: (path: string) => void | Promise<void>
  /**
   * when mock file changes
   */
  async onMockeryFileChange(file: string) {
    const res = await this.mockeryContext.useMockeryFile(`${file}?v=${Date.now()}`)
    if (res?.mockery) {
      const { mockery } = res
      await this.mockeryContext.db.updateSceneSchema(mockery)
      consola.success(`${colors.magenta('Mock Server HMR: ')}`, ...getMockeryLogInfo(mockery))
    }
  }

  /**
   * on *.scene.json file change
   */
  async onSceneFileChange(_file: string) {
    const { db, server, options } = this.mockeryContext
    await db.readScene()
    // reload all handlers
    server.resetHandlers()
    await this.mockeryContext.useMockeryDirs(options.resolvedDirs)
    await db.updateConfigSchema()
  }

  /**
   * on config.json file change
   */
  async onConfigFileChange(_file: string) {
    const { db, server, options } = this.mockeryContext
    await db.readScene()
    // reload all handlers
    server.resetHandlers()
    await this.mockeryContext.useMockeryDirs(options.resolvedDirs)
  }
}
