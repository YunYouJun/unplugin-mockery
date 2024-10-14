import type { MockeryRequest } from '../types'

export const PLUGIN_NAME = 'unplugin-mockery:webpack'

/**
 * curScene only can be one of the keys of scenes
 */
export function defineMockeryRequest<T = object>(mockery: MockeryRequest<T>): MockeryRequest<T> {
  if (!mockery.url) {
    throw new Error('URL is required')
  }
  return mockery
}

/**
 * Define a mockery request
 * @alias defineMockeryRequest
 */
export const defineHttpMockery = defineMockeryRequest

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
