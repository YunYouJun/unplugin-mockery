<script setup lang="ts">
const { modelValue } = defineModels<{
  modelValue: string
}>()
</script>

<template>
  <input
    id="input"
    v-model="modelValue"
    v-bind="$attrs"
    type="text"
    class="flex-grow"
    p="2"
    text="leftt"
    bg="transparent"
    border="b gray-200 dark:b-dark-200"
    outline="none active:none"
  >
</template>
