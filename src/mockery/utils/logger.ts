import consola from 'consola'
import c from 'picocolors'
import type { MethodType } from '../../types'

const METHOD_COLOR = {
  get: c.green,
  post: c.blue,
  put: c.yellow,
  delete: c.red,
  patch: c.magenta,
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
  consola.info(`${c.cyan('[MOCK]')} ${methodColor(` ${params.method} `)} ${c.green(params.url)}`)
}
