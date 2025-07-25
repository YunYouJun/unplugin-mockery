import type { Mockery } from '../../types'

export * from './common'

/**
 * is a mockery
 *
 * 是否为一个标准的 Mockery 对象
 * @param mockery
 */
export function isMockery(mockery: any): mockery is Mockery {
  return mockery
    && mockery instanceof Object && mockery.type
    && ('path' in mockery || 'url' in mockery || 'methodName' in mockery)
}
