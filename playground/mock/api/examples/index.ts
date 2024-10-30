import { defineMockery } from 'unplugin-mockery'

export default defineMockery({
  url: '/api/examples',
  description: '示例',
  method: 'get',
  response: {
    code: 0,
    message: 'EXAMPLES',
  },
})
