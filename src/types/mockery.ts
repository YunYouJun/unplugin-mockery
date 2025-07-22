import type { Request, Response } from 'express'
import type { http, HttpHandler, Path, RequestHandlerOptions, ResponseResolver } from 'msw'
import type { IncomingMessage, ServerResponse } from 'node:http'

export type MockResponse<T> = ((req: Request) => T | Promise<T>) | T
export type RawResponse = (req: Request, res: Response) => void | Promise<void>

export interface MSWHandlerOptions {
  /**
   * same with msw path
   *
   * `/user` or `https://api.example.com/user`
   *
   * may be you need `*\/user`(remove `\`) to match all prefixes
   */
  path: Path
  /**
   * @default all support(get/post/put/delete/patch)
   */
  method?: keyof typeof http
  /**
   * msw resolver
   * resolver 优先级高于 response
   * @see https://mswjs.io/docs/basics/mocking-responses
   *
   * @example
   * ```ts
   * import { http, HttpResponse } from 'msw'
   *
   * export default defineHttpMockery({
   *   url: '/login',
   *   method: 'post',
   *   resolver: async ({ request }) => {
   *     await isAuthenticated(request)
   *
   *     return new HttpResponse(null, {
   *       status: 302,
   *       headers: {
   *         Location: '/dashboard',
   *       },
   *     })
   *   }
   * })
   * ```
   */
  resolver?: ResponseResolver
  options?: RequestHandlerOptions
}

export interface BaseMockery<T = object, STATUS extends string = string> extends MSWHandlerOptions {
  /**
   * @inner
   */
  handler?: HttpHandler

  /**
   * @default http
   */
  type?: 'http'

  /**
   * 请求描述
   */
  description?: string

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
   * filepath
   * @runtime
   *
   * only when useMockeryFile
   */
  _filepath?: string
  /**
   * cur status
   * 接口当前状态
   * @protected
   * @runtime
   *
   * 可通过 `setStatus` 设置，请勿手动直接修改该变量
   * 通过 `getStatus` 获取当前状态
   */
  _curStatus?: STATUS | Record<string, STATUS>
}

export interface HttpMockery<T = object> extends BaseMockery<T> {
  type: 'http'
}

/**
 * one mock as mockery
 */
export type Mockery<T = object> = HttpMockery<T>

export interface MockeryItem<T = object> {
  path: string
  mockery: Mockery<T>
}
