import type { Mockery } from '../../types'
import { getMockeryKey } from '../../../packages/shared'
import { GLOBAL_STATE } from '../../core'

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

/**
 * get cur key in scene
 *
 * 获取当前 Mockery 的结果状态
 */
export function getCurStatus(mockery: Mockery) {
  const DB = GLOBAL_STATE.mockeryCtx?.db
  const statusMap = mockery.statusMap || {}
  const mockeryKey = getMockeryKey(mockery)
  const curStatusInScene = mockery._curStatus || DB?.curSceneDB?.data[mockeryKey]

  const status = curStatusInScene || (Object.keys(statusMap)[0])
  return status
}

/**
 * get current response from results
 */
export function getCurResponse(mockery: Mockery, curStatus?: string) {
  const statusMap = mockery.statusMap || {}
  if (!curStatus)
    curStatus = getCurStatus(mockery) as string

  return statusMap[curStatus] || {}
}
