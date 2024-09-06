import { Toast } from '@advjs/gui'
import pathe from 'pathe'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { MockeryTRPCClient } from 'unplugin-mockery/client'
import { ref } from 'vue'
import type { MockeryItem, MockeryRequest } from 'unplugin-mockery'
import { mockeryAxios } from '~/utils/axios'

export const usePreviewStore = defineStore('preview', () => {
  const curFilePath = ref('')
  const curAbsoluteFilePath = computed(() => {
    return getAbsoluteFilePath(curFilePath.value)
  })

  const fileContent = ref('')
  const language = ref<'typescript' | 'json'>('json')
  const curSceneData = ref<Record<string, string>>({})
  const mockDir = ref('')

  /**
   * cur scene name
   */
  const curScene = ref<string>()
  const curMockeryRequest = ref<MockeryRequest>()

  /**
   * @deprecated
   */
  async function previewRawFile(filePath: string) {
    language.value = 'typescript'
    curFilePath.value = filePath

    const content = await MockeryTRPCClient.client.file.raw.query(filePath)
    fileContent.value = content
  }

  function getAbsoluteFilePath(filePath: string) {
    return filePath.startsWith('/') ? filePath : pathe.resolve(mockDir.value, filePath)
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

  function previewMockeryRequest(path: string, mockery: MockeryRequest, activeResultKey?: string) {
    language.value = 'json'
    curFilePath.value = getAbsoluteFilePath(path)
    curMockeryRequest.value = mockery

    const response = mockery.response
      ? mockery.response
      : mockery.results && activeResultKey && mockery.results[activeResultKey]
        ? mockery.results[activeResultKey]
        : Object.values(mockery.results || [])[0]
    fileContent.value = JSON.stringify(response || {}, null, 2)
  }

  /**
   * open file in vscode
   * @param filePath
   */
  function openFileInEditor(filePath: string) {
    const absoluteFilePath = filePath.startsWith('/') ? filePath : pathe.resolve(mockDir.value, filePath)
    MockeryTRPCClient.client.file.open.query(absoluteFilePath)
    Toast({
      title: `打开文件`,
      description: absoluteFilePath,
      type: 'success',
    })
  }

  function previewMockScene(scene: object) {
    language.value = 'json'
    fileContent.value = JSON.stringify(scene, null, 2)
  }

  /**
   * @deprecated
   */
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
    MockeryTRPCClient.client.result.toggle.mutate({
      url: params.url,
      resultKey: params.resultKey,
      curScene: curScene.value || 'default',
    }).then((res) => {
      curSceneData.value = res.sceneData
    })
  }

  return {
    curFilePath,
    curAbsoluteFilePath,
    curMockeryRequest,
    curScene,
    curSceneData,
    mockDir,

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
