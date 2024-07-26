import type { MockMethod } from 'unplugin-mockery'

export default [
  {
    url: '/api/ping',
    method: 'get',
    response: {
      code: 0,
      message: 'success',
      data: {
        name: 'pong',
      },
    },
  },
] as MockMethod[]
