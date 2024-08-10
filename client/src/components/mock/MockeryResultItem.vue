<script lang="ts" setup>
import { usePreviewStore } from '../../stores/preview'

const props = defineProps<{
  id: string
  active: boolean
  scene: any
  url: string
  path: string
}>()

const previewStore = usePreviewStore()
function onClickScene() {
  previewStore.previewMockScene(props.scene)

  previewStore.toggleMockResult({
    url: props.url,
    resultKey: props.id,
  })
}
</script>

<template>
  <div
    text="xs"
    border="blue-500"
    class="inline-flex cursor-pointer items-center justify-center border rounded px-2 py-1 shadow"
    :class="{
      'bg-blue-500 text-white': active,
      '': !active,
    }"

    @click="onClickScene"
  >
    {{ id }}
  </div>
</template>
