<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps<{
  data: {
    url?: string
  }
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', data: any): void
}>()

const currentUrl = ref(props.data.url || '')
const editQuery = ref(props.data.url || '')
const isSearching = ref(false)
const searchResults = ref<any[]>([])
const searchError = ref('')

// Detect if URL is YouTube
const isYouTube = computed(() => {
  if (!currentUrl.value) return false
  return currentUrl.value.includes('youtube.com') || currentUrl.value.includes('youtu.be')
})

// Convert normal YouTube URL to embed URL (handles video, playlist, etc)
const embedUrl = computed(() => {
  if (!isYouTube.value || !currentUrl.value) return ''
  try {
    const urlObj = new URL(currentUrl.value.startsWith('http') ? currentUrl.value : `https://${currentUrl.value}`)
    
    // Handle playlists
    if (urlObj.searchParams.has('list')) {
      return `https://www.youtube.com/embed/videoseries?list=${urlObj.searchParams.get('list')}`
    }

    // Handle normal videos
    let videoId = ''
    if (currentUrl.value.includes('youtu.be/')) {
      videoId = currentUrl.value.split('youtu.be/')[1].split('?')[0]
    } else if (currentUrl.value.includes('youtube.com/watch')) {
      videoId = urlObj.searchParams.get('v') || ''
    } else if (currentUrl.value.includes('youtube.com/embed/')) {
      return currentUrl.value // Already an embed URL
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`
    }
  } catch (e) {
    console.error('Invalid YouTube URL', e)
  }
  return currentUrl.value
})

const handleSearch = async () => {
  const query = editQuery.value.trim()
  if (!query) return

  // If it's a direct URL, just save it
  if (query.startsWith('http://') || query.startsWith('https://')) {
    currentUrl.value = query
    emit('save', { ...props.data, url: query })
    return
  }

  // Otherwise, search YouTube
  isSearching.value = true
  searchError.value = ''
  try {
    const res = await $fetch(`/api/youtube/search`, {
      query: { q: query, limit: 5 }
    })
    searchResults.value = res.data || []
    if (searchResults.value.length === 0) {
      searchError.value = 'No results found.'
    }
  } catch (e: any) {
    searchError.value = e.message || 'Search failed.'
  } finally {
    isSearching.value = false
  }
}

const selectResult = (result: any) => {
  currentUrl.value = result.url
  emit('save', { ...props.data, url: result.url })
}

watch(() => props.isEditing, (editing) => {
  if (editing) {
    editQuery.value = currentUrl.value
    searchResults.value = []
    searchError.value = ''
  } else {
    // If not searching, and editQuery is a URL, save it
    if (editQuery.value.startsWith('http') && editQuery.value !== currentUrl.value) {
      currentUrl.value = editQuery.value.trim()
      emit('save', { ...props.data, url: currentUrl.value })
    }
  }
})
</script>

<template>
  <div class="video-widget">
    <div v-if="isEditing" class="edit-mode">
      <div class="edit-header">
        <LucideVideo :size="16" class="yt-icon" />
        <span>YouTube & Video Embed</span>
      </div>
      
      <div class="search-container">
        <input 
          v-model="editQuery" 
          type="text" 
          placeholder="Paste URL or search YouTube..."
          class="url-input"
          @keydown.enter.stop="handleSearch"
        />
        <button class="search-btn" @click.stop="handleSearch" :disabled="isSearching || !editQuery">
          <LucideSearch v-if="!isSearching" :size="14" />
          <div v-else class="spinner-small"></div>
        </button>
      </div>
      <div class="edit-hint" v-if="!searchResults.length">Press Enter to search or save URL. Supports Playlists!</div>
      
      <!-- Search Error -->
      <div v-if="searchError" class="search-error">
        <LucideAlertCircle :size="14" />
        {{ searchError }}
      </div>

      <!-- Search Results -->
      <div v-if="searchResults.length" class="search-results custom-scrollbar">
        <div 
          v-for="res in searchResults" 
          :key="res.id" 
          class="result-item"
          @click.stop="selectResult(res)"
        >
          <img v-if="res.thumbnail" :src="res.thumbnail.url" class="result-thumb" />
          <div class="result-info">
            <div class="result-title">{{ res.title }}</div>
            <div class="result-meta">
              <span v-if="res.type === 'video'" class="badge video-badge">Video</span>
              <span v-if="res.type === 'playlist'" class="badge playlist-badge">Playlist</span>
              <span v-if="res.type === 'channel'" class="badge channel-badge">Channel</span>
              <span class="channel-name" v-if="res.channel">{{ res.channel.name }}</span>
              <span class="duration" v-if="res.durationFormatted">{{ res.durationFormatted }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="video-container">
      <!-- Empty State -->
      <div v-if="!currentUrl" class="video-empty-state">
        <LucideVideo :size="32" class="empty-icon" />
        <p>No Video URL provided</p>
      </div>

      <!-- YouTube Embed -->
      <iframe 
        v-else-if="isYouTube"
        :src="embedUrl" 
        class="video-player"
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" 
        allowfullscreen
      ></iframe>

      <!-- Native HTML5 Video -->
      <video 
        v-else
        :src="currentUrl"
        class="video-player"
        controls
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</template>

<style scoped>
.video-widget {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  background: #000;
  overflow: hidden;
  border-radius: 12px;
}

.edit-mode {
  width: 100%;
  height: 100%;
  padding: 24px;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edit-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 14px;
  flex-shrink: 0;
}

.yt-icon {
  color: #ff0000;
}

.search-container {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.url-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s ease;
}

.url-input:focus {
  border-color: var(--accent);
}

html.light .url-input {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.search-btn {
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.edit-hint {
  font-size: 12px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.search-error {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ff4a4a;
  font-size: 12px;
  background: rgba(255, 74, 74, 0.1);
  padding: 8px 12px;
  border-radius: 6px;
  flex-shrink: 0;
}

.search-results {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
  padding-right: 4px;
}

.result-item {
  display: flex;
  gap: 12px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

html.light .result-item {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.05);
}

.result-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

html.light .result-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.result-thumb {
  width: 90px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  background: #000;
  flex-shrink: 0;
}

.result-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  overflow: hidden;
}

.result-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-secondary);
}

.badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 9px;
  text-transform: uppercase;
  color: white;
}

.video-badge { background: var(--accent); }
.playlist-badge { background: #9b59b6; }
.channel-badge { background: #2ecc71; }

.channel-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.duration {
  opacity: 0.8;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.video-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.video-player {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.video-empty-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-surface);
  color: var(--text-secondary);
  z-index: 6;
  gap: 12px;
  text-align: center;
  padding: 24px;
}

.empty-icon {
  opacity: 0.5;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
html.light .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}
</style>
