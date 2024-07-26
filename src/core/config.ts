import type { MockMethod } from '../types'

/**
 * curScene only can be one of the keys of scenes
 * @param methods
 */
export function defineMockMethod<T extends MockMethod['scenes']>(method: MockMethod<T>): MockMethod<T> {
  if (!method.url) {
    throw new Error('URL is required')
  }
  // if curScene is not set, set it to the first key of scenes
  if (method.scenes && !method.curScene) {
    method.curScene = Object.keys(method.scenes)[0] as keyof T
  }
  return method
}
