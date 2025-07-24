import type { Mockery } from '../../src/types'
import { consola } from 'consola'

/**
 * get key from mockery
 *
 * 从 Mockery 对象中获取 key
 */
export function getMockeryKey(mockery: Mockery) {
  let key = ''
  const { path, url } = mockery

  switch (mockery.type) {
    case 'http': {
      key = (path || url)?.toString() || ''
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
