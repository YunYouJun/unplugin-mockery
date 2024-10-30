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
 * client widget
 */
export const clientWidgetEntry = resolve(filename, '../../client', 'client.js')
