<script setup lang="ts">
import axios from 'axios'

async function fetchData() {
  try {
    const response = await axios.get('/adv/stories/xxx')
    // eslint-disable-next-line no-console
    console.log(response.data)
  }
  catch (error) {
    console.error('Error fetching data:', error)
  }
}
</script>

<template>
  <div>
    <button @click="fetchData">
      FETCH
    </button>
  </div>
</template>
