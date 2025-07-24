import type { HttpMockery, Mockery } from '../types'
import { defineDefineConfig } from 'define-config-ts'

export const PLUGIN_NAME = 'unplugin-mockery:webpack'

/**
 * curScene only can be one of the keys of scenes
 */
export function defineMockery<T = object>(mockery: Mockery<T>): Mockery<T> {
  if (!mockery.path) {
    throw new Error('`path` Or `url` is required')
  }
  return mockery
}

/**
 * Define a mockery request
 */
export function defineHttpMockery<T = object>(mockery: Omit<HttpMockery<T>, 'type'>): HttpMockery<T> {
  if (!mockery.path && !mockery.url) {
    throw new Error('`path` Or `url` is required')
  }
  return {
    ...mockery,
    type: 'http',
  }
}

/**
 * @todo
 * mockery.config.ts
 */
export const defineMockeryConfig = defineDefineConfig()
