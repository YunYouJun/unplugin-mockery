import { defineMockery } from 'unplugin-mockery'

export default defineMockery({
  url: '/api/ping',
  description: '连通测试',
  method: 'get',
  response: {
    code: 0,
    message: 'success',
    data: {
      name: 'pong',
    },
  },
})
