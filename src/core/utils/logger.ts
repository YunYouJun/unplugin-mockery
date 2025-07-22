import type { MethodType, Mockery } from '../../types'
import { createConsola } from 'consola'
import { colors } from 'consola/utils'

import { MOCKERY_NAMESPACE } from '../constants'

// export const MOCKERY_NAMESPACE = colors.dim('🤡' + ' |')
/**
 * logger 的 consola 实例
 * 可修改全局配置，如日志等级等
 * @see https://www.npmjs.com/package/consola
 */
export const consola = createConsola()

/**
 * HTTP 请求方法 日志颜色
 */
export const METHOD_COLOR = {
  all: colors.bgCyan,
  get: colors.bgGreen,
  post: colors.bgBlue,
  put: colors.bgYellow,
  delete: colors.bgRed,
  patch: colors.bgMagenta,
}

/**
 * 请求耗时时间 日志颜色
 */
const TIMEOUT_COLOR = {
  slow: colors.red,
  normal: colors.yellow,
  fast: colors.green,
}

/**
 * custom logger for mockery
 * 带有命名空间的 Mockery logger
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
export function getMockeryLogInfo(mockery: Mockery) {
  const timeoutStr = getTimeoutStr(mockery.timeout || 0)
  const descStr = colors.gray(mockery.description || '')
  const curStatus = colors.blue(mockery._curStatus?.toString() || '')

  switch (mockery.type) {
    case 'http': {
      const methodColor = METHOD_COLOR[mockery.method?.toLowerCase() as MethodType] || colors.cyan
      return [
        colors.bgCyan(` ${colors.bold('HTTP')} `) + methodColor(` ${colors.bold(mockery.method?.toUpperCase().padEnd(6) || '')} `),
        timeoutStr,
        colors.cyan(colors.underline(mockery.path.toString())),
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
