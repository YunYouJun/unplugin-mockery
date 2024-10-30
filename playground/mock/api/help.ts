import { defineMockery } from 'unplugin-mockery'

export default defineMockery({
  url: '/api/help',
  description: '帮助',
  method: 'get',
  response: {
    code: 0,
    message: 'SOS',
  },
})
