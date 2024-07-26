import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import type { MockeryRequest } from 'unplugin-mockery'
import { mockeryAxios } from '~/utils/axios'

export const usePreviewStore = defineStore('preview', () => {
  const curFilePath = ref('')
  const fileContent = ref('')
  const language = ref<'typescript' | 'json'>('typescript')

  const curMockeryRequest = ref<MockeryRequest>()

  async function previewRawFile(filePath: string) {
    curFilePath.value = filePath

    if (filePath.endsWith('.ts'))
      language.value = 'typescript'

    const res = await mockeryAxios.get<string>(`/raw-file?path=${filePath}`)
    fileContent.value = res.data
  }

  function previewMockMethod(mockery: MockeryRequest) {
    curMockeryRequest.value = mockery

    language.value = 'json'

    const response = mockery.response
      ? mockery.response
      : mockery.curScene
        ? mockery.scenes?.[mockery.curScene]
        : mockery.scenes
    fileContent.value = JSON.stringify(response, null, 2)
  }

  function openFileInEditor(filePath: string) {
    mockeryAxios.get('/open-file', {
      params: {
        path: filePath,
      },
    })
  }

  function previewMockScene(scene: object) {
    language.value = 'json'
    fileContent.value = JSON.stringify(scene, null, 2)
  }

  function toggleMockScene(params: {
    filePath: string
    sceneName: string
    url: string
  }) {
    curFilePath.value = params.filePath
    mockeryAxios.get('/toggle-scene', {
      params,
    })
  }

  return {
    curFilePath,
    curMockeryRequest,

    language,

    fileContent,
    previewRawFile,
    previewMockMethod,
    previewMockScene,
    toggleMockScene,

    openFileInEditor,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePreviewStore as any, import.meta.hot))
