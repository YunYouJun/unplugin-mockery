<script lang="ts" setup>
import { MockeryTRPCClient } from 'unplugin-mockery/client'
import type { MockeryItem } from '../../../../src/types'

const previewStore = usePreviewStore()

const appStore = useAppStore()
const fullMockeryList = ref<MockeryItem[]>([])

const isLoading = ref(false)

const mockeryList = computed(() => {
  const list = fullMockeryList.value || []
  if (!appStore.searchKeywords)
    return list
  return list.filter(item =>
    item.path.includes(appStore.searchKeywords) || item.mockery.url.includes(appStore.searchKeywords),
  )
})

const error = ref<string | null>(null)
function queryList() {
  MockeryTRPCClient.client.mockery.list.query()
    .then((data) => {
      previewStore.mockDir = data.mockDir
      fullMockeryList.value = data.list
    })
    .catch((err) => {
      error.value = err.message
    })
}

onBeforeMount(() => {
  queryList()
})

function execute() {
  error.value = null
  queryList()
}
</script>

<template>
  <div
    class="flex flex-grow overflow-auto bg-gray-100 p-2 dark:bg-transparent"
  >
    <div v-if="isLoading">
      Loading...
    </div>
    <div v-if="mockeryList" class="w-full flex flex-col gap-2">
      <MockFileItem
        v-for="item in mockeryList"
        :key="item.path"
        :item="item"
        :active="item.path === previewStore.curFilePath"
      />
    </div>

    <div v-if="error">
      Error: {{ error }}

      <button @click="execute()">
        Retry
      </button>
    </div>
  </div>
</template>
