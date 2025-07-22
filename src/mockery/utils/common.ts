import type { Mockery } from '../../types'

/**
 * get request url from mockery
 *
 * 从 Mockery 对象中获取请求 URL（JSAPI 对应的 HTTP URL）
 */
export function getRequestUrl(mockery: Mockery) {
  let url = ''

  switch (mockery.type) {
    case 'http':
    default:
      url = mockery.path.toString()
      if (url.startsWith('http')) {
        url = new URL(url).pathname
      }
      break
  }
  return url
}
