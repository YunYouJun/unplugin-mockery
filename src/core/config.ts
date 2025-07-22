import type { Mockery } from '../types'
import { defineDefineConfig } from 'define-config-ts'

export const PLUGIN_NAME = 'unplugin-mockery:webpack'

/**
 * curScene only can be one of the keys of scenes
 */
export function defineMockery<T = object>(mockery: Mockery<T>): Mockery<T> {
  if (!mockery.path) {
    throw new Error('Path is required')
  }
  return mockery
}

/**
 * Define a mockery request
 * @alias defineMockery
 */
export const defineHttpMockery = defineMockery

/**
 * @todo
 * mockery.config.ts
 */
export const defineMockeryConfig = defineDefineConfig()
