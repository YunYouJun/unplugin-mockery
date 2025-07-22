import { defineHttpMockery } from 'unplugin-mockery'

export default defineHttpMockery({
  url: '/api/proposal',
  description: '提案',
  method: 'post',
  response: {
    code: -1,
    message: 'No',
  },
})
