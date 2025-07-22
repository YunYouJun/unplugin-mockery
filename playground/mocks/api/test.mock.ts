import { defineHttpMockery } from 'unplugin-mockery'

export default defineHttpMockery({
  path: '/api/test',
  method: 'get',
  response: {
    code: 0,
    message: 'success',
    data: {
      name: 'test',
    },
  },
})
