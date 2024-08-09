import { defineMockery } from 'unplugin-mockery'

export default defineMockery({
  url: '/api/ping',
  method: 'get',
  response: {
    code: 0,
    message: 'success',
    data: {
      name: 'pong',
    },
  },
})
