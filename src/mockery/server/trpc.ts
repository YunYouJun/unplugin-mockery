/* eslint-disable unused-imports/no-unused-vars */
import { initTRPC } from '@trpc/server'
import type * as trpcExpress from '@trpc/server/adapters/express'

export * as trpcExpress from '@trpc/server/adapters/express'

// created for each request
export function createContext({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) {
  return {}
} // no context
type Context = Awaited<ReturnType<typeof createContext>>
export const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure
