<template>
  <div class="h-screen flex flex-col">
    <TheHeader />
    <main
      class="flex flex-grow"
      text="center gray-700 dark:gray-200"
      :style="{
        height: 'calc(100vh - 3rem)',
      }"
    >
      <RouterView />
    <!-- <TheFooter /> -->
    </main>
  </div>
</template>
