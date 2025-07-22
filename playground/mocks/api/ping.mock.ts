import { defineHttpMockery } from 'unplugin-mockery'

export default defineHttpMockery({
  path: '/api/ping',
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
