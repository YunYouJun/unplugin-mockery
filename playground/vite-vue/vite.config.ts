import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import Mockery from 'unplugin-mockery/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Mockery({
      dirs: [
        path.resolve(import.meta.dirname, '../mocks'),
      ],
    }),
  ],
})
