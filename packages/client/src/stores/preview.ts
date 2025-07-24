import type { Mockery, MockeryItem } from 'unplugin-mockery'
import { useStorage } from '@vueuse/core'
// import { Toast } from '@advjs/gui'
import pathe from 'pathe'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { MockeryTRPCClient } from 'unplugin-mockery/client'
import { ref } from 'vue'
import { mockeryAxios } from '~/utils/axios'
import { editorRef } from './editor'

export const usePreviewStore = defineStore('preview', () => {
  const curFilePath = useStorage('curFilePath', '')
  const curAbsoluteFilePath = computed(() => {
    return getAbsoluteFilePath(curFilePath.value)
  })

  const fileContent = useStorage('fileContent', '')
  const language = useStorage<'typescript' | 'json'>('language', 'json')
  const curSceneData = ref<Record<string, string>>({})
  const projectRoot = ref('')

  /**
   * cur scene name
   */
  const curScene = useStorage('curScene', '')
  const curMockeryRequest = useStorage<Mockery>('curMockeryRequest', {
    // url: '',
    type: 'http',
    path: '',
  })

  async function previewRawFile(filePath: string) {
    language.value = 'typescript'
    curFilePath.value = filePath

    const content = await MockeryTRPCClient.client.file.raw.query(filePath)
    fileContent.value = content
  }

  function getAbsoluteFilePath(filePath: string) {
    return filePath.startsWith('/') ? filePath : pathe.resolve(projectRoot.value, filePath)
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

  async function previewMockeryRequest(path: string, mockery: Mockery) {
    language.value = 'json'
    curFilePath.value = getAbsoluteFilePath(path)
    curMockeryRequest.value = mockery

    let response = mockery.response
      ? mockery.response
      : null

    // fetch real response data
    if (!response) {
      response = await MockeryTRPCClient.client.mockery.request.query({
        filePath: getAbsoluteFilePath(path),
      }) || {}
    }

    if (typeof response === 'string') {
      language.value = 'typescript'
      fileContent.value = response
    }
    else {
      fileContent.value = JSON.stringify(response || {}, null, 2)
    }
  }

  /**
   * open file in vscode
   * @param filePath
   */
  function openFileInEditor(filePath: string) {
    const absoluteFilePath = filePath.startsWith('/') ? filePath : pathe.resolve(projectRoot.value, filePath)
    MockeryTRPCClient.client.file.open.query(absoluteFilePath)
    // Toast({
    //   title: `打开文件`,
    //   description: absoluteFilePath,
    //   type: 'success',
    // })
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
  async function toggleMockResult(params: {
    type: 'http'
    path: string
    status: string
  }) {
    const sceneName = curScene.value || 'default'
    curSceneData.value = (await MockeryTRPCClient.client.result.toggle.mutate({
      ...params,
      type: 'http',
      curScene: sceneName,
    })).sceneData || {}
  }

  function previewMockeryResult(result: object | string) {
    const resultType = typeof result
    switch (resultType) {
      case 'object':
        language.value = 'json'
        fileContent.value = JSON.stringify(result, null, 2)
        break
      case 'string':
      default:
        language.value = 'typescript'
        fileContent.value = result.toString()
        break
    }
    editorRef.value?.getAction('editor.action.formatDocument')?.run()
  }

  return {
    curFilePath,
    curAbsoluteFilePath,
    curMockeryRequest,
    curScene,
    curSceneData,
    projectRoot,

    language,

    fileContent,
    previewRawFile,
    previewMockeryItem,
    previewMockeryRequest,
    previewMockeryResult,
    previewMockScene,
    toggleMockScene,
    toggleMockResult,

    openFileInEditor,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePreviewStore as any, import.meta.hot))
