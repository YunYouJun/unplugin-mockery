import path from 'node:path'
import type { Options } from '../types'

export const defaultOptions: Options = {
  client: {
    port: 3000,
    open: true,
  },
  mockDir: 'mock',
}

/**
 * build client dist folder
 */
export const clientDistFolder = path.resolve(__dirname, '../dist-client')
