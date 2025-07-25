import type { HttpHandler } from 'msw'
import type { Mockery } from '../types'
import { http, HttpResponse } from 'msw'
import { getMockeryKey } from '../../packages/shared'
import { GLOBAL_STATE } from '../core'

/**
 * get msw handler from mockery
 * @param mockery ge
 */
export function getHandlerFromMockery(mockery: Mockery) {
  let handler: HttpHandler
  let resolver = mockery.resolver || (() => HttpResponse.json(mockery.response || {}))

  if (mockery.statusMap && Object.keys(mockery.statusMap).length > 0) {
    const DB = GLOBAL_STATE.mockeryCtx?.db
    const mockeryKey = getMockeryKey(mockery)
    // cur status in custom scene
    const curStatusInScene = mockery._curStatus || DB?.curSceneDB?.data[mockeryKey]
    const status = curStatusInScene || mockery.defaultStatus || Object.keys(mockery.statusMap)[0]
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
