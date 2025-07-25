import { defineConfig } from 'tsdown'
import pkg from './package.json'
import uiPkg from './packages/ui/package.json'

export default defineConfig({
  entry: ['src/*.ts'],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(uiPkg.dependencies || {}),

    // only webpack need
    'html-webpack-plugin',
  ],
})
