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

  async function fetchLocation() {
    if (location.value) return
    
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by your browser')
      return
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
