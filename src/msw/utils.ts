import type { HttpHandler } from 'msw'
import type { Mockery } from '../types'
import { http, HttpResponse } from 'msw'

export function getHandlerFromMockery(mockery: Mockery) {
  let handler: HttpHandler
  let resolver = mockery.resolver || (() => HttpResponse.json(mockery.response || {}))

  if (mockery.statusMap && Object.keys(mockery.statusMap).length > 0) {
    const status = mockery._curStatus || Object.keys(mockery.statusMap)[0]
    resolver = mockery.statusMap[status]?.resolver || resolver
  }

  switch (mockery.type) {
    case 'http':
    default:{
      const path = mockery.path
        ? mockery.path
        : mockery.url
          ? mockery.url.toString().startsWith('*')
            ? mockery.url.toString()
            : `*${mockery.url.toString()}`
          : '*'
      handler = http[mockery.method || 'all'](path, resolver, mockery.options)
      break
    }
  }
  return handler
}
