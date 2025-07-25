import type monaco from 'monaco-editor'
import type { Nullable } from 'unplugin'
import type { Ref } from 'vue'

function addExtraLibs(monacoRef: Ref<Nullable<typeof monaco>>) {
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
    monacoRef.value?.languages.typescript.typescriptDefaults.addExtraLib(content as string, filePath)
  })
}

export function initExtraLibs(monacoRef: Ref<Nullable<typeof monaco>>) {
  monacoRef.value?.languages.typescript.typescriptDefaults.setCompilerOptions({
    paths: {
      'msw': ['file:///node_modules/msw/lib/core/index.d.ts'],
      'unplugin-mockery': ['file:///dist/index.d.ts'],
    },
  })
  addExtraLibs(monacoRef)
}
