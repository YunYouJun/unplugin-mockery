import { defineHttpMockery } from 'unplugin-mockery'

export default defineHttpMockery({
  path: '/methods/get',
  method: 'get',
  timeout: 200,
  response: {
    message: 'I am a GET method',
  },
})
