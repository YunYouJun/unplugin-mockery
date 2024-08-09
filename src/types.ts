import type { IncomingMessage, ServerResponse } from 'node:http'

export interface Options {
  // define your plugin options here
  /**
   * Display debug information.
   */
  debug?: boolean

  /**
   * The directory where the mock files are located.
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

export type MockResponse = ((this: RespThisType, opt: {
  url: Recordable
  body: Recordable
  query: Recordable
  headers: Recordable
}) => any) | any

export type RawResponse = (req: IncomingMessage, res: ServerResponse) => void | Promise<void>

type MockScenes = Record<string, MockResponse>

export interface MockeryRequest<T extends MockScenes | undefined = MockScenes> {
  url: string
  method?: MethodType
  timeout?: number
  statusCode?: number
  response?: MockResponse
  rawResponse?: RawResponse

  scenes?: T
  curScene?: keyof T | ''
}

export interface MockeryItem {
  path: string
  mockery: MockeryRequest
}
