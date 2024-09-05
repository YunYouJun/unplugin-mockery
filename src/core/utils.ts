import consola from 'consola'
import fg from 'fast-glob'
import createJITI from 'jiti'

import { filename } from '../shims'
import { resolveMockDir } from '../mockery'

/**
 * await sleep(1000)
 * @param time
 */
export function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('')
    }, time)
  })
}

// shim for esm
export const jiti = createJITI(filename, {
  // clear cache
  requireCache: false,
})

export async function openBrowser(address: string) {
  await import('open')
    .then(r => r.default(address, { newInstance: true }))
    .catch((e) => {
      consola.info('Failed to open browser:', e)
    })
}

/**
 * Get all mock files
 */
export function getMockApiFiles(options: {
  mockDir?: string
  /**
   * Absolute path
   */
  absolute?: boolean
} = {}) {
  const files = fg.sync('api/**/*.ts', {
    cwd: options.mockDir || resolveMockDir(),
    absolute: options.absolute ?? true,
  })
  return files
}

// common
export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

// eslint-disable-next-line ts/no-unsafe-function-type
export function isFunction<T = Function>(val: unknown): val is T {
  return is(val, 'Function') || is(val, 'AsyncFunction')
}
