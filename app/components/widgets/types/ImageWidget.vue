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

// Editing
const editUrls = ref(imageList.value.join('\n'))

watch(() => props.isEditing, (editing) => {
  if (editing) {
    editUrls.value = imageList.value.join('\n')
  } else {
    // Save
    const urls = editUrls.value.split('\n').map(u => u.trim()).filter(Boolean)
    emit('save', { ...props.data, images: urls.length > 0 ? urls : undefined, url: undefined })
  }
})
</script>

<template>
  <div class="image-widget" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div v-if="isEditing" class="edit-mode">
      <textarea v-model="editUrls" placeholder="Enter image URLs (one per line)"></textarea>
    </div>
    
    <div v-else class="image-container">
      <Transition name="fade-slide" mode="out-in">
        <img :key="currentIndex" :src="imageList[currentIndex]" :class="['main-image', props.data.objectFit || 'cover']" alt="Widget Image" />
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
          <img :src="img" alt="thumbnail" />
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
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
}

.edit-mode textarea {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  resize: none;
  font-family: monospace;
}

html.light .edit-mode textarea {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--text-primary);
}

.image-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
