import type { MethodType, Mockery } from '../../types'
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
 * 获取请求超时时间字符串
 */
export function getTimeoutStr(timeout: number) {
  let timeoutType = ''
  if (timeout) {
    if (timeout > 1000) {
      timeoutType = 'slow'
    }
    else if (timeout > 500) {
      timeoutType = 'normal'
    }
    else {
      timeoutType = 'fast'
    }
  }
  const timeoutColor = TIMEOUT_COLOR[timeoutType as keyof typeof TIMEOUT_COLOR] || colors.gray
  return timeoutColor(` ${timeout || 0}ms`.padStart(7))
}

/**
 * 获取日志信息 但是不打印
 */
export function getMockeryLogInfo(req: Mockery) {
  const timeoutStr = getTimeoutStr(req.timeout || 0)
  const descStr = colors.gray(req.description || '')
  const curStatus = colors.blue(req._curStatus?.toString() || '')

  switch (req.type) {
    case 'http': {
      const methodColor = METHOD_COLOR[req.method?.toLowerCase() as MethodType] || colors.cyan
      return [
        colors.bgCyan(` ${colors.bold('HTTP')} `) + methodColor(` ${colors.bold(req.method?.toUpperCase().padEnd(6) || '')} `),
        timeoutStr,
        colors.cyan(colors.underline(req.path.toString())),
        descStr,
        curStatus,
      ]
    }
    default:
      break
  }

  return []
}

/**
 * 打印请求日志
 * Print Request Log
 */
export function printRequestLog(mockery: Mockery) {
  // false 时不打印日志
  if (mockery.log === false)
    return

  const logInfo = getMockeryLogInfo(mockery)
  if (logInfo)
    logger.info(...logInfo)
}
