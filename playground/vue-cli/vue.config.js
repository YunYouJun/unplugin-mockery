const { defineConfig } = require('@vue/cli-service')

const { getWebpackConfig } = require('unplugin-mockery/webpack')

module.exports = defineConfig({
  devServer: {
    // for test /api/xxx
    historyApiFallback: false,
  },

  transpileDependencies: true,

  configureWebpack: {
    devServer: {
      ...getWebpackConfig({
        debug: true,
        client: {
          port: 51223,
          open: true,
        },
        mockDir: '../mock',
      }).devServer,
    },
  },
})
