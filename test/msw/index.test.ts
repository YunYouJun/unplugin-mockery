import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'

const posts = [
  {
    userId: 1,
    id: 1,
    title: 'first post title',
    body: 'first post body',
  },
  // ...
]

export const restHandlers = [
  http.get('*/path/to/posts', () => {
    return HttpResponse.json(posts)
  }),
]

const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers())

// Close server after all tests
afterAll(() => server.close())

it('should return posts', async () => {
  const response = await fetch('https://rest-endpoint.example/path/to/posts')
  const data = await response.json()

  expect(response.status).toBe(200)
  expect(data).toEqual(posts)
})
