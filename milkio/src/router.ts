import type ApiParams from '../generated/api-schema'

// eslint-disable-next-line unused-imports/no-unused-vars
export async function routerHandler(path: string, fullurl: URL): Promise<false | keyof (typeof ApiParams)['apiMethodsSchema']> {
  // ...
  return false
}
