import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { filename } from '../shims'

export const DIR_DIST = typeof __dirname !== 'undefined'
  ? __dirname
  : dirname(fileURLToPath(filename))

/**
 * build client dist folder
 */
export const clientDistFolder = resolve(filename, '../../dist-client')
export const DIR_CLIENT = clientDistFolder
/**
 * widget client entry
 * 挂件，用于在其他网站上嵌入
 */
export const widgetClientEntry = resolve(filename, '../../widget', 'dist/index.mjs')
