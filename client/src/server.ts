import path from 'node:path'
import consola from 'consola'
import colors from 'picocolors'
import { serveClient } from '../../src/core/client'
import { globalState } from '../../src/core/env'
import { MockeryServer } from '../../src/mockery'

const mode = 'development'
consola.info(`[server] Running in ${colors.green(mode)} mode`)

globalState.userOptions = {
  mockDir: path.resolve(import.meta.dirname, '../../playground/mock'),
}

const mockeryServer = new MockeryServer(globalState.userOptions)
mockeryServer.init()
serveClient({
  mode,
  port: 51224,
})
