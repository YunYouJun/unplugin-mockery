/* eslint-disable unused-imports/no-unused-vars */
import type * as trpcExpress from '@trpc/server/adapters/express'
import { initTRPC } from '@trpc/server'

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
