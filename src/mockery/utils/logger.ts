import type { MethodType } from '../../types'
import consola from 'consola'
import c from 'picocolors'

export const MOCKERY_NAMESPACE = '[🤡]'

const METHOD_COLOR = {
  get: c.bgGreen,
  post: c.bgBlue,
  put: c.bgYellow,
  delete: c.bgRed,
  patch: c.bgMagenta,
}

/**
 * 打印请求日志
 * Print Request Log
 */
export function printRequestLog(params: {
  method: MethodType
  url: string
}) {
  const methodColor = METHOD_COLOR[params.method] || c.cyan
  consola.info(`${c.magenta(MOCKERY_NAMESPACE)} ${methodColor(` ${params.method} `)} ${c.cyan(params.url)}`)
}
