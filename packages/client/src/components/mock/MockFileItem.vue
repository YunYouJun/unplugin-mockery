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
        <span v-if="item.mockery.description" class="text-sm font-bold" op-90 hover:op-100>
          {{ item.mockery.description }}
        </span>
        <span
          text-xs hover:op-100
          :class="{
            'text-blue-600 dark:text-blue-200 op-100 font-medium': active,
            'op-80': !active,
          }"
        >
          {{ item.path }}
        </span>
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
