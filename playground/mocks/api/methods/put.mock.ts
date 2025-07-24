import { defineHttpMockery } from 'unplugin-mockery'

export default defineHttpMockery({
  url: '/methods/put',
  method: 'put',
  timeout: 5000,
  response: {
    message: 'I am a PUT method',
  },
})
