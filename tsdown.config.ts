import { defineConfig } from 'tsdown'
import pkg from './package.json'
import clientPkg from './packages/client/package.json'

export default defineConfig({
  entry: ['src/*.ts'],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(clientPkg.dependencies || {}),

    // only webpack need
    'html-webpack-plugin',
  ],
})
