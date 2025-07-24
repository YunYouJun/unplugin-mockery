<script lang="ts" setup>
import path from 'pathe'

defineProps<{
  active?: boolean
  item: any
}>()

const previewStore = usePreviewStore()

function getRelativePath(filePath: string) {
  return path.relative(previewStore.projectRoot, filePath)
}
</script>

<template>
  <div
    flex="~ col" class="gap-2 rounded bg-white p-2 text-left shadow" :class="{
      'dark:bg-dark-300': active,
      'dark:bg-dark-500': !active,
    }"
  >
    <div class="w-full flex items-center justify-between gap-2">
      <div
        class="min-w-0 flex flex-1 flex-col cursor-pointer items-start justify-center gap-2 text-xs"
        @click="previewStore.previewRawFile(item.path)"
      >
        <div class="max-w-100% flex items-center gap-2">
          <div
            class="cursor-pointer" i-vscode-icons:file-type-vscode
            @click="previewStore.openFileInEditor(item.path)"
          />

          <span
            class="flex-1 truncate whitespace-normal text-xs hover:op-100" :class="{
              'text-blue-600 dark:text-blue-200 op-100': active,
              'op-80': !active,
            }"

            :title="item.path"
          >
            {{ getRelativePath(item.path) }}
          </span>
        </div>

        <div v-if="item.mockery.description" class="ml-4 text-xs font-bold" op-90 hover:op-100>
          {{ item.mockery.description }}
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <!-- <MockMethodItem v-for="method in item.methods" :key="method" :method="method" :path="item.path" /> -->
      <MockeryItem :mockery="item.mockery" :path="item.path" />
    </div>
  </div>
</template>
