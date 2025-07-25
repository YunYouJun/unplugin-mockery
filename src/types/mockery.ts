import type { http, HttpHandler, HttpResponseResolver, Path, RequestHandlerOptions } from 'msw'

export interface MSWHandlerOptions {
  /**
   * same with msw path
   *
   * `/user` or `https://api.example.com/user`
   *
   * may be you need `*\/user`(remove `\`) to match all prefixes
   */
  path?: Path
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
  resolver?: HttpResponseResolver
  options?: RequestHandlerOptions
}

export interface BaseMockery<T = object, STATUS extends string = string> extends MSWHandlerOptions {
  /**
   * same with msw path
   *
   * different with `url`, `path` will not add `*` automatically
   */
  path?: Path
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

  response?: T

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
  _curStatus?: STATUS
}

export interface StatusItem {
  /**
   * 结果名称
   * 若不设置，则使用 key 展示
   */
  name?: string
  /**
   * 结果描述
   */
  description?: string
  resolver: HttpResponseResolver
}

export type HttpMockery<T = object, STATUS extends string = string> = BaseMockery<T, STATUS> & {
  type: 'http'
  /**
   * @default all support(get/post/put/delete/patch)
   */
  method?: keyof typeof http
  /**
   * default status
   */
  defaultStatus?: STATUS
  /**
   * 返回状态 map
   */
  statusMap?: Record<STATUS, StatusItem>
  /**
   * same with msw path
   *
   * `/user` or `https://api.example.com/user`
   *
   * may be you need `*\/user`(remove `\`) to match all prefixes
   *
   * if url not starts with '*', it will automatically add `*` to match all prefixes
   */
  url?: Path
}

/**
 * one mock as mockery
 */
export type Mockery<T = object, STATUS extends string = string> = HttpMockery<T, STATUS>

export interface MockeryItem<T = object> {
  path: string
  mockery: Mockery<T>
}
