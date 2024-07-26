import { defineMockery } from 'unplugin-mockery'

const successResponse = {
  code: 0,
  message: 'success',
  data: {
    name: 'pong',
  },
}

const scenes = {
  '登录成功': successResponse,
  '登录失败-账号不存在': () => {
    return {
      code: -1,
      message: 'fail',
    }
  },
  '登录失败-密码错误': {
    code: -2,
    message: 'fail',
  },
}

export default defineMockery({
  url: '/api/login',
  method: 'post',

  curScene: '登录成功',
  scenes,
})
