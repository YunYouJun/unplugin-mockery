<script setup lang="ts">
import { Icon } from '@iconify/vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'

const previewStore = usePreviewStore()
</script>

<template>
  <DialogRoot>
    <DialogTrigger as-child>
      <a icon-btn>
        <div i-ri-settings-2-line />
      </a>
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay class="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-30" />
      <DialogContent
        class="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-[100] max-h-[85vh] max-w-[600px] w-[90vw] translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px] shadow-lg dark:bg-dark-300 focus:outline-none"
      >
        <DialogTitle class="text-mauve12 m-0 text-[17px] font-semibold">
          Mockery Settings
        </DialogTitle>
        <DialogDescription class="mb-5 mt-3 flex gap-2 text-xs">
          <span class="font-bold">Root:</span>
          <span class="truncate op-80">{{ previewStore.projectRoot }}</span>
        </DialogDescription>

        <DialogClose
          class="text-grass11 absolute right-[10px] top-[10px] h-[25px] w-[25px] inline-flex appearance-none items-center justify-center rounded-full hover:bg-dark focus:shadow-[0_0_0_2px] focus:outline-none"
          aria-label="Close"
        >
          <Icon icon="lucide:x" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
