<script lang="ts" setup>
import type { MethodType, Mockery, StatusItem } from 'unplugin-mockery'
import { getMockeryKey } from '../../../../shared'
import { methodInfo } from '../../constants/css'

const props = defineProps<{
  mockery: Mockery
  path: string
}>()

const previewStore = usePreviewStore()

function isActive(key: string) {
  const mockeryKey = getMockeryKey(props.mockery)
  return previewStore.curSceneData[mockeryKey] === key
}

function getMethodClass(method: MethodType) {
  const className = methodInfo[method].className || 'text-gray-500'
  return className
}

function getTimeoutClass(timeout: number = 0) {
  if (timeout > 3000)
    return 'text-red-500'
  if (timeout > 1000 && timeout <= 3000)
    return 'text-yellow-500'
  return 'text-green-500'
}

const httpMethod = computed(() => props.mockery.method || 'get')

function toggleStatusItem(params: {
  key: string
  statusItem: StatusItem
}) {
  const { key, statusItem } = params
  const mockery = props.mockery

  previewStore.curFilePath = props.path

  previewStore.previewMockeryResult(statusItem.resolver.toString())
  switch (mockery.type) {
    case 'http':
    default:
      previewStore.toggleMockResult({
        type: mockery.type,
        path: mockery.path?.toString() || mockery.url?.toString() || '',
        status: key,
      })
      break
  }
}
</script>

<template>
  <div class="flex flex-col gap-2 pl-4">
    <div class="flex items-center gap-2 text-sm">
      <div i-ri-link />
      <span class="w-28 inline-flex items-center justify-between text-sm">
        <span
          class="cursor-pointer font-bold uppercase"
          :class="getMethodClass(httpMethod)"
          @click="previewStore.previewMockeryItem({ path, mockery })"
        >{{ httpMethod }}</span>
        <span
          class="text-right"
          :class="getTimeoutClass(mockery.timeout)"
        >
          {{ mockery.timeout || 0 }}ms
        </span>
      </span>
      <span
        class="text-blue dark:text-blue-300" ml-2 cursor-pointer op-90 hover:op-100
        @click="previewStore.previewMockeryRequest(path, mockery)"
      >
        {{ mockery.path || mockery.url }}
      </span>
    </div>

    <div v-if="mockery.statusMap" class="mock-scene-container gap-2 pl-6" flex="~ wrap">
      <MockeryResultItem
        v-for="(statusItem, key) in mockery.statusMap"
        :id="key"
        :key="key"
        :active="isActive(key)"
        :item="statusItem"
        @click="toggleStatusItem({
          key,
          statusItem,
        })"
      />
    </div>
  </div>
</template>
