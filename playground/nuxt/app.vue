<script setup lang="ts">
const testApis = [
  { url: '/api/test' },
  { url: '/api/ping' },
  { url: '/api/login' },
]
</script>

<template>
  <ul>
    <li v-for="api in testApis" :key="api.url">
      <a :href="api.url" target="_blank">{{ api.url }}</a>
    </li>
  </ul>
</template>
