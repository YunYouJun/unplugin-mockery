import { defineHttpMockery } from 'unplugin-mockery'

export default defineHttpMockery({
  url: '/methods/patch',
  method: 'patch',
  timeout: 2000,
  response: {
    message: 'I am a PATCH method',
  },
})
