<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
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
const panStart = reactive({ x: 0, y: 0 })
const edgeGlow = reactive({ top: 0, bottom: 0, left: 0, right: 0 })

const ZOOM_MAX = 3
const ZOOM_SPEED = 0.002

const viewportEl = ref<HTMLElement | null>(null)
const canvasWorldEl = ref<HTMLElement | null>(null)
const canvasBgEl = ref<HTMLElement | null>(null)

// Direct DOM State (Bypassing Reactivity)
let currentOffsetX = 0
let currentOffsetY = 0
let currentScale = 1

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

function doPan(e: MouseEvent) {
  if (!isPanning.value) return
  
  if (panRaf) return
  
  const clientX = e.clientX
  const clientY = e.clientY
  
  panRaf = requestAnimationFrame(() => {
    panRaf = null
    const rawX = clientX - panStart.x
    const rawY = clientY - panStart.y
  
    const clamped = clampOffset(rawX, rawY, currentScale)
    currentOffsetX = clamped.x
    currentOffsetY = clamped.y
    
    // Direct DOM Bypass
    if (canvasWorldEl.value) {
      canvasWorldEl.value.style.transform = `translate(${currentOffsetX}px, ${currentOffsetY}px) scale(${currentScale})`
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
    edgeGlow.left = Math.max(0, Math.min(maxOpacity, (overX / maxOverscroll) * maxOpacity))
    edgeGlow.right = Math.max(0, Math.min(maxOpacity, (-overX / maxOverscroll) * maxOpacity))
    edgeGlow.top = Math.max(0, Math.min(maxOpacity, (overY / maxOverscroll) * maxOpacity))
    edgeGlow.bottom = Math.max(0, Math.min(maxOpacity, (-overY / maxOverscroll) * maxOpacity))
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
  edgeGlow.top = 0
  edgeGlow.bottom = 0
  edgeGlow.left = 0
  edgeGlow.right = 0
}

// ── Zoom ───────────────────────────────────────────────────
let wheelSyncTimeout: any = null

function onWheel(e: WheelEvent) {
  const target = e.target as HTMLElement
  const isWidget = target.closest('.widget')
  if (isWidget && !e.ctrlKey && !e.metaKey) return

  e.preventDefault()
  if (!viewportEl.value) return

  const rect = viewportEl.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const delta = -e.deltaY * ZOOM_SPEED
  const newScale = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN.value, currentScale * (1 + delta)))
  
  if (newScale === currentScale) return // No change

  const ratio = newScale / currentScale
  
  // Calculate new offset to zoom toward cursor
  const rawX = mouseX - ratio * (mouseX - currentOffsetX)
  const rawY = mouseY - ratio * (mouseY - currentOffsetY)
  
  const clamped = clampOffset(rawX, rawY, newScale)
  
  currentScale = newScale
  currentOffsetX = clamped.x
  currentOffsetY = clamped.y
  
  // Direct DOM Bypass
  if (canvasWorldEl.value) {
    canvasWorldEl.value.style.transform = `translate(${currentOffsetX}px, ${currentOffsetY}px) scale(${currentScale})`
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
    
    // Initial center fit
    scale.value = ZOOM_MIN.value
    const clamped = clampOffset(0, 0, scale.value)
    offset.x = clamped.x
    offset.y = clamped.y
    
    currentScale = scale.value
    currentOffsetX = offset.x
    currentOffsetY = offset.y
    
    // Initial paint
    if (canvasWorldEl.value) {
      canvasWorldEl.value.style.transform = `translate(${currentOffsetX}px, ${currentOffsetY}px) scale(${currentScale})`
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
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('mouseup', endPan)
  window.removeEventListener('mousemove', doPan)
  window.removeEventListener('resize', handleResize)
  
  if (viewportEl.value) {
    viewportEl.value.removeEventListener('wheel', onWheel)
  }
})

const cursor = computed(() => (isPanning.value ? 'grabbing' : 'default'))
</script>

<template>
  <div
    ref="viewportEl"
    class="canvas-viewport"
    :style="{ cursor }"
    @mousedown="startPan"
  >
    <!-- Edge visual feedback when hitting boundaries -->
    <div class="edge-glow top" :style="{ opacity: edgeGlow.top }"></div>
    <div class="edge-glow bottom" :style="{ opacity: edgeGlow.bottom }"></div>
    <div class="edge-glow left" :style="{ opacity: edgeGlow.left }"></div>
    <div class="edge-glow right" :style="{ opacity: edgeGlow.right }"></div>

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
          v-for="widget in widgetStore.widgets"
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
  /* Added a very subtle mix-blend-mode for character */
  mix-blend-mode: plus-lighter;
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

/* Widget Animations */
.widget-anim-enter-active,
.widget-anim-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), translate 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.widget-anim-enter-from {
  opacity: 0 !important;
  translate: 0 30px !important;
}

.widget-anim-leave-to {
  opacity: 0 !important;
  translate: 0 -30px !important;
}
</style>
