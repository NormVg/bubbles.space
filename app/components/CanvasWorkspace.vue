<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import WidgetContainer from './widgets/WidgetContainer.vue'
import { useWidgetStore } from '../stores/widgets'

// 16:9 fixed ratio
const props = defineProps({
  width: { type: Number, default: 2560 },
  height: { type: Number, default: 1440 }
})

const emit = defineEmits<{
  canvasClick: []
}>()

const widgetStore = useWidgetStore()

// ── State ──────────────────────────────────────────────────
const scale = ref(1)
const offset = reactive({ x: 0, y: 0 })
const isPanning = ref(false)
const panStart = { x: 0, y: 0 } // No need for reactivity here
const edgeGlowState = { top: 0, bottom: 0, left: 0, right: 0 } // Plain object

const ZOOM_MAX = 3
const ZOOM_SPEED = 0.002

const viewportEl = ref<HTMLElement | null>(null)
const canvasWorldEl = ref<HTMLElement | null>(null)
const canvasBgEl = ref<HTMLElement | null>(null)

// Refs for Edge Glows to bypass reactivity
const edgeGlowTop = ref<HTMLElement | null>(null)
const edgeGlowBottom = ref<HTMLElement | null>(null)
const edgeGlowLeft = ref<HTMLElement | null>(null)
const edgeGlowRight = ref<HTMLElement | null>(null)

// Direct DOM State (Bypassing Reactivity)
let currentOffsetX = 0
let currentOffsetY = 0
let currentScale = 1
let isTransitioning = false

const isSwitchingWorkspaces = ref(false)
const displayedWidgets = shallowRef(widgetStore.widgets)

watch(() => widgetStore.widgets, (newWidgets) => {
  if (!isSwitchingWorkspaces.value) {
    displayedWidgets.value = newWidgets
  }
})

// Workspace Switch Transition
let transitionId = 0
watch(() => widgetStore.activeWorkspaceId, async (newId, oldId) => {
  const currentTransition = ++transitionId
  isSwitchingWorkspaces.value = true
  
  if (oldId) {
    widgetStore.saveCanvasState(currentOffsetX, currentOffsetY, currentScale, oldId)
  }
  
  if (!canvasWorldEl.value) {
    isSwitchingWorkspaces.value = false
    return
  }
  isTransitioning = true
  
  // 1. Zoom out and fade out (WAAPI)
  const animOut = canvasWorldEl.value.animate([
    { transform: `translate3d(${currentOffsetX}px, ${currentOffsetY}px, 0) scale(${currentScale})`, opacity: 1 },
    { transform: `translate3d(${currentOffsetX}px, ${currentOffsetY}px, 0) scale(${currentScale * 0.96})`, opacity: 0 }
  ], { duration: 150, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' })
  
  await animOut.finished
  // MUST cancel WAAPI animations, otherwise their fill: forwards overrides inline styles forever
  animOut.cancel()
  
  if (currentTransition !== transitionId) return // Cancel if a newer transition started
  
  displayedWidgets.value = widgetStore.widgets
  await nextTick() // Wait for Vue to render new widgets
  
  if (currentTransition !== transitionId) return
  
  // 2. Load new coordinates
  const newWs = widgetStore.workspaces.find(w => w.id === newId)
  if (newWs && newWs.canvasState) {
    currentOffsetX = newWs.canvasState.x
    currentOffsetY = newWs.canvasState.y
    currentScale = newWs.canvasState.scale
    syncReactives()
  }
  
  // 3. Zoom in and fade in
  const animIn = canvasWorldEl.value.animate([
    { transform: `translate3d(${currentOffsetX}px, ${currentOffsetY}px, 0) scale(${currentScale * 1.04})`, opacity: 0 },
    { transform: `translate3d(${currentOffsetX}px, ${currentOffsetY}px, 0) scale(${currentScale})`, opacity: 1 }
  ], { duration: 350, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'forwards' })
  
  animIn.onfinish = () => {
    animIn.cancel()
    if (currentTransition !== transitionId) return
    
    // Reset WAAPI overrides so normal panning works again
    if (canvasWorldEl.value) {
      canvasWorldEl.value.style.transform = `translate3d(${currentOffsetX}px, ${currentOffsetY}px, 0) scale(${currentScale})`
      canvasWorldEl.value.style.opacity = '1'
    }
    isTransitioning = false
    isSwitchingWorkspaces.value = false
  }
})

// ── Computed constraints ───────────────────────────────────
// The minimum scale is whatever makes the canvas fit perfectly in the viewport.
// It will never be smaller than the viewport, preventing the user from zooming out into the void.
const PADDING = 40 // Margin around the canvas at max zoom out so the borders are fully visible
const ZOOM_MIN = computed(() => {
  if (!viewportEl.value) return 0.1
  const vw = viewportEl.value.clientWidth
  const vh = viewportEl.value.clientHeight
  return Math.min((vw - PADDING * 2) / props.width, (vh - PADDING * 2) / props.height)
})

// Ensures the canvas cannot be dragged past its edges, leaving empty space in the viewport.
function clampOffset(x: number, y: number, s: number) {
  if (!viewportEl.value) return { x, y }
  
  const vw = viewportEl.value.clientWidth
  const vh = viewportEl.value.clientHeight
  const cw = props.width * s
  const ch = props.height * s

  let newX = x
  let newY = y

  // If scaled canvas is narrower than viewport, it forces center
  if (cw <= vw) {
    newX = (vw - cw) / 2
  } else {
    // If wider, clamp so it doesn't leave the left (x <= 0) or right (x >= vw - cw) edges
    newX = Math.min(0, Math.max(vw - cw, x))
  }

  if (ch <= vh) {
    newY = (vh - ch) / 2
  } else {
    newY = Math.min(0, Math.max(vh - ch, y))
  }

  return { x: newX, y: newY }
}

function applyConstraints() {
  // Clamp scale
  scale.value = Math.max(ZOOM_MIN.value, Math.min(ZOOM_MAX, scale.value))
  // Clamp offset based on new scale
  const clamped = clampOffset(offset.x, offset.y, scale.value)
  offset.x = clamped.x
  offset.y = clamped.y
}

// Removed reactive transform, gridBgPos, gridBgSize to avoid Vue overwriting our DOM bypass

// ── Pan ────────────────────────────────────────────────────
function startPan(e: MouseEvent) {
  const target = e.target as HTMLElement
  const isWidgetClick = target.closest('.widget')

  if (e.button === 1 || (e.button === 0 && e.altKey) || (e.button === 0 && !isWidgetClick)) {
    e.preventDefault()
    isPanning.value = true
    panStart.x = e.clientX - currentOffsetX
    panStart.y = e.clientY - currentOffsetY
    if (!isWidgetClick) emit('canvasClick')
  }
}

let panRaf: number | null = null
let latestPanX = 0
let latestPanY = 0

function doPan(e: MouseEvent) {
  if (!isPanning.value || isTransitioning) return
  
  latestPanX = e.clientX
  latestPanY = e.clientY
  
  if (panRaf) return
  
  panRaf = requestAnimationFrame(() => {
    panRaf = null
    const rawX = latestPanX - panStart.x
    const rawY = latestPanY - panStart.y
  
    const clamped = clampOffset(rawX, rawY, currentScale)
    currentOffsetX = clamped.x
    currentOffsetY = clamped.y
    
    // Direct DOM Bypass
    if (canvasWorldEl.value) {
      canvasWorldEl.value.style.transform = `translate3d(${currentOffsetX}px, ${currentOffsetY}px, 0) scale(${currentScale})`
    }
    if (canvasBgEl.value) {
      // Prevent visual noise at microscopic scales
      if (currentScale < 0.3) {
        canvasBgEl.value.style.opacity = '0'
      } else {
        if (currentScale < 0.6) {
          canvasBgEl.value.style.opacity = `${(currentScale - 0.3) / 0.3}`
        } else {
          canvasBgEl.value.style.opacity = '1'
        }
      }
    }

    // Calculate overscroll distance for edge glows
    const overX = rawX - clamped.x
    const overY = rawY - clamped.y

    // Smoothly map overscroll to opacity for a very minimal effect
    const maxOverscroll = 120 // pixels
    const maxOpacity = 0.12 // Reduced significantly for subtlety
    edgeGlowState.left = Math.max(0, Math.min(maxOpacity, (overX / maxOverscroll) * maxOpacity))
    edgeGlowState.right = Math.max(0, Math.min(maxOpacity, (-overX / maxOverscroll) * maxOpacity))
    edgeGlowState.top = Math.max(0, Math.min(maxOpacity, (overY / maxOverscroll) * maxOpacity))
    edgeGlowState.bottom = Math.max(0, Math.min(maxOpacity, (-overY / maxOverscroll) * maxOpacity))
    
    // Direct DOM Bypass for edge glows
    if (edgeGlowTop.value) edgeGlowTop.value.style.opacity = `${edgeGlowState.top}`
    if (edgeGlowBottom.value) edgeGlowBottom.value.style.opacity = `${edgeGlowState.bottom}`
    if (edgeGlowLeft.value) edgeGlowLeft.value.style.opacity = `${edgeGlowState.left}`
    if (edgeGlowRight.value) edgeGlowRight.value.style.opacity = `${edgeGlowState.right}`
  })
}

function syncReactives() {
  offset.x = currentOffsetX
  offset.y = currentOffsetY
  scale.value = currentScale
}

function endPan() {
  isPanning.value = false
  syncReactives()
  edgeGlowState.top = 0
  edgeGlowState.bottom = 0
  edgeGlowState.left = 0
  edgeGlowState.right = 0
  if (edgeGlowTop.value) edgeGlowTop.value.style.opacity = '0'
  if (edgeGlowBottom.value) edgeGlowBottom.value.style.opacity = '0'
  if (edgeGlowLeft.value) edgeGlowLeft.value.style.opacity = '0'
  if (edgeGlowRight.value) edgeGlowRight.value.style.opacity = '0'
}

// ── Zoom ───────────────────────────────────────────────────
let wheelSyncTimeout: any = null

let wheelRaf: number | null = null
let accumulatedDeltaY = 0
let latestWheelX = 0
let latestWheelY = 0

function onWheel(e: WheelEvent) {
  const target = e.target as HTMLElement
  const isWidget = target.closest('.widget')
  if (isWidget && !e.ctrlKey && !e.metaKey) return

  e.preventDefault()
  if (!viewportEl.value || isTransitioning) return

  const rect = viewportEl.value.getBoundingClientRect()
  latestWheelX = e.clientX - rect.left
  latestWheelY = e.clientY - rect.top
  accumulatedDeltaY += e.deltaY
  
  if (wheelRaf) return
  
  wheelRaf = requestAnimationFrame(() => {
    wheelRaf = null
    
    const delta = -accumulatedDeltaY * ZOOM_SPEED
    accumulatedDeltaY = 0
    
    const newScale = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN.value, currentScale * (1 + delta)))
    
    if (newScale === currentScale) return // No change
  
    const ratio = newScale / currentScale
    
    // Calculate new offset to zoom toward cursor
    const rawX = latestWheelX - ratio * (latestWheelX - currentOffsetX)
    const rawY = latestWheelY - ratio * (latestWheelY - currentOffsetY)
    
    const clamped = clampOffset(rawX, rawY, newScale)
    
    currentScale = newScale
    currentOffsetX = clamped.x
    currentOffsetY = clamped.y
    
    // Direct DOM Bypass
    if (canvasWorldEl.value) {
      canvasWorldEl.value.style.transform = `translate3d(${currentOffsetX}px, ${currentOffsetY}px, 0) scale(${currentScale})`
    }
    if (canvasBgEl.value) {
      if (currentScale < 0.3) {
        canvasBgEl.value.style.opacity = '0'
      } else {
        if (currentScale < 0.6) {
          canvasBgEl.value.style.opacity = `${(currentScale - 0.3) / 0.3}`
        } else {
          canvasBgEl.value.style.opacity = '1'
        }
      }
    }
    
    clearTimeout(wheelSyncTimeout)
    wheelSyncTimeout = setTimeout(syncReactives, 150)
  })
}

function onKeyDown(e: KeyboardEvent) {
  if (e.code === 'AltLeft' || e.code === 'AltRight') e.preventDefault()
}

// ── Lifecycle ──────────────────────────────────────────────
function handleResize() {
  applyConstraints()
}

onMounted(() => {
  widgetStore.init()
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('mouseup', endPan)
  window.addEventListener('mousemove', doPan)
  window.addEventListener('resize', handleResize)

  if (viewportEl.value) {
    viewportEl.value.addEventListener('wheel', onWheel, { passive: false })
    
    // Initial center fit OR load from workspace state
    const currentWs = widgetStore.activeWorkspace
    if (currentWs && (currentWs.canvasState.x !== 0 || currentWs.canvasState.scale !== 1)) {
      scale.value = currentWs.canvasState.scale
      offset.x = currentWs.canvasState.x
      offset.y = currentWs.canvasState.y
    } else {
      scale.value = ZOOM_MIN.value
      const clamped = clampOffset(0, 0, scale.value)
      offset.x = clamped.x
      offset.y = clamped.y
    }
    
    currentScale = scale.value
    currentOffsetX = offset.x
    currentOffsetY = offset.y
    
    // Initial paint
    if (canvasWorldEl.value) {
      canvasWorldEl.value.style.transform = `translate3d(${currentOffsetX}px, ${currentOffsetY}px, 0) scale(${currentScale})`
    }
    if (canvasBgEl.value) {
      if (currentScale < 0.3) {
        canvasBgEl.value.style.opacity = '0'
      } else {
        if (currentScale < 0.6) {
          canvasBgEl.value.style.opacity = `${(currentScale - 0.3) / 0.3}`
        } else {
          canvasBgEl.value.style.opacity = '1'
        }
      }
    }
  }
})

onUnmounted(() => {
  // Save final state before unmount
  widgetStore.saveCanvasState(currentOffsetX, currentOffsetY, currentScale, widgetStore.activeWorkspaceId)
  
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('mouseup', endPan)
  window.removeEventListener('mousemove', doPan)
  window.removeEventListener('resize', handleResize)
  
  if (viewportEl.value) {
    viewportEl.value.removeEventListener('wheel', onWheel)
  }
})

const isDraggingFile = ref(false)
const isUploading = ref(false)
const uploadError = ref<string | null>(null)

function handleDragOver(e: DragEvent) {
  isDraggingFile.value = true
}

function handleDragLeave(e: DragEvent) {
  isDraggingFile.value = false
}

async function handleDrop(e: DragEvent) {
  isDraggingFile.value = false
  if (!e.dataTransfer?.files.length) return

  const rect = viewportEl.value?.getBoundingClientRect()
  if (!rect) return
  
  const viewX = e.clientX - rect.left
  const viewY = e.clientY - rect.top
  
  const canvasX = (viewX - currentOffsetX) / currentScale
  const canvasY = (viewY - currentOffsetY) / currentScale

  const filesArray = Array.from(e.dataTransfer.files)
  const formData = new FormData()
  filesArray.forEach(file => {
    formData.append('files', file)
  })

  isUploading.value = true
  uploadError.value = null

  try {
    const res = await $fetch<{ files: {url: string, mimeType: string, originalName: string}[] }>('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    let currentSpawnX = canvasX
    let currentSpawnY = canvasY

    const images = []
    const specialFiles = []
    const genericFiles = []

    for (const file of res.files) {
      const mime = file.mimeType || ''
      if (mime.startsWith('image/')) {
        images.push(file)
      } else if (mime === 'application/pdf' || mime.startsWith('video/') || mime.startsWith('text/')) {
        specialFiles.push(file)
      } else {
        genericFiles.push(file)
      }
    }

    if (images.length > 0) {
      widgetStore.addWidget({
        type: 'image',
        x: currentSpawnX,
        y: currentSpawnY,
        width: 400,
        height: 400,
        data: images.length > 1 ? { images: images.map(img => img.url) } : { url: images[0].url }
      })
      currentSpawnX += 40
      currentSpawnY += 40
    }

    for (const file of specialFiles) {
      const mime = file.mimeType || ''
      let type = 'file'
      let content = `[${file.originalName}](${file.url})`
      
      if (mime === 'application/pdf') {
        type = 'pdf'
      } else if (mime.startsWith('video/')) {
        type = 'video'
      } else if (mime.startsWith('text/')) {
        type = 'markdown'
        const originalFile = filesArray.find(f => f.name === file.originalName)
        if (originalFile) {
          try {
            content = await originalFile.text()
          } catch (e) {
            console.error('Failed to read text file', e)
          }
        }
      }

      widgetStore.addWidget({
        type,
        x: currentSpawnX,
        y: currentSpawnY,
        width: 400,
        height: 300,
        data: type === 'markdown' ? { content } : { url: file.url }
      })
      
      currentSpawnX += 40
      currentSpawnY += 40
    }

    if (genericFiles.length > 0) {
      widgetStore.addWidget({
        type: 'file',
        x: currentSpawnX,
        y: currentSpawnY,
        width: 300,
        height: Math.min(genericFiles.length * 80 + 32, 400),
        data: {
          files: genericFiles.map(f => ({
            url: f.url,
            filename: f.originalName,
            mimeType: f.mimeType
          }))
        }
      })
      currentSpawnX += 40
      currentSpawnY += 40
    }

  } catch (err: any) {
    console.error('Failed to upload files', err)
    uploadError.value = err?.data?.statusMessage || err?.message || 'Failed to upload files. Please try again.'
    // Auto clear error after 5 seconds
    setTimeout(() => {
      if (uploadError.value) uploadError.value = null
    }, 5000)
  } finally {
    isUploading.value = false
  }
}

const cursor = computed(() => (isPanning.value ? 'grabbing' : 'default'))
</script>

<template>
  <div
    ref="viewportEl"
    class="canvas-viewport"
    :class="{ 'is-dragging-file': isDraggingFile }"
    :style="{ cursor, pointerEvents: widgetStore.isInitializing ? 'none' : 'auto' }"
    @mousedown="startPan"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- Massive Drop Overlay -->
    <Transition name="fade">
      <div v-if="isDraggingFile" class="drop-overlay">
        <div class="drop-content">
          <div class="drop-icon-wrapper">
            <LucideUploadCloud :size="48" class="drop-icon" />
          </div>
          <h2 class="drop-text">Drop files to add to workspace</h2>
        </div>
      </div>
    </Transition>

    <!-- Uploading / Error Overlay -->
    <Transition name="fade">
      <div v-if="isUploading || uploadError" class="upload-overlay">
        <div class="upload-content" :class="{ 'is-error': !!uploadError }">
          <template v-if="isUploading">
            <LucideLoader2 :size="32" class="spin-icon" />
            <span class="upload-text">Uploading files to Appwrite...</span>
          </template>
          <template v-else-if="uploadError">
            <LucideAlertCircle :size="32" class="error-icon" />
            <div class="error-text-container">
              <span class="upload-text">Upload Failed</span>
              <span class="error-subtext">{{ uploadError }}</span>
            </div>
          </template>
        </div>
      </div>
    </Transition>

    <!-- Edge visual feedback when hitting boundaries -->
    <div ref="edgeGlowTop" class="edge-glow top" style="opacity: 0"></div>
    <div ref="edgeGlowBottom" class="edge-glow bottom" style="opacity: 0"></div>
    <div ref="edgeGlowLeft" class="edge-glow left" style="opacity: 0"></div>
    <div ref="edgeGlowRight" class="edge-glow right" style="opacity: 0"></div>

    <div
      ref="canvasWorldEl"
      class="canvas-world"
      :style="{ width: `${width}px`, height: `${height}px` }"
    >
      <!-- Background grid that natively scales and translates with the world via GPU -->
      <div
        ref="canvasBgEl"
        class="canvas-bg"
      />
      
      <slot />
      
      <!-- Render dynamic AI widgets -->
      <TransitionGroup name="widget-anim">
        <WidgetContainer
          v-for="widget in displayedWidgets"
          :key="widget.id"
          :id="widget.id"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.canvas-viewport {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  user-select: none;
  background: var(--bg-base);
  transition: box-shadow 0.2s ease, border 0.2s ease;
}

.drop-overlay {
  position: absolute;
  inset: 0;
  z-index: 99999;
  background: rgba(10, 10, 10, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.drop-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 48px 64px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
}
.drop-icon-wrapper {
  color: var(--accent);
}
.drop-text {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
  color: var(--text-primary);
}

.canvas-viewport.is-dragging-file {
  box-shadow: inset 0 0 0 4px var(--accent);
}
.canvas-viewport.is-dragging-file::after {
  content: '';
  position: absolute;
  inset: 12px;
  border: 2px dashed var(--accent);
  border-radius: 12px;
  pointer-events: none;
  z-index: 99998;
}

/* ── Uploading Overlay ── */
.upload-overlay {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  pointer-events: none;
}
.upload-content {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  padding: 12px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--text-primary);
}
.upload-content.is-error {
  background: rgba(255, 60, 60, 0.1);
  border-color: rgba(255, 60, 60, 0.3);
}
.spin-icon {
  animation: spin 1s linear infinite;
  color: var(--accent);
}
.error-icon {
  color: #ff4d4f;
}
.upload-text {
  font-size: 14px;
  font-weight: 500;
}
.error-text-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.error-subtext {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.init-overlay {
  position: absolute;
  inset: 0;
  z-index: 9999;
  background: rgba(10, 10, 10, 0.3);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto; /* Catch all clicks to block canvas interaction */
}

.loader-ring {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: init-spin 1s linear infinite;
}

@keyframes init-spin {
  to { transform: rotate(360deg); }
}

.canvas-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23ffffff' fill-opacity='0.15'/%3E%3C/svg%3E");
  background-size: 18px 18px;
  will-change: opacity;
}

html.light .canvas-bg {
  background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23000000' fill-opacity='0.1'/%3E%3C/svg%3E");
}

.canvas-world {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
  will-change: transform;
}

.edge-glow {
  position: absolute;
  pointer-events: none;
  z-index: 100;
  /* Fast follow when pulling, slow fade when released */
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Reduced size and switched to a more neutral text-primary color for minimalism */
.edge-glow.top {
  top: 0; left: 0; right: 0; height: 48px;
  background: linear-gradient(to bottom, var(--text-primary), transparent);
}
.edge-glow.bottom {
  bottom: 0; left: 0; right: 0; height: 48px;
  background: linear-gradient(to top, var(--text-primary), transparent);
}
.edge-glow.left {
  top: 0; bottom: 0; left: 0; width: 48px;
  background: linear-gradient(to right, var(--text-primary), transparent);
}
.edge-glow.right {
  top: 0; bottom: 0; right: 0; width: 48px;
  background: linear-gradient(to left, var(--text-primary), transparent);
}


</style>
