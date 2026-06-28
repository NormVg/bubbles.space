import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useColorMode } from '@vueuse/core'

export const useAppStore = defineStore('app', () => {
  // State
  const isAgentActive = ref(false)
  const colorMode = useColorMode()

  // Actions
  function toggleTheme() {
    colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  return {
    isAgentActive,
    theme: colorMode,
    toggleTheme
  }
})
