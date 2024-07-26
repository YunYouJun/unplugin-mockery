<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

defineOptions({
  name: 'IndexPage',
})

const { t } = useI18n()
const name = ref('')

const router = useRouter()
function go() {
  if (name.value)
    router.push(`/hi/${encodeURIComponent(name.value)}`)
}
</script>

<template>
  <Splitpanes class="w-full">
    <Pane>
      <!-- TODO search -->
      <div class="relative flex items-center justify-center gap-2 shadow">
        <TheInput
          v-model="name"
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
      <MockMethodsList />
    </Pane>
    <Pane class="border-l dark:border-l-dark-200">
      <PreviewFile />
    </Pane>
  </Splitpanes>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
