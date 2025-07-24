import { resolve } from 'node:path'
import { colors } from 'consola/utils'

/**
 * 日志命名空间
 */
export const MOCKERY_NAMESPACE = colors.magenta('[🤡]')

export const DIR_DIST = resolve(import.meta.dirname, '../../dist')
/**
 * build client dist folder
 */
export const clientDistFolder = resolve(import.meta.dirname, '../../packages/client/dist')
export const DIR_CLIENT = clientDistFolder
/**
 * widget client entry
 * 挂件，用于在其他网站上嵌入
 */
export const widgetClientEntry = resolve(import.meta.dirname, '../../packages/widget', 'dist/index.mjs')
