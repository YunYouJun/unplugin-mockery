<!-- eslint-disable new-cap -->
<script lang="ts" setup>
import { computed, shallowRef } from 'vue'

// import type { MonacoEditor } from '@guolao/vue-monaco-editor'
import type { MonacoEditor } from '@guolao/vue-monaco-editor'
import { loader, useMonaco } from '@guolao/vue-monaco-editor'
// for monaco editor type definition

import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

import typeText from '../../../src/types?raw'
import { isDark } from '../composables/dark'

// @ts-expect-error exist
globalThis.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
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
}
const previewStore = usePreviewStore()
const theme = computed(() => {
  return isDark.value ? 'vs-dark' : 'vs'
})
const editorRef = shallowRef()

const { monacoRef } = useMonaco()

// https://stackoverflow.com/questions/43058191/how-to-use-addextralib-in-monaco-with-an-external-type-definition

function handleMount(editor: MonacoEditor['editor']) {
  editorRef.value = editor

  // monacoRef.value?.languages.typescript.typescriptDefaults.setCompilerOptions({
  //   paths: {
  //     'unplugin-mockery': ['file:///src/../../dist/index.d.ts'],
  //   },
  // })

  monacoRef.value?.languages.typescript.typescriptDefaults.addExtraLib(`
declare module 'node:http' {
  // import type { IncomingMessage, ServerResponse } from 'node:http'

  export interface IncomingMessage {
    headers: Record<string, string>
  }

  export interface ServerResponse {
    statusCode: number
  }
}

declare module 'unplugin-mockery' {
${typeText.split('\n').map(line => `  ${line}`).join('\n')}
`,
  )
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
      @mount="handleMount"
    />
  </ClientOnly>
</template>
