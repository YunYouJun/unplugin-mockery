import type { FilterPattern } from '@rollup/pluginutils'
import type { LogLevel } from 'consola'
import type { SharedOptions } from 'msw'
import type { InlineConfig } from 'vite'

export interface MockerySharedOptions {
  /**
   * Watch the mock files and update the server automatically.
   * @default true
   */
  watch?: boolean
  /**
   * 被包含的文件名后缀，例如：`.mock.ts` / `.mockery.ts`
   * 只有以 `.mock.ts` 或 `.mockery.ts` 结尾的文件才会被视作 mock 文件。
   *
   * RegExp or glob to match files to be transformed
   * @default [/\.mock\.ts$/, /\.mockery\.ts$/]
   */
  include?: FilterPattern
  /**
   * RegExp or glob to match files to NOT be transformed
   * @default [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]
   */
  exclude?: FilterPattern

  vite?: InlineConfig

  /**
   * @see https://mswjs.io/
   */
  msw?: {
    /**
     * server.listen options
     *
     * @see https://github.com/mswjs/msw/discussions/1589
     */
    listenOptions?: Partial<SharedOptions>
  }

  /**
   * global setup file
   * @default mocks/setup.ts
   */
  globalSetup?: string

}

export interface MockeryOptions extends MockerySharedOptions {
  /**
   * Log Level 日志等级
   *
   * @see [unjs/consola#log-level](https://github.com/unjs/consola#log-level)
   *
   * - 0: Fatal and Error
   * - 1: Warnings
   * - 2: Normal logs
   * - 3: Informational logs, success, fail, ready, start, ...
   * - 4: Debug logs
   * - 5: Trace logs
   * - -999: Silent
   * - +999: Verbose logs
   *
   * @example
   * 如不希望打印请求日志：
   * ```ts
   * const options = {
   *   logLevel: 1 // 只打印 warn 日志
   * }
   * ```
   *
   * 什么日志都不打印：
   * ```ts
   * import { LogLevels } from 'consola'
   *
   * const options = {
   *   logLevel: LogLevels.silent
   * }
   * ```
   */
  logLevel?: LogLevel

  /**
   * Base URL for inspector UI
   *
   * @default read from Vite's config
   */
  base?: string

  // define your plugin options here
  /**
   * Display debug information.
   */
  debug?: boolean

  /**
   * The directory where the mock files are located.
   *
   * - `<mockDir>/api/`: mock files
   * - `<mockDir>/scenes/`: scene files
   * - `<mockDir>/schemas/`: schema file
   *   - `scene.schema.json`: scene schema file
   *   - `config.schema.json`: config schema file
   * - `<mockDir>/config.json`: configuration file
   *
   * @default 'mock'
   */
  mockDir: string

  /**
   * mock client ui
   * @see http://localhost:<port>
   */
  client?: {
    /**
     * enable client
     * @default true
     */
    enable?: boolean
    /**
     * The port to run the client server.
     */
    port?: number
    /**
     * auto open browser.
     */
    open?: boolean
  }
}
