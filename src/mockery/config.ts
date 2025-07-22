import type { MockeryOptions } from '../types'
import process from 'node:process'
import { consola } from 'consola'
import { colors } from 'consola/utils'
import { loadConfig } from 'define-config-ts'
import { defaultOptions, replaceArrMerge } from '../core/options'

/**
 * 从当前目录加载 mockery 配置（若 `mockery.config.ts` 存在）
 * load `mockery.config.ts` from cwd
 */
export async function loadMockeryConfig(cwd?: string, options?: MockeryOptions) {
  const start = Date.now()
  const resolvedConfig = await loadConfig<MockeryOptions>({
    name: 'mockery',
    cwd: cwd || process.cwd(),
  })
  const duration = Date.now() - start

  if (resolvedConfig.configFile) {
    consola.info(`Loaded mockery config from ${colors.cyan(resolvedConfig.configFile)} in ${colors.green(`${duration}ms`)}`)
  }

  resolvedConfig.config = replaceArrMerge(resolvedConfig.config, options, defaultOptions)
  return resolvedConfig
}
