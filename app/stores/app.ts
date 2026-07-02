import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useColorMode } from '@vueuse/core'

export const useAppStore = defineStore('app', () => {
  // State
  const isAgentActive = ref(false)
  const colorMode = useColorMode()

  const location = ref<{ latitude?: number, longitude?: number, city?: string, region?: string } | null>(null)

  // Actions
  function toggleTheme() {
    colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  async function fetchLocation(forcePrompt = false) {
    if (location.value) return
    
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by your browser')
      return
    }

    // Prevent hanging the page load state with an unexpected permission prompt
    try {
      if (navigator.permissions && !forcePrompt) {
        const permission = await navigator.permissions.query({ name: 'geolocation' })
        if (permission.state === 'prompt' || permission.state === 'denied') {
          return // Abort if we would need to prompt the user
        }
      }
    } catch (e) {
      // Permissions API not supported or threw, proceed with caution
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude
      const lon = position.coords.longitude
      
      try {
        // Reverse geocode to get city/region for the LLM's context
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
        const data = await response.json()
        
        location.value = {
          latitude: lat,
          longitude: lon,
          city: data.city || data.locality || 'Unknown',
          region: data.principalSubdivision || 'Unknown'
        }
      } catch (e) {
        // Fallback to just coordinates if reverse geocoding fails
        location.value = { latitude: lat, longitude: lon, city: 'Unknown', region: 'Unknown' }
      }
    }, (error) => {
      console.warn('Geolocation error:', error.message)
    }, {
      timeout: 5000, // Fail after 5 seconds if GPS lock is stuck
      maximumAge: 300000 // Accept a 5-minute old cached location
    })
  }

  return {
    isAgentActive,
    theme: colorMode,
    location,
    toggleTheme,
    fetchLocation
  }
})
