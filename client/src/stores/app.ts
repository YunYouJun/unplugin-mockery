import { acceptHMRUpdate, defineStore } from 'pinia'
import { MockeryTRPCClient } from 'unplugin-mockery/client'
import { ref } from 'vue'

// init trpc
MockeryTRPCClient.init()

export const useAppStore = defineStore('app', () => {
  const fileContent = ref('')

  const searchKeywords = ref('')

  return {
    fileContent,
    searchKeywords,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore as any, import.meta.hot))
