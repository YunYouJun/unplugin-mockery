<script lang="ts" setup>
const { data, error, isFetching, execute } = useMockeryFetch<{
  list: any[]
}>('/mock-list').json()
</script>

<template>
  <div>
    <div v-if="isFetching">
      Loading...
    </div>
    <div v-if="data?.list">
      <MockMethodItem
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
