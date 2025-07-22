import type { MockeryContext } from '..'
import type { Mockery } from '../../types'
import { getMockeryKey } from '../../../packages/shared'

/**
 * mount helper
 */
export function createMockeryRequest(options: {
  mockery: Mockery
  mockeryContext: MockeryContext
}) {
  const { mockery, mockeryContext } = options;

  /**
   * for getStatus in response & hmr
   */
  (mockery as any).getStatus = (groupKey?: string) => {
    const curStatus = mockery._curStatus || mockeryContext.db.curSceneDB?.data[getMockeryKey(mockery)]
    if (groupKey) {
      if (typeof curStatus === 'object') {
        return curStatus[groupKey]
      }
    }
    return curStatus
  }
  (mockery as any).setStatus = async (status?: string | object) => {
    if (typeof status === 'object') {
      if (typeof mockery._curStatus !== 'object') {
        mockery._curStatus = {}
      }
      Object.assign(mockery._curStatus, status)
    }
    else {
      mockery._curStatus = status
    }
    // not update db
    // const key = getMockeryKey(mockery)
    // await mockeryContext.db.curSceneDB?.update((data) => {
    //   data[key] = mockery._curStatus as any
    // })
    return mockery._curStatus
  }
  return mockery
}
