import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: [
    'src/*.ts',
  ],
  clean: true,
  format: ['cjs', 'esm'],
  dts: true,
  cjsInterop: true,
  // onSuccess: 'npm run build:fix',

  splitting: true,
  shims: true,
  external: [
    // in express
    'body-parser',
    'escape-html',
  ],
})
