<script lang="ts" setup>
defineProps<{
  active?: boolean
  item: any
}>()

const previewStore = usePreviewStore()
</script>

<template>
  <div
    flex="~ col"
    class="gap-2 rounded bg-white p-2 text-left shadow"
    :class="{
      'dark:bg-dark-300': active,
      'dark:bg-dark-500': !active,
    }"
  >
    <div class="flex items-center justify-between">
      <div
        class="flex cursor-pointer items-center gap-2 text-xs"
        @click="previewStore.previewMockeryItem(item)"
      >
        <div i-vscode-icons:file-type-typescript />
        <span op-80 hover:op-100>{{ item.path }}</span>
      </div>
      <div
        class="cursor-pointer" i-vscode-icons:file-type-vscode
        @click="previewStore.openFileInEditor(item.path)"
      />
    </div>

    <div class="flex flex-col gap-2">
      <!-- <MockMethodItem v-for="method in item.methods" :key="method" :method="method" :path="item.path" /> -->
      <MockeryItem :mockery="item.mockery" :path="item.path" />
    </div>
  </div>
</template>
