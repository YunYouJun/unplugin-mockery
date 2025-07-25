<script setup lang="ts">
import { consola } from 'consola'
import { Pane, Splitpanes } from 'splitpanes'
import { MockeryTRPCClient } from 'unplugin-mockery/client'
import { getMockeryKey } from '../../../shared'
import 'splitpanes/dist/splitpanes.css'

defineOptions({
  name: 'IndexPage',
})

const { t } = useI18n()
const name = ref('')

const appStore = useAppStore()
const previewStore = usePreviewStore()

const router = useRouter()
function go() {
  if (name.value)
    router.push(`/hi/${encodeURIComponent(name.value)}`)
}

const displayedStatus = computed(() => {
  const curMockery = previewStore.curMockeryRequest
  const key = getMockeryKey(curMockery)
  return previewStore.curSceneData[key || ''] || ''
})

if (import.meta.env.DEV) {
  onMounted(() => {
    MockeryTRPCClient.client.ping.query().then((res) => {
      consola.info('Mockery server is running', res)
    })
  })
}

const app = useAppStore()
</script>

<template>
  <Splitpanes class="w-full" :horizontal="app.isMobile">
    <Pane class="h-full flex flex-col">
      <!-- TODO search -->
      <div class="relative flex items-center justify-center gap-2 shadow">
        <TheInput
          v-model="appStore.searchKeywords"
          :placeholder="t('intro.search-mockery')"
          autocomplete="false"
          @keydown.enter="go"
        />
        <label class="hidden" for="input">{{ t('intro.search-mockery') }}</label>

        <button
          absolute right-2 cursor-pointer text-sm
          :disabled="!name"
          @click="go"
        >
          <div
            :class="{
              'text-gray-400 dark:text-dark-400': !name,
            }" i-carbon-search
          />
        </button>
      </div>
      <MockeryList />
    </Pane>
    <Pane v-if="app.layout !== 'top'" class="flex flex-col border-l dark:border-l-dark-200">
      <div
        class="flex cursor-pointer items-center gap-2 p-1 text-xs op-80 hover:op-100"
        @click="previewStore.openFileInEditor(previewStore.curFilePath)"
      >
        <div i-vscode-icons:file-type-vscode />
        <span class="text-left" :title="previewStore.curAbsoluteFilePath">{{ previewStore.curFilePath }}</span>
        <div flex-1 />
        <span v-if="displayedStatus" class="text-blue">
          {{ displayedStatus }}
        </span>
        <span>
          <div v-if="previewStore.language === 'typescript'" i-vscode-icons:file-type-typescript />
          <div v-else-if="previewStore.language === 'json'" i-vscode-icons:file-type-json />
        </span>
      </div>
      <PreviewFile />
    </Pane>
  </Splitpanes>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
