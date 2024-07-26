<script lang="ts" setup>
defineProps<{
  item: any
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
</script>

<template>
  <div flex="~ col" class="m-2 gap-2 rounded p-2 text-left shadow dark:bg-dark-500">
    <div class="flex cursor-pointer items-center gap-2 text-xs" @click="previewStore.previewRawFile(item.path)">
      <div i-vscode-icons:file-type-typescript />
      <span op-80 hover:op-100>{{ item.path }}</span>
    </div>
    <div class="flex flex-col gap-1">
      <div v-for="method in item.methods" :key="method" class="pl-4">
        <div class="flex items-center gap-2 text-sm">
          <div i-ri-link />
          <span class="w-28 inline-flex items-center justify-between">
            <span class="font-bold uppercase" :class="getMethodClass(method.method)">{{ method.method }}</span>
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
      </div>
    </div>
  </div>
</template>
