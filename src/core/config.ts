import type { MockeryRequest } from '../types'

/**
 * curScene only can be one of the keys of scenes
 */
export function defineMockeryRequest<T = object>(mockery: MockeryRequest<T>): MockeryRequest<T> {
  if (!mockery.url) {
    throw new Error('URL is required')
  }
  // if curScene is not set, set it to the first key of scenes
  if (mockery.results && !mockery.curScene) {
    mockery.curScene = Object.keys(mockery.results)[0]
  }
  return mockery
}

/**
 * Define a mockery request
 * @alias defineMockeryRequest
 */
export const defineMockery = defineMockeryRequest

/**
 * @todo
 * mockery.config.ts
 */
export function defineMockeryConfig() {}
