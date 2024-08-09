<script lang="ts" setup>
import { useMockeryFetch } from '../../composables/fetch'

const { data, error, isFetching, execute } = useMockeryFetch<{
  list: any[]
}>('/mock-list').json()

const previewStore = usePreviewStore()

const appStore = useAppStore()
const mockeryList = computed(() => {
  const list = (data.value)?.list as any[] || []
  if (!appStore.searchKeywords)
    return list
  return list.filter(item =>
    item.path.includes(appStore.searchKeywords) || item.mockery.url.includes(appStore.searchKeywords),
  )
})
</script>

<template>
  <div
    class="flex flex-grow overflow-auto bg-gray-100 p-2 dark:bg-transparent"
  >
    <div v-if="isFetching">
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
