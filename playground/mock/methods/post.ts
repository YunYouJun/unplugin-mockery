import { defineMockery } from 'unplugin-mockery'

export default defineMockery({
  url: '/methods/post',
  method: 'post',
  timeout: 500,
  response: {
    message: 'I am a POST method',
  },
})
