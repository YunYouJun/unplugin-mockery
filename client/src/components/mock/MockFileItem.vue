<script lang="ts" setup>
defineProps<{
  item: any
}>()

const previewStore = usePreviewStore()
</script>

<template>
  <div flex="~ col" class="gap-2 rounded p-2 text-left shadow dark:bg-dark-500">
    <div class="flex items-center justify-between">
      <div class="flex cursor-pointer items-center gap-2 text-xs" @click="previewStore.previewRawFile(item.path)">
        <div i-vscode-icons:file-type-typescript />
        <span op-80 hover:op-100>{{ item.path }}</span>
      </div>
      <div class="cursor-pointer" i-vscode-icons:file-type-vscode @click="previewStore.openFileInEditor(item.path)" />
    </div>

    <div class="flex flex-col gap-2">
      <!-- <MockMethodItem v-for="method in item.methods" :key="method" :method="method" :path="item.path" /> -->
      <MockMethodItem :method="item.methods" :path="item.path" />
    </div>
  </div>
</template>
