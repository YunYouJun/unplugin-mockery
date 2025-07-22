import type { Mockery } from '../../types'
import { consola } from 'consola'

/**
 * get key from mockery
 *
 * 从 Mockery 对象中获取 key
 */
export function getMockeryKey(mockery: Mockery) {
  let key = ''
  switch (mockery.type) {
    case 'http': {
      key = mockery.path?.toString()
      break
    }
    default:
      break
  }
  if (!key) {
    consola.debug('Mockery', mockery)
    return ''
    // throw new Error('mockery key (url/methodName) is empty')
  }
  return key
}

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
