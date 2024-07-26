<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Unplugin Mockery',
  meta: [
    {
      name: 'description',
      content: 'Unplugin Mockery Client',
    },
    {
      name: 'theme-color',
      content: () => isDark.value ? 'dogerblue' : '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      // href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
      href: '/favicon.svg',
    },
  ],
})
</script>

<template>
  <RouterView />
</template>
