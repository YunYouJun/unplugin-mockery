import { defineHttpMockery } from 'unplugin-mockery'

export default defineHttpMockery({
  path: '/api/examples',
  description: '示例',
  method: 'get',
  response: {
    code: 0,
    message: 'EXAMPLES',
  },
})
