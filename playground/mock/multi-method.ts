import type { MockMethod } from 'unplugin-mockery'

export default [
  {
    url: '/methods/get',
    method: 'get',
    timeout: 5000,
    response: {
      message: 'I am a GET method',
    },
  },
  {
    url: '/methods/post',
    method: 'post',
    timeout: 500,
    response: {
      message: 'I am a POST method',
    },
  },
  {
    url: '/methods/put',
    method: 'put',
    timeout: 1000,
    response: {
      message: 'I am a PUT method',
    },
  },
  {
    url: '/methods/delete',
    timeout: 1500,
    method: 'delete',
    response: {
      message: 'I am a DELETE method',
    },
  },
  {
    url: '/methods/patch',
    method: 'patch',
    timeout: 2000,
    response: {
      message: 'I am a PATCH method',
    },
  },
] as MockMethod[]
