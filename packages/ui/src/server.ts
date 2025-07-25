import path from 'node:path'
import { consola } from 'consola'
import { colors } from 'consola/utils'
import { proxyPort } from '../../../playground/config'
import { serveClient } from '../../../src/core/client'
import { createMockeryContext } from '../../../src/mockery'

export async function runServer(port: number) {
  const mode = 'development'
  consola.info(`[server] Running in ${colors.green(mode)} mode`)

  const ctx = createMockeryContext({
    dirs: [path.resolve(import.meta.dirname, '../../../playground/mocks')],
  })
  await ctx.init()

  await serveClient({
    mode,
    port,
  })
}

runServer(proxyPort)
