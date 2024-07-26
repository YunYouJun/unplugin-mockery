import consola from 'consola'
import fg from 'fast-glob'
import createJITI from 'jiti'

// shim for esm
export const jiti = typeof require === 'undefined'
  ? createJITI(import.meta.url)
  : createJITI(__filename, {
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
 * @param mockDir
 */
export function getMockFiles(mockDir: string) {
  const files = fg.sync('**/*.ts', {
    cwd: mockDir,
    absolute: true,
  })
  return files
}
