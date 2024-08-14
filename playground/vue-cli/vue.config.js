const { defineConfig } = require('@vue/cli-service')

const { getWebpackConfig } = require('unplugin-mockery/webpack')

module.exports = defineConfig(async () => {
  const { devServer } = await getWebpackConfig({
    debug: true,
    client: {
      port: 51224,
      open: true,
    },
    mockDir: '../mock',
  })

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
