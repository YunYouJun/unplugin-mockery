import type { Options } from 'tsup'

export default <Options>{
  entryPoints: [
    'src/*.ts',
  ],
  clean: true,
  format: ['cjs', 'esm'],
  dts: true,
  cjsInterop: true,
  // onSuccess: 'npm run build:fix',

  shims: true,
  external: [
    // in express
    'body-parser',
    'escape-html',
  ],
}
