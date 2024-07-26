import { defineMockery } from 'unplugin-mockery'

export default defineMockery({
  url: '/methods/put',
  method: 'put',
  timeout: 1000,
  response: {
    message: 'I am a PUT method',
  },
})
