import consola from 'consola'
import c from 'picocolors'
import type { MethodType } from '../../types'

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
  consola.info(`${c.magenta('[MOCKERY]')} ${methodColor(` ${params.method} `)} ${c.cyan(params.url)}`)
}
