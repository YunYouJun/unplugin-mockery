import { expect } from 'vitest'
import { testWithMockery } from '../fixtures/test-with-mockery'

testWithMockery('HTTP Handler', async ({ mockeryContext }) => {
  await mockeryContext.useMockery({
    type: 'http',
    method: 'post',
    path: '*/user',
    response: {
      id: 'YunYouJun',
      name: '云游君',
    },
  })
  const res = await fetch('https://api.example.com/user', {
    method: 'post',
  }).then(res => res.json())
  expect(res).toEqual({
    id: 'YunYouJun',
    name: '云游君',
  })
})
