import type { Options } from 'tsup'

export default <Options>{
  entryPoints: [
    'src/client.ts',
  ],
  outDir: '../dist',
  format: ['esm'],
}
