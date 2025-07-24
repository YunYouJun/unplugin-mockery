import { HttpResponse } from 'msw'
import { defineHttpMockery } from 'unplugin-mockery'

export default defineHttpMockery({
  url: '/adv/stories/:storyId',
  method: 'get',
  description: '获取故事详情',
  resolver({ params }) {
    return HttpResponse.json({
      id: params.storyId,
      title: 'Mock Story Title',
      content: 'This is a mock story content.',
    })
  },
})
