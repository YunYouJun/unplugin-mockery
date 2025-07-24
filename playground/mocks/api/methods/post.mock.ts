import { defineHttpMockery } from 'unplugin-mockery'

export default defineHttpMockery({
  url: '/methods/post',
  method: 'post',
  timeout: 500,
  response: {
    message: 'I am a POST method',
  },
})
