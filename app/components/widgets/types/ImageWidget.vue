<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  data: {
    images?: string[]
    url?: string // Fallback for single image
    objectFit?: 'cover' | 'contain'
  }
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', data: any): void
}>()

const imageList = computed(() => {
  if (props.data.images && props.data.images.length > 0) return props.data.images
  if (props.data.url) return [props.data.url]
  return ['https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=1000&auto=format&fit=crop'] // fallback demo image
})

const currentIndex = ref(0)
let autoPlayTimer: any = null

const isGallery = computed(() => imageList.value.length > 1)

const startAutoPlay = () => {
  if (!isGallery.value) return
  stopAutoPlay()
  autoPlayTimer = setInterval(() => {
    nextImage()
  }, 4000)
}

const stopAutoPlay = () => {
  if (autoPlayTimer) clearInterval(autoPlayTimer)
}

const nextImage = (manual = false) => {
  if (manual) stopAutoPlay()
  currentIndex.value = (currentIndex.value + 1) % imageList.value.length
}

const prevImage = (manual = false) => {
  if (manual) stopAutoPlay()
  currentIndex.value = (currentIndex.value - 1 + imageList.value.length) % imageList.value.length
}

const selectImage = (index: number) => {
  stopAutoPlay()
  currentIndex.value = index
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})

// Pause on hover
const onMouseEnter = () => stopAutoPlay()
const onMouseLeave = () => startAutoPlay()

// Error handling
const imageFailures = ref<Record<number, boolean>>({})
const imageLoading = ref<Record<number, boolean>>({})
const retryTimestamps = ref<Record<number, number>>({})

const handleImageLoad = (index: number) => {
  imageLoading.value[index] = false
}

const handleImageError = (event: Event, index: number) => {
  imageLoading.value[index] = false
  if (!imageFailures.value[index]) {
    imageFailures.value[index] = true
  }
}

const retryImage = (index: number) => {
  imageFailures.value[index] = false
  imageLoading.value[index] = true
  retryTimestamps.value[index] = Date.now()
}

const getImageUrl = (url: string, index: number) => {
  // If it's a first load and neither loading nor failed, set loading
  if (imageLoading.value[index] === undefined && !imageFailures.value[index]) {
    imageLoading.value[index] = true
  }
  
  if (retryTimestamps.value[index]) {
    const sep = url.includes('?') ? '&' : '?'
    return `${url}${sep}retry=${retryTimestamps.value[index]}`
  }
  return url
}

// Editing
const editUrls = ref<string[]>([])

watch(() => props.isEditing, (editing) => {
  if (editing) {
    editUrls.value = [...imageList.value]
    if (editUrls.value.length === 0) {
      editUrls.value.push('')
    }
  } else {
    // Save
    const urls = editUrls.value.map(u => u.trim()).filter(Boolean)
    emit('save', { ...props.data, images: urls.length > 0 ? urls : undefined, url: undefined })
  }
})

function addImage() {
  editUrls.value.push('')
}

function removeImage(index: number) {
  editUrls.value.splice(index, 1)
}
</script>

<template>
  <div class="image-widget" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div v-if="isEditing" class="edit-mode">
      <div class="edit-header">
        <LucideImage :size="16" />
        <span>Image Sources</span>
        <button class="add-btn" @click="addImage" title="Add Image">
          <LucidePlus :size="16" />
        </button>
      </div>
      
      <div class="edit-files-list">
        <div v-for="(url, idx) in editUrls" :key="idx" class="edit-file-item">
          <div class="edit-file-inputs">
            <input 
              v-model="editUrls[idx]" 
              type="text" 
              placeholder="Image URL (https://...)"
              class="url-input"
              @keydown.enter.stop
            />
          </div>
          <button class="remove-btn" @click="removeImage(idx)" title="Remove Image">
            <LucideX :size="16" />
          </button>
        </div>
      </div>
    </div>
    
    <div v-else class="image-container">
      <Transition name="fade-slide" mode="out-in">
        <div :key="currentIndex" class="main-image-wrapper">
          <!-- Loading Skeleton -->
          <div v-if="imageLoading[currentIndex]" class="image-loader">
            <div class="spinner"></div>
          </div>

          <!-- Error State -->
          <div v-if="imageFailures[currentIndex]" class="image-error-state">
            <LucideImageOff :size="32" class="error-icon" />
            <p>Failed to load image</p>
            <button class="retry-btn" @click.stop="retryImage(currentIndex)">
              <LucideRefreshCw :size="14" /> Retry
            </button>
          </div>

          <img 
            v-show="!imageFailures[currentIndex]"
            :src="getImageUrl(imageList[currentIndex] || '', currentIndex)" 
            :class="['main-image', props.data.objectFit || 'cover', { 'is-loading': imageLoading[currentIndex] }]" 
            alt="Widget Image" 
            referrerpolicy="no-referrer"
            crossorigin="anonymous"
            @load="handleImageLoad(currentIndex)"
            @error="(e) => handleImageError(e, currentIndex)"
          />
        </div>
      </Transition>
      
      <!-- Controls -->
      <div v-if="isGallery" class="gallery-controls">
        <button class="nav-btn prev" @click.stop="prevImage(true)" aria-label="Previous image">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button class="nav-btn next" @click.stop="nextImage(true)" aria-label="Next image">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      
      <!-- Thumbnails -->
      <div v-if="isGallery" class="thumbnails-bar">
        <div 
          v-for="(img, idx) in imageList" 
          :key="idx" 
          class="thumbnail" 
          :class="{ active: idx === currentIndex }"
          @click.stop="selectImage(idx)"
        >
          <img 
            :src="img" 
            alt="thumbnail" 
            referrerpolicy="no-referrer" 
            crossorigin="anonymous"
            @error="(e) => handleImageError(e, idx)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-widget {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  background: transparent;
  overflow: hidden;
  border-radius: 12px;
}

.edit-mode {
  width: 100%;
  height: 100%;
  padding: 16px;
  background: var(--bg-overlay);
  backdrop-filter: blur(12px);
  overflow-y: auto;
}

.edit-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 12px;
}

.add-btn {
  margin-left: auto;
  background: transparent;
  border: none;
  color: var(--accent);
  cursor: pointer;
  border-radius: 4px;
  padding: 4px;
  display: flex;
}
.add-btn:hover { background: rgba(59, 130, 246, 0.1); }

.edit-files-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edit-file-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  background: var(--bg-base);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.edit-file-inputs {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.remove-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
}
.remove-btn:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

.url-input {
  background: var(--bg-overlay);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  width: 100%;
}
.url-input:focus {
  border-color: var(--accent);
}

.image-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  background: var(--bg-surface);
}

.image-loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
  z-index: 5;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.image-error-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  color: var(--text-secondary);
  z-index: 6;
  gap: 12px;
}

.error-icon {
  opacity: 0.5;
}

.image-error-state p {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
}

.retry-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.main-image.is-loading {
  opacity: 0;
}

.main-image.contain {
  object-fit: contain;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: scale(1.02);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

/* Controls */
.gallery-controls {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.image-widget:hover .gallery-controls {
  opacity: 1;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

/* Thumbnails */
.thumbnails-bar {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  display: flex;
  gap: 8px;
  padding: 6px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
  max-width: 90%;
  overflow-x: auto;
  scrollbar-width: none;
}

.thumbnails-bar::-webkit-scrollbar {
  display: none;
}

.image-widget:hover .thumbnails-bar {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}

.thumbnail {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  flex-shrink: 0;
}

.thumbnail:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

.thumbnail.active {
  opacity: 1;
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
