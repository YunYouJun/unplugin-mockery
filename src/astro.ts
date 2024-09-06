import unplugin from '.'

import type { Options } from './types'

export default (options: Options) => ({
  name: 'unplugin-mockery',
  hooks: {
    'astro:config:setup': async (astro: any) => {
      astro.config.vite.plugins ||= []
      astro.config.vite.plugins.push(unplugin.vite(options))
    },
  },
})
