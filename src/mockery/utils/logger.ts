import type { MethodType, MockeryRequest } from '../../types'
import { consola } from 'consola'
import { colors } from 'consola/utils'

// export const MOCKERY_NAMESPACE = colors.dim('🤡' + ' |')
export const MOCKERY_NAMESPACE = colors.magenta('[🤡]')

const METHOD_COLOR = {
  all: colors.bgCyan,
  get: colors.bgGreen,
  post: colors.bgBlue,
  put: colors.bgYellow,
  delete: colors.bgRed,
  patch: colors.bgMagenta,
}

const TIMEOUT_COLOR = {
  slow: colors.red,
  normal: colors.yellow,
  fast: colors.green,
}

/**
 * custom logger for mockery
 */
export const logger = {
  info: (...args: any[]) => consola.info(MOCKERY_NAMESPACE, ...args),
}

/**
 * 打印请求日志
 * Print Request Log
 */
export function printRequestLog(req: MockeryRequest) {
  const methodColor = METHOD_COLOR[req.method?.toLowerCase() as MethodType] || colors.cyan
  let timeoutType = ''
  if (req.timeout) {
    if (req.timeout > 1000) {
      timeoutType = 'slow'
    }
    else if (req.timeout > 500) {
      timeoutType = 'normal'
    }
    else {
      timeoutType = 'fast'
    }
  }
  const timeoutColor = TIMEOUT_COLOR[timeoutType as keyof typeof TIMEOUT_COLOR] || colors.gray
  logger.info(
    methodColor(` ${req.method?.toUpperCase()} `),
    timeoutColor(` ${req.timeout || 0}ms`.padStart(6)),
    colors.cyan(colors.underline(req.url)),
    colors.gray(req.description || ''),
    colors.blue(req._curKey || ''),
  )
}
