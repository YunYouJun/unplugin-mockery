<script lang="ts" setup>
import type { StatusItem } from 'unplugin-mockery'

defineProps<{
  id: string
  active: boolean
  item: StatusItem
}>()
</script>

<template>
  <button
    text="xs"
    border="blue-500"
    class="inline-flex cursor-pointer items-center justify-center border rounded px-2 py-1 shadow"
    :class="{
      'bg-blue-500 text-white': active,
      '': !active,
    }"
    :title="item.description"
  >
    {{ id }}
  </button>
</template>
