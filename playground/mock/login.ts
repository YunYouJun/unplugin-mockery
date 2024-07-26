import { defineMockery } from 'unplugin-mockery'

const successResponse = {
  code: 0,
  message: 'Login success',
  data: {
    name: 'YunYouJun',
  },
}

/**
 * multiple scenes
 */
const scenes = {
  '登录成功': successResponse,
  '登录失败-密码错误': {
    code: -1,
    message: '密码错误',
  },
  '登录失败-账号不存在': () => {
    const code = -1 * 2
    return {
      code,
      message: '账号不存在',
    }
  },
}

export default defineMockery({
  url: '/api/login',
  method: 'post',

  curScene: '登录成功',
  scenes,
})
