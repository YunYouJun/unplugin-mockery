import { defineHttpMockery } from 'unplugin-mockery'

export default defineHttpMockery({
  path: '/methods/all',
  method: 'all',
  response: {
    message: 'I support GET/POST/DELETE/PUT/PATCH methods.',
  },
})
