import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isSettingsOpen = ref(false)
  const isRightDrawerOpen = ref(false)
  const rightDrawerContent = ref('default') // For future dynamic component injection

  function openSettings() {
    isSettingsOpen.value = true
  }

  function closeSettings() {
    isSettingsOpen.value = false
  }

  function toggleSettings() {
    isSettingsOpen.value = !isSettingsOpen.value
  }

  function openRightDrawer(contentName = 'default') {
    rightDrawerContent.value = contentName
    isRightDrawerOpen.value = true
  }

  function closeRightDrawer() {
    isRightDrawerOpen.value = false
  }

  function toggleRightDrawer() {
    isRightDrawerOpen.value = !isRightDrawerOpen.value
  }

  const isArchiveOpen = ref(false)

  function toggleArchive() {
    isArchiveOpen.value = !isArchiveOpen.value
  }

  function closeArchive() {
    isArchiveOpen.value = false
  }

  return { 
    isSettingsOpen, openSettings, closeSettings, toggleSettings,
    isRightDrawerOpen, rightDrawerContent, openRightDrawer, closeRightDrawer, toggleRightDrawer,
    isArchiveOpen, toggleArchive, closeArchive
  }
})
