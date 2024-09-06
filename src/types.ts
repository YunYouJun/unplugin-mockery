import type { Request, Response } from 'express'
import type { IncomingMessage, ServerResponse } from 'node:http'

export interface Options {
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
   * @default 'mock'
   * mock/api: mock files
   * mock/scenes: scene files
   * mock/schemas: schema file
   *   scene.schema.json: scene schema file
   *   config.schema.json: config schema file
   * mock/utils: utility files
   * mock/config.json: configuration file
   */
  mockDir: string

  /**
   * mock client ui
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

export type MethodType = 'get' | 'post' | 'put' | 'delete' | 'patch'

export type MockResponse<T> = ((req: Request) => T | Promise<T>) | T

export type RawResponse = (req: Request, res: Response) => void | Promise<void>

export interface MockeryRequest<T = object> {
  url: string
  /**
   * 请求描述
   */
  description?: string
  method?: MethodType
  /**
   * 请求延迟时间
   */
  timeout?: number
  statusCode?: number
  response?: MockResponse<T>
  rawResponse?: RawResponse | ((req: IncomingMessage, res: ServerResponse) => Promise<void>)

  results?: Record<string, MockResponse<T>>
  /**
   * @deprecated let's use jsonc to combine scenes
   */
  scenes?: T
  /**
   * @deprecated let's use jsonc to combine scenes
   */
  curScene?: string
}

export type Mockery<T = object> = MockeryRequest<T>

export interface MockeryItem<T = object> {
  path: string
  mockery: MockeryRequest<T>
}
