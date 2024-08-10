import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import type { MockeryItem, MockeryRequest } from 'unplugin-mockery'
import { Toast } from '@advjs/gui'
import { mockeryAxios } from '~/utils/axios'

export const usePreviewStore = defineStore('preview', () => {
  const curFilePath = ref('')
  const fileContent = ref('')
  const language = ref<'typescript' | 'json'>('json')

  /**
   * cur scene name
   */
  const curScene = ref<string>()
  const curMockeryRequest = ref<MockeryRequest>()

  async function previewRawFile(filePath: string) {
    language.value = 'typescript'
    curFilePath.value = filePath

    const res = await mockeryAxios.get<string>(`/raw-file?path=${filePath}`)
    fileContent.value = res.data
  }

  /**
   * preview mockery
   * 预览用户定义的 mockery
   */
  function previewMockeryItem(item: MockeryItem) {
    language.value = 'json'

    curFilePath.value = item.path
    fileContent.value = JSON.stringify(item.mockery, null, 2)
  }

  function previewMockeryRequest(mockery: MockeryRequest) {
    language.value = 'json'
    curMockeryRequest.value = mockery

    const response = mockery.response
      ? mockery.response
      : mockery.curScene
        ? mockery.results?.[mockery.curScene]
        : mockery.results
    fileContent.value = JSON.stringify(response || {}, null, 2)
  }

  /**
   * open file in vscode
   * @param filePath
   */
  function openFileInEditor(filePath: string) {
    mockeryAxios.get('/open-file', {
      params: {
        path: filePath,
      },
    })
    Toast({
      title: `打开文件`,
      description: filePath,
      type: 'success',
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
    language.value = 'json'
    curFilePath.value = params.filePath
    mockeryAxios.get('/toggle-scene', {
      params,
    })
  }

  /**
   * toggle mock result
   */
  function toggleMockResult(params: {
    url: string
    resultKey: string
  }) {
    language.value = 'json'
    mockeryAxios.get('/toggle-result', {
      params: {
        ...params,
        curScene: curScene.value,
      },
    })
  }

  return {
    curFilePath,
    curMockeryRequest,
    curScene,

    language,

    fileContent,
    previewRawFile,
    previewMockeryItem,
    previewMockeryRequest,
    previewMockScene,
    toggleMockScene,
    toggleMockResult,

    openFileInEditor,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePreviewStore as any, import.meta.hot))
