import * as monaco from 'monaco-editor'

function addExtraLibs() {
  const unpluginMockeryTypes = import.meta.glob('../../../../dist/**/*.d.ts', { eager: true, query: '?raw', import: 'default' },
  )
  const mswTypes = import.meta.glob('../../../../node_modules/msw/lib/core/**/*.d.ts', { eager: true, query: '?raw', import: 'default' },
  )
  const types = {
    ...unpluginMockeryTypes,
    ...mswTypes,
  }
  Object.entries(types).forEach(([path, content]) => {
    const filePath = `file://${path.replace('../../../../', '/')}`
    monaco.languages.typescript.typescriptDefaults.addExtraLib(content as string, filePath)
  })
}

export function initExtraLibs() {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    paths: {
      'msw': ['file:///node_modules/msw/lib/core/index.d.ts'],
      'unplugin-mockery': ['file:///dist/index.d.ts'],
    },
  })
  addExtraLibs()
}
