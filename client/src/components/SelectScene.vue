<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'radix-vue'
import { mockeryAxios } from '~/utils/axios'

const selectSceneText = ref('选择场景')

const { data } = useMockeryFetch<{
  list: string[]
}>('/scene-list').json()

const previewStore = usePreviewStore()
const options = computed(() => {
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  previewStore.curScene = data.value?.curScene || 'default'
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  previewStore.curSceneData = data.value?.sceneData || {}
  return data.value?.list || []
})

watch(() => previewStore.curScene, (curScene) => {
  mockeryAxios.get('/set-scene', {
    params: { sceneName: curScene },
  }).then(({ data }) => {
    previewStore.curSceneData = data.sceneData
  })
})
</script>

<template>
  <SelectRoot v-model="previewStore.curScene">
    <SelectTrigger
      class="h-[32px] min-w-[160px] inline-flex items-center justify-between gap-[5px] rounded px-[15px] text-[13px] leading-none shadow-[0_2px_10px] shadow-black/10 outline-none data-[placeholder]:text-blue6 focus:shadow-[0_0_0_2px] focus:shadow-black"
      bg="white dark:dark hover:gray-100 hover:dark:dark-100"
      text="blue9 dark:blue1"
      aria-label="Customise options"
    >
      <SelectValue :placeholder="selectSceneText" />
      <Icon
        icon="radix-icons:chevron-down"
        class="h-3.5 w-3.5"
      />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-[100] min-w-[160px] rounded bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] dark:bg-dark"
        :side-offset="5"
      >
        <SelectScrollUpButton
          class="text-violet11 h-[25px] flex cursor-default items-center justify-center bg-white dark:bg-dark"
        >
          <Icon icon="radix-icons:chevron-up" />
        </SelectScrollUpButton>

        <SelectViewport class="p-[5px]">
          <SelectLabel class="px-[25px] text-xs leading-[25px] op-50">
            {{ selectSceneText }}
          </SelectLabel>
          <SelectGroup>
            <SelectItem
              v-for="(option, index) in options"
              :key="index"
              class="data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-blue6 data-[highlighted]:text-blue1 data-[highlighted]:outline-none"
              text="blue9 dark:blue1"
              :value="option"
            >
              <SelectItemIndicator class="absolute left-0 w-[25px] inline-flex items-center justify-center">
                <Icon icon="radix-icons:check" />
              </SelectItemIndicator>
              <SelectItemText>
                {{ option }}
              </SelectItemText>
            </SelectItem>
          </SelectGroup>
        </SelectViewport>

        <SelectScrollDownButton
          class="text-violet11 h-[25px] flex cursor-default items-center justify-center bg-white dark:bg-dark"
        >
          <Icon icon="radix-icons:chevron-down" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
