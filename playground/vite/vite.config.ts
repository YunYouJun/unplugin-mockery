import path from 'node:path'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import UnpluginMockery from '../../src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    UnpluginMockery({
      mockDir: path.resolve(__dirname, '../mock'),
    }),
  ],
})
