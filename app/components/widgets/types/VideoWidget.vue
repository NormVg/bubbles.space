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
const editUrl = ref(props.data.url || '')

// Detect if URL is YouTube
const isYouTube = computed(() => {
  if (!currentUrl.value) return false
  return currentUrl.value.includes('youtube.com') || currentUrl.value.includes('youtu.be')
})

// Convert normal YouTube URL to embed URL
const embedUrl = computed(() => {
  if (!isYouTube.value || !currentUrl.value) return ''
  try {
    let videoId = ''
    if (currentUrl.value.includes('youtu.be/')) {
      videoId = currentUrl.value.split('youtu.be/')[1].split('?')[0]
    } else if (currentUrl.value.includes('youtube.com/watch')) {
      const urlObj = new URL(currentUrl.value)
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

watch(() => props.isEditing, (editing) => {
  if (editing) {
    editUrl.value = currentUrl.value
  } else {
    const url = editUrl.value.trim()
    currentUrl.value = url
    emit('save', { ...props.data, url })
  }
})
</script>

<template>
  <div class="video-widget">
    <div v-if="isEditing" class="edit-mode">
      <div class="edit-header">
        <LucideVideo :size="16" />
        <span>Video URL</span>
      </div>
      <input 
        v-model="editUrl" 
        type="text" 
        placeholder="https://youtube.com/watch?v=... or https://.../video.mp4"
        class="url-input"
        @keydown.enter.stop
      />
      <div class="edit-hint">Enter a YouTube link or a direct link to an MP4 file.</div>
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
  background: #000; /* Videos look best with black background */
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
  justify-content: center;
}

.edit-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 14px;
}

.url-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-family: monospace;
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

.edit-hint {
  font-size: 12px;
  color: var(--text-secondary);
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
  color: var(--text-secondary);
}

.video-empty-state p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}
</style>
