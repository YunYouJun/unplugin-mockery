<script lang="ts" setup>
import { useMockeryFetch } from '../../composables/fetch'

const { data, error, isFetching, execute } = useMockeryFetch<{
  list: any[]
}>('/mock-list').json()
</script>

<template>
  <div class="flex flex-grow overflow-auto">
    <div v-if="isFetching">
      Loading...
    </div>
    <div v-if="data?.list" class="w-full flex flex-col gap-2 p-2">
      <MockFileItem
        v-for="item in data.list"
        :key="item.path"
        :item="item"
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
