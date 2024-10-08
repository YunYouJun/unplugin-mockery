import { createApp } from 'vue'
import App from './App.vue'

// eslint-disable-next-line node/prefer-global/process
if (process.env.NODE_ENV === 'development') {
  import('unplugin-mockery/client')
}

createApp(App).mount('#app')
