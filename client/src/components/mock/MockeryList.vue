<script lang="ts" setup>
import type { MockeryItem } from '../../../../src/types'
import { MockeryTRPCClient } from 'unplugin-mockery/client'

const previewStore = usePreviewStore()

const appStore = useAppStore()
const fullMockeryList = ref<MockeryItem[]>([])

const isLoading = ref(false)

const mockeryList = computed(() => {
  const list = fullMockeryList.value || []
  if (!appStore.searchKeywords)
    return list
  // path/url/description
  return list.filter(item =>
    item.path.includes(appStore.searchKeywords)
    || item.mockery.url.includes(appStore.searchKeywords)
    || item.mockery.description?.includes(appStore.searchKeywords),
  )
})

const error = ref<string | null>(null)
function queryList() {
  MockeryTRPCClient.client.mockery.list.query().then((data) => {
    previewStore.mockDir = data.mockDir
    fullMockeryList.value = data.list
  }).catch((err) => {
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
    flex="~ col"
    class="flex-grow gap-2 overflow-auto bg-gray-100 p-2 dark:bg-transparent"
  >
    <div v-if="isLoading">
      Loading...
    </div>
    <template v-if="mockeryList">
      <MockFileItem
        v-for="item in mockeryList"
        :key="item.path"
        :item="item"
        :active="item.path === previewStore.curFilePath"
      />
    </template>

    <div v-if="error">
      Error: {{ error }}

      <button @click="execute()">
        Retry
      </button>
    </div>
  </div>
</template>
