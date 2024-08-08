import { env } from 'node:process'
import { defineHttpHandler, envToNumber } from 'milkio'
import { createServer } from '@hattip/adapter-node'
import consola from 'consola'
import { milkio } from './milkio'

async function serve() {
  const port = envToNumber(env.PORT, 9000)
  const httpHandler = defineHttpHandler(await milkio)
  // if you are using Bun
  // if you are using Hattip
  createServer(httpHandler).listen(port, '0.0.0.0', () => {
    consola.info(`Server listening on http://localhost:${envToNumber(env.PORT, 9000)}`)
  })
}

serve()
