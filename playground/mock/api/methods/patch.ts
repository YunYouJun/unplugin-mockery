import { defineMockery } from 'unplugin-mockery'

export default defineMockery({
  url: '/methods/patch',
  method: 'patch',
  timeout: 2000,
  response: {
    message: 'I am a PATCH method',
  },
})
