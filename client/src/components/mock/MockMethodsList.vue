<script lang="ts" setup>
import { useFetch } from '@vueuse/core'

const { data, error, isFetching, execute } = useFetch('/mock-list')
</script>

<template>
  <div>
    {{ data }}

    <div v-if="isFetching">
      Loading...
    </div>

    <div v-if="error">
      Error: {{ error }}

      <button @click="execute()">
        Retry
      </button>
    </div>
  </div>
</template>
