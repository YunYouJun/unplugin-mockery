import type { MockeryOptions } from '../types'
import { resolve } from 'node:path'
import process from 'node:process'
import { createDefu } from 'defu'

import { slash } from './utils'

export const replaceArrMerge = createDefu((obj, key, val) => {
  if (key && obj[key] && Array.isArray(obj[key]) && Array.isArray(val)) {
    obj[key] = val
    return true
  }
})

export const defaultOptions: MockeryOptions = {
  dirs: ['mocks'],
  deep: true,
  dotFiles: true,
  client: {
    enable: true,
    open: false,
  },
  globalSetup: 'mocks/setup.ts',
  forceRerunTriggers: ['**/mockery.config.ts'],
}

function resolveGlobsExclude(root: string, glob: string) {
  const excludeReg = /^!/
  return `${excludeReg.test(glob) ? '!' : ''}${resolve(root, glob.replace(excludeReg, ''))}`
}

export type ResolvedOptions = Omit<MockeryOptions, 'dirs'> & {
  root: string
  dirs: string[]
  resolvedDirs: string[]
}

/**
 * Resolve options with default values
 */
export function resolveOptions(options: MockeryOptions | undefined, root = process.cwd()): ResolvedOptions {
  const resolved = replaceArrMerge(options || {}, defaultOptions) as ResolvedOptions

  resolved.dirs = Array.isArray(resolved.dirs) ? resolved.dirs : [resolved.dirs]
  resolved.resolvedDirs = resolved.dirs.map(dir => slash(resolveGlobsExclude(root, dir)))

  return resolved
}
