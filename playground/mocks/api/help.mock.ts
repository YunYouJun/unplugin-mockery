import { defineHttpMockery } from 'unplugin-mockery'

export default defineHttpMockery({
  path: '/api/help',
  description: '帮助',
  method: 'get',
  response: {
    code: 0,
    message: 'SOS',
  },
})
