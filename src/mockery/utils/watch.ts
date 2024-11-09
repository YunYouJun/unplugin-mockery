import chokidar from 'chokidar'
import consola from 'consola'

import colors from 'picocolors'
import { logger } from './logger'

/**
 * Create a watcher to watch for changes in the mock server files
 */
export function createWatcher(options: {
  mockDir: string
  /**
   * when ts file changes
   */
  onTSFileChange?: (path: string) => void | Promise<void>
  /**
   * on *.scene.json file change
   */
  onSceneFileChange?: (path: string) => void | Promise<void>
  /**
   * on config.json file change
   */
  onConfigFileChange?: (path: string) => void | Promise<void>
}) {
  const watcher = chokidar.watch('.', {
    cwd: options.mockDir,
    // @see https://github.com/paulmillr/chokidar
    // @ts-expect-error _stats file only watch *.ts and *.json files
    ignored: (path, _stats) => _stats?.isFile() && !path.endsWith('.ts') && !path.endsWith('.json'),
    ignoreInitial: true,
  })
    .on('all', async (event, path) => {
      try {
        if (event === 'change' || event === 'add') {
          if (path.endsWith('.ts')) {
            logger.info(`${colors.bold(colors.blue('TS'))} file changed: ${colors.dim(path)}`)
            await options.onTSFileChange?.(path)
          }
          else if (path.endsWith('.scene.json')) {
            logger.info(`${colors.green('Scene')} file changed: ${colors.dim(path)}`)
            await options.onSceneFileChange?.(path)
          }
          else if (path.endsWith('config.json')) {
            logger.info(`${colors.cyan('Config')} file changed: ${colors.dim(path)}`)
            await options.onConfigFileChange?.(path)
          }
        }
      }
      catch (e) {
        consola.error('Error in watch file:', colors.dim(path))
        console.error(e)
      }
    })
  return watcher
}
