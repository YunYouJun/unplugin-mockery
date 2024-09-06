import path from 'node:path'
import consola from 'consola'
import colors from 'picocolors'
import type { Options } from 'unplugin-mockery'
import { proxyPort } from '../../playground/config'
import { serveClient } from '../../src/core/client'
import { MockeryServer } from '../../src/mockery'

const mode = 'development'
consola.info(`[server] Running in ${colors.green(mode)} mode`)

const options: Options = {
  mockDir: path.resolve(import.meta.dirname, '../../playground/mock'),
}

const mockeryServer = new MockeryServer(options)
mockeryServer.init()
serveClient({
  mode,
  port: proxyPort,
})
