import type { Options } from 'tsup'

export default <Options>{
  entryPoints: [
    'src/client.ts',
  ],
  outDir: '.',
  format: ['esm'],
}
