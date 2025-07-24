import { defineHttpMockery } from 'unplugin-mockery'

export default defineHttpMockery({
  url: '/api/examples',
  description: '示例',
  method: 'get',
  response: {
    code: 0,
    message: 'EXAMPLES',
  },
})
