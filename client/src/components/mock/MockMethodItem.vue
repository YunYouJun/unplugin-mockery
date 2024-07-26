<script lang="ts" setup>
import type { MockMethod } from 'unplugin-mockery'

const props = defineProps<{
  method: MockMethod
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

const httpMethod = computed(() => props.method.method || 'get')

onMounted(() => {
  if (props.method.scenes) {
    const keys = Object.keys(props.method.scenes)
    if (keys.length) {
      activeScene.value = keys[0]
    }
  }
})
</script>

<template>
  <div class="flex flex-col gap-2 pl-4">
    <div class="flex items-center gap-2 text-sm">
      <div i-ri-link />
      <span class="w-28 inline-flex items-center justify-between">
        <span class="font-bold uppercase" :class="getMethodClass(httpMethod)">{{ httpMethod }}</span>
        <span
          class="text-right text-xs"
          :class="getTimeoutClass(method.timeout)"
        >
          {{ method.timeout || 0 }}ms
        </span>
      </span>
      <span class="text-blue" ml-2 cursor-pointer text-xs op-80 hover:op-100 @click="previewStore.previewMockMethod(method)">
        {{ method.url }}
      </span>
    </div>

    <div v-if="method.scenes" class="mock-scene-container gap-2 pl-6" flex="~ wrap">
      <MockSceneItem
        v-for="(scene, key) in method.scenes"
        :id="key"
        :key="key"
        :url="method.url"
        :scene="scene"
        :path="path"
        :active="activeScene === key"
        @click="activeScene = key"
      />
    </div>
  </div>
</template>
