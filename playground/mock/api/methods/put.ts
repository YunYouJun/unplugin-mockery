import { defineMockery } from 'unplugin-mockery'

export default defineMockery({
  url: '/methods/put',
  method: 'put',
  timeout: 5000,
  response: {
    message: 'I am a PUT method',
  },
})
