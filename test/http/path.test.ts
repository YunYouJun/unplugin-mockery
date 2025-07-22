import { HttpResponse } from 'msw'
import { expect } from 'vitest'
import { testWithMockery } from '../fixtures/test-with-mockery'

testWithMockery('HTTP: Path parameters', async ({ mockeryContext }) => {
  await mockeryContext.useMockery({
    type: 'http',
    method: 'get',
    path: 'https://api.example.com/posts/:id',
    resolver: async ({ params }) => {
      const id = (params as { id: string }).id
      return HttpResponse.json({
        id,
        title: `Post ${id}`,
        content: `Content for post ${id}`,
      })
    },
  })
  const res = await fetch('https://api.example.com/posts/1')
    .then(res => res.json())
  expect(res).toEqual({
    id: '1',
    title: 'Post 1',
    content: 'Content for post 1',
  })
})
