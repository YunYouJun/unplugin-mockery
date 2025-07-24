<!-- eslint-disable new-cap -->
<script lang="ts" setup>
// import type { MonacoEditor } from '@guolao/vue-monaco-editor'

import { loader } from '@guolao/vue-monaco-editor'
import * as monaco from 'monaco-editor'
// for monaco editor type definition

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import { computed } from 'vue'

// import typeText from '../../../../src/types/mockery?raw'

import { isDark } from '../composables/dark'
import { editorRef } from '../stores/editor'
import { initExtraLibs } from '../utils/monaco-editor'

// @ts-expect-error exist
globalThis.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json') {
      return new jsonWorker()
    }
    // use vscode directly
    // if (label === 'css' || label === 'scss' || label === 'less') {
    //   return new cssWorker()
    // }
    // if (label === 'html' || label === 'handlebars' || label === 'razor') {
    //   return new htmlWorker()
    // }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  },
}

loader.config({ monaco })

// : MonacoEditor['editor']['EditorOptions']
const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  wordWrap: 'on',
  fixedOverflowWidgets: true,
  readOnly: true,
}
const previewStore = usePreviewStore()
const theme = computed(() => {
  return isDark.value ? 'vs-dark' : 'vs'
})

// https://stackoverflow.com/questions/43058191/how-to-use-addextralib-in-monaco-with-an-external-type-definition

async function handleMount(editor: monaco.editor.IStandaloneCodeEditor) {
  editorRef.value = editor

  initExtraLibs()

  // monacoRef.value?.languages.typescript.typescriptDefaults.setCompilerOptions({
  //   paths: {
  //     'unplugin-mockery': ['file:///src/../../dist/index.d.ts'],
  //   },
  // })

  // add msw
  // monacoRef.value?.languages.typescript.typescriptDefaults.addExtraLib(dts, 'file:///node_modules/msw/index.d.ts')
  // monacoRef.value?.languages.typescript.typescriptDefaults.addExtraLib(unpluginMockeryDts, 'file:///node_modules/unplugin-mockery/index.d.ts')
}

// your action
// function formatCode() {
//   editorRef.value?.getAction('editor.action.formatDocument').run()
// }
</script>

<template>
  <ClientOnly>
    <vue-monaco-editor
      v-model:value="previewStore.fileContent"
      :theme="theme"
      :options="MONACO_EDITOR_OPTIONS"
      :language="previewStore.language"
      :path="previewStore.curFilePath"
      @mount="handleMount"
    />
  </ClientOnly>
</template>
