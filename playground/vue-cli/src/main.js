import { createApp } from 'vue'
import App from './App.vue'

// eslint-disable-next-line node/prefer-global/process
if (process.env.NODE_ENV === 'development') {
  import('unplugin-mockery/client').then(({ main }) => {
    main({
      port: 51223,
    })
  })
}

createApp(App).mount('#app')
