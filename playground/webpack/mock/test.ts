import type { MockMethod } from '../../../src/types'

export default [
  {
    url: '/api/test',
    method: 'get',
    response: {
      code: 0,
      message: 'success',
      data: {
        name: 'test',
      },
    },
  },
] as MockMethod[]
