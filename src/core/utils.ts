import consola from 'consola'
import fg from 'fast-glob'
import createJITI from 'jiti'

import { filename } from '../shims'

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
  mockDir: string
  /**
   * Absolute path
   */
  absolute?: boolean
}) {
  const files = fg.sync('api/**/*.ts', {
    cwd: options.mockDir,
    absolute: options.absolute ?? true,
  })
  return files
}
