import { createFetch } from '@vueuse/core'

export const useMockeryFetch = createFetch({
  baseUrl: '/_mockery_api_',
})
