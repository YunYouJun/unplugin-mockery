import { createTRPCClient, httpBatchLink } from '@trpc/client'
import NProgress from 'nprogress'
import { tap } from '@trpc/server/observable'
import type { AppRouter } from '../server'

//     👆 **type-only** import

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
export class MockeryTRPCClient {
  static client: ReturnType<typeof createTRPCClient<AppRouter>>

  static init() {
    this.client = createTRPCClient<AppRouter>({
      links: [
        // eslint-disable-next-line unicorn/consistent-function-scoping
        () => ({ op, next }) => {
          NProgress.start()

          return next(op).pipe(
            tap({
              next() {
                NProgress.done()
              },
            }),
          )
        },
        httpBatchLink({
          url: `${window.location.origin}/trpc`,
        }),
      ],
    })
  }
}
