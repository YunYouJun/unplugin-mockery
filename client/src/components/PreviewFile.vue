<script lang="ts" setup>
import { computed, shallowRef } from 'vue'

// import type { MonacoEditor } from '@guolao/vue-monaco-editor'
import { isDark } from '../composables/dark'

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
const handleMount = (editor: any) => (editorRef.value = editor)

// your action
// function formatCode() {
//   editorRef.value?.getAction('editor.action.formatDocument').run()
// }
</script>

<template>
  <vue-monaco-editor
    v-model:value="previewStore.fileContent"
    :theme="theme"
    :options="MONACO_EDITOR_OPTIONS"
    :language="previewStore.language"
    @mount="handleMount"
  />
</template>
