import { defineMockery } from 'unplugin-mockery'

export default defineMockery({
  url: '/methods/all',
  method: 'all',
  response: {
    message: 'I support GET/POST/DELETE/PUT/PATCH methods.',
  },
})
