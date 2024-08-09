<script setup lang="ts">
const model = defineModel<string>({
  required: true,
  default: '',
})
</script>

<template>
  <input
    id="input"
    v-model="model"
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
