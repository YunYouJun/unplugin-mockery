import type { AddressInfo } from 'node:net'
import process from 'node:process'
import c from 'picocolors'
import consola from 'consola'
import { openBrowser } from './utils'
import { globalState } from './env'

import { createMockClientServer } from './server'

export function serveClient(options: {
  mode?: 'development' | 'production'
  staticPath?: string
  port?: number
}) {
  const app = createMockClientServer({
    staticRoot: options.staticPath,
  })

  const listener = app.listen(options.port || 0, callback)

  function callback() {
    const { port } = listener.address() as AddressInfo
    const url = `http://localhost:${port}`
    // eslint-disable-next-line no-console
    console.log()
    consola.info(`  ${c.green('🤡')}  ${c.bold('Mockery Started')}: ${c.cyan(url)}`)

    if (globalState.userOptions?.client?.open)
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
}
