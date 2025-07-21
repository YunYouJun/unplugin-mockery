import type { Request, Response } from 'express'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { MethodType } from './api'

export type MockResponse<T> = ((req: Request) => T | Promise<T>) | T
export type RawResponse = (req: Request, res: Response) => void | Promise<void>

export interface MockeryRequest<T = object> {
  /**
   * @default http
   */
  type?: 'http'

  url: string
  /**
   * 请求描述
   */
  description?: string
  /**
   * @default all support(get/post/put/delete/patch)
   */
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
   * @inner
   */
  curScene?: string

  /**
   * 是否打印请求日志
   * @default true
   *
   * - `log: 'debug'` 打印更多的日志
   */
  log?: boolean | 'debug'

  /**
   * cur result key
   * @inner
   */
  _curKey?: string
  _curStatus?: string
}

export type Mockery<T = object> = MockeryRequest<T>

export interface MockeryItem<T = object> {
  path: string
  mockery: MockeryRequest<T>
}
