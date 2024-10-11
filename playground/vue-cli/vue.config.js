const process = require('node:process')
const { defineConfig } = require('@vue/cli-service')
const { getWebpackConfig } = require('unplugin-mockery/webpack')

const mockeryOptions = {
  debug: true,
  client: {
    enable: true,
    port: 51223,
    open: true,
  },
  mockDir: '../mock',
}

module.exports = defineConfig(async () => {
  console.table({
    NODE_ENV: process.env.NODE_ENV,
  })

  const { devServer } = await getWebpackConfig(mockeryOptions)

  return {
    devServer: {
      // for test /api/xxx
      historyApiFallback: false,
    },

    transpileDependencies: true,

    configureWebpack: {
      devServer: {
        ...devServer,
      },
    },
  }
})
