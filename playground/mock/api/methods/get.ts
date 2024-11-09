import { defineMockery } from 'unplugin-mockery'

export default defineMockery({
  url: '/methods/get',
  method: 'get',
  timeout: 200,
  response: {
    message: 'I am a GET method',
  },
})
