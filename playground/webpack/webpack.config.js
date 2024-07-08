const path = require('node:path')

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },

  plugins: [
    require('unplugin-mocker').webpack({
      mockDir: path.resolve(__dirname, 'mock'),
    }),
  ],

  devServer: {
    port: 9000,
  },
}
