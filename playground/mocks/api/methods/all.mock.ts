import { defineHttpMockery } from 'unplugin-mockery'

export default defineHttpMockery({
  url: '/methods/all',
  method: 'all',
  response: {
    message: 'I support GET/POST/DELETE/PUT/PATCH methods.',
  },
})
