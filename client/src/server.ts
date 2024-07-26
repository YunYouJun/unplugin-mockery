import path from 'node:path'
import consola from 'consola'
import colors from 'picocolors'
import { serveClient } from '../../src/core/client'
import { globalState } from '../../src/core/env'

const mode = 'development'
consola.info(`[server] Running in ${colors.green(mode)} mode`)

globalState.userOptions = {
  mockDir: path.resolve(import.meta.dirname, '../../playground/mock'),
}

serveClient({
  mode,
  port: 51224,
})
