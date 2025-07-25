import { acceptHMRUpdate, defineStore } from 'pinia'
import { MockeryTRPCClient } from 'unplugin-mockery/client'
import { ref } from 'vue'

// init trpc
MockeryTRPCClient.init()

export const useAppStore = defineStore('app', () => {
  const fileContent = ref('')

  const searchKeywords = ref('')

  const { width } = useWindowSize()
  /**
   * 是否采用小屏幕布局
   */
  const isMobile = computed(() => {
    return width.value < 768
  })

  const layout = ref<'top' | 'two-columns'>('two-columns')
  function toggleLayout() {
    layout.value = layout.value === 'top' ? 'two-columns' : 'top'
  }

  return {
    fileContent,
    searchKeywords,

    isMobile,

    layout,
    toggleLayout,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore as any, import.meta.hot))
