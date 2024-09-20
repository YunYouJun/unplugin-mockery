import type { Options } from '../types'

export const defaultOptions: Options = {
  client: {
    enable: true,
    open: false,
  },
  mockDir: 'mock',
}

/**
 * Resolve options with default values
 */
export function resolveOptions(options: Options | undefined): Options {
  return {
    ...defaultOptions,
    ...options,
    client: {
      ...defaultOptions.client,
      ...options?.client,
    },
  }
}
