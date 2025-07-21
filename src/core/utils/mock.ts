import type { FilterPattern } from '@rollup/pluginutils'
import { createFilter } from '@rollup/pluginutils'
import fg from 'fast-glob'

/**
 * Get all mock files
 */
export async function getMockApiFiles(options: {
  /**
   * resolved dirs
   */
  dirs: string[]
  include?: FilterPattern
  exclude?: FilterPattern
  /**
   * Absolute path
   */
  absolute?: boolean
}) {
  const promiseArr = options.dirs.map(async (dir: string) => {
    const files = await fg('**/*.ts', {
      cwd: dir,
      absolute: options.absolute ?? true,
    })
    return files
  })
  const files = await Promise.all(promiseArr)
  const filter = createFilter(
    options.include || [/\.mock\.ts$/, /\.mockery\.ts$/],
    options.exclude || [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
  )
  return files.flat().filter(filter)
}
