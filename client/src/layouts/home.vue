<template>
  <div class="h-full flex flex-col">
    <TheHeader />
    <main
      class="flex flex-grow"
      text="center gray-700 dark:gray-200"
    >
      <RouterView />
    <!-- <TheFooter /> -->
    </main>
  </div>
</template>
