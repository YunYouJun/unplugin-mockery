import { HttpResponse } from 'msw'
import { defineHttpMockery } from 'unplugin-mockery'

const successResponse = {
  code: 0,
  message: 'Login success',
  data: {
    name: 'YunYouJun',
  },
}

export default defineHttpMockery({
  url: '/api/login',
  description: '登录接口',
  method: 'post',
  statusMap: {
    '登录成功': {
      resolver() {
        return HttpResponse.json(successResponse)
      },
    },
    '登录失败-密码错误': {
      description: '登陆失败的相关描述',
      resolver() {
        return HttpResponse.json({
          code: -1,
          message: '密码错误',
        })
      },
    },
    '登录失败-账号不存在': {
      async resolver({ params }) {
        const code = -1 * 2
        return HttpResponse.json({
          code,
          message: '账号不存在',
          params,
        })
      },
    },
  },
})
