import path from 'node:path'
import consola from 'consola'
import colors from 'picocolors'
import { jiti } from '../core/utils'
import type { MockeryRequest } from '../types'
import { defaultOptions } from '../core/options'
import { MockeryDB } from './db'

/**
 * is a mockery
 * @param mockery
 */
export function isMockery(mockery: MockeryRequest) {
  return !!mockery.url
}

/**
 * resolve mock dir
 */
export function resolveMockDir(mockDir?: string) {
  return path.resolve(mockDir || MockeryDB.options?.mockDir || defaultOptions.mockDir)
}

/**
 * resolve mockery request from file
 */
export async function resolveMockeryRequest(filePath: string) {
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
