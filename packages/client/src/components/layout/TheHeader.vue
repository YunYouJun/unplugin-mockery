<script lang="ts" setup>
const app = useAppStore()

function openCurUrlInNewTab() {
  window.open(window.location.href, '_blank')
}
</script>

<template>
  <div class="h-12 items-center justify-center shadow" flex gap="2" px-4 border="b b-gray-200 dark:b-dark-200">
    <div text-xl>
      🤡
    </div>
    <div class="font-sans-serif font-medium">
      Mockery
    </div>

    <SelectScene />

    <div class="flex-1" />

    <div inline-flex gap="4">
      <a v-if="!app.isMobile" icon-btn shape="circle" variant="text" title="在新标签页打开当前页面" @click="openCurUrlInNewTab">
        <div i-ri-external-link-line />
      </a>

      <a icon-btn @click="app.toggleLayout">
        <div v-if="app.layout === 'top'" i-ri-layout-top-line />
        <template v-else>
          <div v-if="app.isMobile" i-ri-layout-row-line />
          <div v-else i-ri-layout-column-line />
        </template>
      </a>

      <SettingsDialog />

      <ToggleDark />

      <a icon-btn rel="noreferrer" href="https://github.com/YunYouJun/unplugin-mockery" target="_blank" title="GitHub">
        <div i-carbon-logo-github />
      </a>
    </div>
  </div>
</template>
