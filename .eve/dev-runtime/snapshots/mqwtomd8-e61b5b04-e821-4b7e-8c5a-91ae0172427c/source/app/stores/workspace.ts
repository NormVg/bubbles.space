import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useWorkspaceStore = defineStore('workspace', () => {
  // State
  const sidePanelOpen = ref(false)
  const expandedVoiceState = ref(false)
  
  // Actions
  function toggleSidePanel() {
    sidePanelOpen.value = !sidePanelOpen.value
    if (sidePanelOpen.value) {
      expandedVoiceState.value = false
    }
  }

  function setSidePanel(open: boolean) {
    sidePanelOpen.value = open
    if (open) {
      expandedVoiceState.value = false
    }
  }

  return {
    sidePanelOpen,
    expandedVoiceState,
    toggleSidePanel,
    setSidePanel
  }
})
