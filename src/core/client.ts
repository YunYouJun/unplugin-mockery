import type { Express } from 'express'
import type * as http from 'node:http'
import type { AddressInfo } from 'node:net'
import type { MockeryContext } from '../mockery'
import process from 'node:process'
import { consola } from 'consola'
import { colors } from 'consola/utils'
import { getPort } from 'get-port-please'
import pkg from '../../package.json'
import { MOCKERY_NAMESPACE } from '../constants'
import { createMockClientServer } from '../mockery/server'
import { GLOBAL_STATE } from './env'

export function printLogForMockeryClient(ctx: MockeryContext) {
  const port = ctx.options.client?.port
  const url = `http://localhost:${port}`
  ctx.options.resolvedDirs.forEach((dir) => {
    consola.info(` ${'[📂]'}  ${colors.dim(dir)}`)
  })
  consola.info(` ${MOCKERY_NAMESPACE}  ${colors.bold('Mockery Client Server')}: ${colors.cyan(url)}`)

  // if (client?.open)
  //   openBrowser(url)

  const consumedTime = performance.now() - ctx.db.startTimestamp
  consola.success(` ${colors.green('[🚀]')}  ${colors.bold('Mockery')} ${colors.magenta(`v${pkg.version}`)}: ${colors.dim('ready in')} ${colors.green(`${consumedTime.toFixed(2)}ms`)}\n`)
}

/**
 * init mockery client & server
 */
export async function serveClient(options: {
  mode?: 'development' | 'production'
  staticPath?: string
  port?: number
  open?: boolean
}): Promise<{
  app: Express
  listener: http.Server
}> {
  // 检查端口是否被占用，自动获取可用端口
  const port = await getPort(options.port)
  const app = createMockClientServer({
    staticRoot: options.staticPath,
  })
  const listener = app.listen(port, callback)

  function callback() {
    const { port = 0 } = listener.address() as AddressInfo
    // set port
    const ctx = GLOBAL_STATE.mockeryCtx
    if (!ctx) {
      return
    }
    if (!ctx.options.client) {
      ctx.options.client = {
        port,
      }
    }
    else {
      ctx.options.client.port = port
    }
    printLogForMockeryClient(ctx)
  }

  // exit
  process.on('SIGINT', () => {
    listener.close()
    process.exit(0)
  })

  return {
    app,
    listener,
  }
}
