import type { IncomingMessage, ServerResponse } from 'node:http'

export interface Options {
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
   * mock/scenes/schema.json: schema file
   * mock/utils: utility files
   */
  mockDir: string

  /**
   * mock client ui
   */
  client?: {
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

export interface RespThisType {
  req: IncomingMessage
  res: ServerResponse
  parseJson: () => any
}

type Recordable<T = any> = Record<string, T>

export type MockResponse<T> = ((this: RespThisType, opt: {
  url: Recordable
  body: Recordable
  query: Recordable
  headers: Recordable
}) => T) | T

export type RawResponse = (req: IncomingMessage, res: ServerResponse) => void | Promise<void>

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
  rawResponse?: RawResponse

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
