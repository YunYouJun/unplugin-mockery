import { defineMockMethod } from 'unplugin-mockery'

const successResponse = {
  code: 0,
  message: 'success',
  data: {
    name: 'pong',
  },
}

const scenes = {
  '登录成功': successResponse,
  '登录失败-账号不存在': {
    code: -1,
    message: 'fail',
  },
  '登录失败-密码错误': {
    code: -2,
    message: 'fail',
  },
}

export default defineMockMethod({
  url: '/api/login',
  method: 'post',
  curScene: '',
  scenes,
  response: scenes['登录成功'],
})
