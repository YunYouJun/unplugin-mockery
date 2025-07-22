import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import UnpluginMockery from '../../src/vite'
import { mocksDir } from '../config'

export default defineConfig({
  plugins: [
    Inspect(),
    UnpluginMockery({
      dirs: [mocksDir],
    }),
  ],
})
