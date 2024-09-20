import type { Options } from 'tsup'

export default <Options>{
  entryPoints: [
    'src/lib.ts',
  ],
  outDir: '../dist-client',
  format: ['esm'],
}
