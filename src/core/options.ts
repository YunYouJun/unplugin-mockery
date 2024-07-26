import path from 'node:path'
import type { Options } from '../types'

export const defaultOptions: Options = {
  client: {
    port: 3000,
    open: true,
  },
  mockDir: 'mock',
}

const dirname = typeof __dirname === 'undefined' ? import.meta.dirname : __dirname
/**
 * build client dist folder
 */
export const clientDistFolder = path.resolve(dirname, '../dist-client')
