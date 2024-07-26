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

interface RespThisType {
  req: IncomingMessage
  res: ServerResponse
  parseJson: () => any
}

type Recordable<T = any> = Record<string, T>

export interface MockMethod {
  url: string
  method?: MethodType
  timeout?: number
  statusCode?: number
  response?: ((this: RespThisType, opt: {
    url: Recordable
    body: Recordable
    query: Recordable
    headers: Recordable
  }) => any) | any
  rawResponse?: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>
}
