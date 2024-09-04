import consola from 'consola'
import colors from 'picocolors'
import { jiti } from '../core/utils'
import type { MockeryRequest } from '../types'

/**
 * is a mockery
 * @param mockery
 */
export function isMockery(mockery: MockeryRequest) {
  return !!mockery.url
}

/**
 * parse mockery request from file
 */
export async function parseMockeryRequest(filePath: string) {
  consola.debug(`  Registering Mock Server: ${colors.dim(filePath)}`)
  const mockeryRequest = jiti(filePath).default as (MockeryRequest | (() => MockeryRequest | Promise<MockeryRequest>))
  if (!mockeryRequest) {
    return {} as MockeryRequest
  }
  else if (typeof mockeryRequest === 'function') {
    return await mockeryRequest()
  }
  else if (typeof mockeryRequest === 'object') {
    return mockeryRequest
  }
  else {
    throw new TypeError('mockery must be a function or object')
  }
}
