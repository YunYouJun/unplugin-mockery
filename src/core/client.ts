import type { Express } from 'express'
import type * as http from 'node:http'
import type { AddressInfo } from 'node:net'
import process from 'node:process'
import consola from 'consola'
import c from 'picocolors'
import { MockeryDB } from '../mockery'
import { createMockClientServer } from '../mockery/server'
import { globalState } from './env'
import { openBrowser } from './utils'

/**
 * init mockery client & server
 */
export function serveClient(options: {
  mode?: 'development' | 'production'
  staticPath?: string
  port?: number
  open?: boolean
}): {
    app: Express
    listener: http.Server
  } {
  const app = createMockClientServer({
    staticRoot: options.staticPath,
  })

  const listener = app.listen(options.port || 0, callback)

  function callback() {
    const { port = 0 } = listener.address() as AddressInfo
    // set port
    if (!MockeryDB.options.client) {
      MockeryDB.options.client = {
        port,
      }
    }
    else {
      MockeryDB.options.client.port = port
    }
    const url = `http://localhost:${port}`
    // eslint-disable-next-line no-console
    console.log()
    consola.info(`  ${c.green('🤡')}  ${c.bold('Mockery Started')}: ${c.cyan(url)}`)

    if (options.open)
      openBrowser(url)

    if (globalState.startTimestamp) {
      const consumedTime = performance.now() - globalState.startTimestamp
      consola.success(`  ${c.green('🚀')}  ${c.bold('Mockery Ready')}: ${c.green(`${consumedTime.toFixed(2)}ms`)}\n`)
    }
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
