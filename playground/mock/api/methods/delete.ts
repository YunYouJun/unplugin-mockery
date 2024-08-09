import { defineMockery } from 'unplugin-mockery'

export default defineMockery({
  url: '/methods/delete',
  timeout: 1500,
  method: 'delete',
  response: {
    message: 'I am a DELETE method',
  },
})
