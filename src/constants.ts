import { resolve } from 'node:path'
import { colors } from 'consola/utils'

/**
 * 日志命名空间
 */
export const MOCKERY_NAMESPACE = colors.magenta('[🤡]')

export const PACKAGES_ROOT = resolve(import.meta.dirname, '../packages')
/**
 * build ui dist folder
 */
export const UI_DIST_DIR = resolve(PACKAGES_ROOT, 'ui/dist')
/**
 * widget client entry
 * 挂件，用于在其他网站上嵌入
 */
export const WIDGET_CLIENT_ENTRY = resolve(PACKAGES_ROOT, 'widget/dist/index.mjs')
