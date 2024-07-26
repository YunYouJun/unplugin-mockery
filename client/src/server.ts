import consola from 'consola'
import colors from 'picocolors'
import { serveClient } from '../../src/core/client'

const mode = 'development'
consola.info(`[server] Running in ${colors.green(mode)} mode`)

serveClient({
  mode,
  port: 51224,
})
