import type { IncomingMessage } from 'node:http'

export type Recordable<T = any> = Record<string, T>

/**
 * parseJson for vite http
 * @param req
 */
export function parseJson(req: IncomingMessage): Promise<Recordable> {
  return new Promise((resolve) => {
    let jsonStr: Recordable = {}
    let str = ''
    req.on('data', (chunk) => {
      str += chunk
    })
    req.on('end', () => {
      try {
        // json
        jsonStr = JSON.parse(str)
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (e) {
        // x-www-form-urlencoded
        const params = new URLSearchParams(str)
        const body: Recordable = {}
        params.forEach((value, key) => {
          body[key] = value
        })
        jsonStr = body
      }
      resolve(jsonStr)
    })
  })
}
