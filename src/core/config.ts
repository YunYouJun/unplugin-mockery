import type { MockeryRequest } from '../types'

/**
 * curScene only can be one of the keys of scenes
 */
export function defineMockeryRequest<T extends MockeryRequest['scenes']>(method: MockeryRequest<T>): MockeryRequest<T> {
  if (!method.url) {
    throw new Error('URL is required')
  }
  // if curScene is not set, set it to the first key of scenes
  if (method.scenes && !method.curScene) {
    method.curScene = Object.keys(method.scenes)[0] as keyof T
  }
  return method
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
