import process from 'node:process'
import { defineCommandHandler } from 'milkio'
import consola from 'consola'
import { milkio } from './milkio'

async function command() {
  const commandHandler = defineCommandHandler(await milkio, {
    notFoundHandler(e) {
      consola.error(e)
      consola.info('command not found')
    },
  })
  await commandHandler(process.argv)
}

command()
