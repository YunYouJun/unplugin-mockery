import type { HttpHandler } from 'msw'
import type { Mockery } from '../types'
import { http, HttpResponse } from 'msw'

export function getHandlerFromMockery(mockery: Mockery) {
  let handler: HttpHandler
  const resolver = mockery.resolver || (() => {
    return HttpResponse.json(mockery.response || {})
  })
  switch (mockery.type) {
    case 'http':
    default:
      handler = http[mockery.method || 'all'](mockery.path, resolver, mockery.options)
      break
  }
  return handler
}
