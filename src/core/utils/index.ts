import { consola } from 'consola'

export * from './mock'

export function noop(): void {}

/**
 * slash path for windows
 * @param str
 */
export function slash(str: string) {
  return str.replace(/\\/g, '/')
}

export function ensurePrefix(prefix: string, str: string) {
  if (!str.startsWith(prefix))
    return prefix + str
  return str
}

export function toAtFS(path: string) {
  return `/@fs${ensurePrefix('/', slash(path))}`
}

/**
 * await sleep(1000)
 * @param time
 */
export function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('')
    }, time)
  })
}

export async function openBrowser(address: string) {
  await import('open')
    .then(r => r.default(address, { newInstance: true }))
    .catch((e) => {
      consola.info('Failed to open browser:', e)
    })
}

// common
export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

// eslint-disable-next-line ts/no-unsafe-function-type
export function isFunction<T = Function>(val: unknown): val is T {
  return is(val, 'Function') || is(val, 'AsyncFunction')
}
