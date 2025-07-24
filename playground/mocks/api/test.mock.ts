import { defineHttpMockery } from 'unplugin-mockery'

export default defineHttpMockery({
  url: '/api/test',
  method: 'get',
  response: {
    code: 0,
    message: 'success',
    data: {
      name: 'test',
    },
  },
})
