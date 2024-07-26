import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import type { MockMethod } from '../../../src/types'

export const usePreviewStore = defineStore('preview', () => {
  const curFilePath = ref('')
  const fileContent = ref('')
  const language = ref<'typescript' | 'json'>('typescript')

  const curMockMethod = ref<MockMethod>({
    url: '',
    method: 'get',
    response: {
      status: 200,
      body: '',
    },
  })

  async function previewRawFile(filePath: string) {
    curFilePath.value = filePath

    if (filePath.endsWith('.ts'))
      language.value = 'typescript'

    const res = await fetch(filePath)
    fileContent.value = await res.text()
  }

  function previewMockMethod(mockMethod: MockMethod) {
    curMockMethod.value = mockMethod

    language.value = 'json'
    fileContent.value = JSON.stringify(mockMethod, null, 2)
  }

  return {
    curFilePath,
    curMockMethod,

    language,

    fileContent,
    previewRawFile,
    previewMockMethod,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePreviewStore as any, import.meta.hot))
