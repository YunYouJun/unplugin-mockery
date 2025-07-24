import { defineHttpMockery } from 'unplugin-mockery'

export default defineHttpMockery({
  url: '/methods/delete',
  timeout: 1500,
  method: 'delete',
  response: {
    message: 'I am a DELETE method',
  },
})
