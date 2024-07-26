import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'
import type { UserModule } from '~/types'

// Setup Pinia
// https://pinia.vuejs.org/
export const install: UserModule = ({ isClient, app }) => {
  if (isClient) {
    app.use(VueMonacoEditorPlugin, {
      // paths: {
      //   // The recommended CDN config
      //   vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs',
      // },
    })
  }
}
