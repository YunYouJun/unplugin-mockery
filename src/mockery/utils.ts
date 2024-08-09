import type { MockeryRequest } from '../types'

/**
 * is a mockery
 * @param mockery
 */
export function isMockery(mockery: MockeryRequest) {
  return !!mockery.url
}
