import { createTRPCClient, httpLink } from '@trpc/client'
import type { AppRouter } from '../server'
//     👆 **type-only** import

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
export class MockeryTRPCClient {
  static client: ReturnType<typeof createTRPCClient<AppRouter>>

  static init() {
    this.client = createTRPCClient<AppRouter>({
      links: [
        httpLink({
          url: `${window.location.origin}/trpc`,
        }),
      ],
    })
  }
}
