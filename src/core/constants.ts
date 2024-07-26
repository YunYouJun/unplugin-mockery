import path from 'node:path'
import { filename } from './shims'

/**
 * build client dist folder
 */
export const clientDistFolder = path.resolve(filename, '../dist-client')
