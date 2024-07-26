import { defineMockery } from 'unplugin-mockery'

export default defineMockery({
  url: '/methods/get',
  method: 'get',
  timeout: 5000,
  response: {
    message: 'I am a GET method',
  },
})
