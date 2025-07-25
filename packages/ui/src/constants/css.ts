import type { MethodType } from 'unplugin-mockery'

export const methodInfo: Record<MethodType, {
  className: string
}> = {
  all: {
    className: 'text-cyan-500',
  },
  get: {
    className: 'text-green-500',
  },
  post: {
    className: 'text-blue-500',
  },
  put: {
    className: 'text-yellow-500',
  },
  delete: {
    className: 'text-red-500',
  },
  patch: {
    className: 'text-purple-500',
  },
  head: {
    className: 'text-gray-500',
  },
  options: {
    className: 'text-orange-500',
  },
}
