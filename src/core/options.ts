import type { MockeryOptions } from '../types'
import { createDefu } from 'defu'

export const replaceArrMerge = createDefu((obj, key, val) => {
  if (key && obj[key] && Array.isArray(obj[key]) && Array.isArray(val)) {
    obj[key] = val
    return true
  }
})

export const defaultOptions: MockeryOptions = {
  client: {
    enable: true,
    open: false,
  },
  mockDir: 'mock',
}

export type ResolvedOptions = Omit<MockeryOptions, 'dirs'> & {
  root: string
  dirs: string[]
  resolvedDirs: string[]
}

/**
 * Resolve options with default values
 */
export function resolveOptions(options: MockeryOptions | undefined): ResolvedOptions {
  const resolved = replaceArrMerge(options || {}, defaultOptions) as ResolvedOptions
  return resolved
}
