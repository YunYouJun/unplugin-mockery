<script lang="ts" setup>
import type { MockeryRequest } from 'unplugin-mockery'
import { mockeryAxios } from '~/utils/axios'

const props = defineProps<{
  mockery: MockeryRequest
  path: string
}>()

const previewStore = usePreviewStore()

function getMethodClass(method: string) {
  switch (method) {
    case 'get':
      return 'text-green-500'
    case 'post':
      return 'text-blue-500'
    case 'put':
      return 'text-yellow-500'
    case 'delete':
      return 'text-red-500'
    case 'patch':
      return 'text-purple-500'
    default:
      return 'text-gray-500'
  }
}

function getTimeoutClass(timeout: number = 0) {
  if (timeout > 3000)
    return 'text-red-500'
  if (timeout > 1000 && timeout <= 3000)
    return 'text-yellow-500'
  return 'text-green-500'
}

const activeScene = ref<string | null>(null)

const httpMethod = computed(() => props.mockery.method || 'get')

function toggleActiveScene(scene: string) {
  activeScene.value = scene

  if (previewStore.curMockeryRequest)
    previewStore.curMockeryRequest.curScene = scene
}

onMounted(() => {
  mockeryAxios.get('/active-scene', {
    params: {
      filePath: props.path,
      url: props.mockery.url,
    },
  }).then((res) => {
    if (res.data.scene) {
      activeScene.value = res.data.scene
    }
  })
})
</script>

<template>
  <div class="flex flex-col gap-2 pl-4">
    <div class="flex items-center gap-2 text-sm">
      <div i-ri-link />
      <span class="w-28 inline-flex items-center justify-between text-sm">
        <span class="font-bold uppercase" :class="getMethodClass(httpMethod)">{{ httpMethod }}</span>
        <span
          class="text-right"
          :class="getTimeoutClass(mockery.timeout)"
        >
          {{ mockery.timeout || 0 }}ms
        </span>
      </span>
      <span
        class="text-blue dark:text-blue-300" ml-2 cursor-pointer op-90 hover:op-100
        @click="previewStore.previewMockeryRequest(mockery)"
      >
        {{ mockery.url }}
      </span>
    </div>

    <div v-if="mockery.scenes" class="mock-scene-container gap-2 pl-6" flex="~ wrap">
      <MockSceneItem
        v-for="(scene, key) in mockery.scenes"
        :id="key"
        :key="key"
        :url="mockery.url"
        :scene="scene"
        :path="path"
        :active="activeScene === key"
        @click="toggleActiveScene(key)"
      />
    </div>
  </div>
</template>
