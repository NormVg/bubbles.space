<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'

// 16:9 fixed ratio
const props = defineProps({
  width: { type: Number, default: 2560 },
  height: { type: Number, default: 1440 }
})

const emit = defineEmits<{
  canvasClick: []
}>()

// ── State ──────────────────────────────────────────────────
const scale = ref(1)
const offset = reactive({ x: 0, y: 0 })
const isPanning = ref(false)
const panStart = reactive({ x: 0, y: 0 })

const ZOOM_MAX = 3
const ZOOM_SPEED = 0.002

const viewportEl = ref<HTMLElement | null>(null)

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

// ── Transforms ─────────────────────────────────────────────
const transform = computed(() => `translate(${offset.x}px, ${offset.y}px) scale(${scale.value})`)

const gridBgPos = computed(() => {
  const size = 18 * scale.value
  const x = ((offset.x % size) + size) % size
  const y = ((offset.y % size) + size) % size
  return `${x}px ${y}px`
})

const gridBgSize = computed(() => {
  const size = 18 * scale.value
  return `${size}px ${size}px`
})

// ── Pan ────────────────────────────────────────────────────
function startPan(e: MouseEvent) {
  const target = e.target as HTMLElement
  const isWidgetClick = target.closest('.widget')

  if (e.button === 1 || (e.button === 0 && e.altKey) || (e.button === 0 && !isWidgetClick)) {
    e.preventDefault()
    isPanning.value = true
    panStart.x = e.clientX - offset.x
    panStart.y = e.clientY - offset.y
    if (!isWidgetClick) emit('canvasClick')
  }
}

function doPan(e: MouseEvent) {
  if (!isPanning.value) return
  const rawX = e.clientX - panStart.x
  const rawY = e.clientY - panStart.y
  
  const clamped = clampOffset(rawX, rawY, scale.value)
  offset.x = clamped.x
  offset.y = clamped.y
}

function endPan() {
  isPanning.value = false
}

// ── Zoom ───────────────────────────────────────────────────
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
  const newScale = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN.value, scale.value * (1 + delta)))
  
  if (newScale === scale.value) return // No change

  const ratio = newScale / scale.value
  
  // Calculate new offset to zoom toward cursor
  const rawX = mouseX - ratio * (mouseX - offset.x)
  const rawY = mouseY - ratio * (mouseY - offset.y)
  
  const clamped = clampOffset(rawX, rawY, newScale)
  
  scale.value = newScale
  offset.x = clamped.x
  offset.y = clamped.y
}

function onKeyDown(e: KeyboardEvent) {
  if (e.code === 'AltLeft' || e.code === 'AltRight') e.preventDefault()
}

// ── Lifecycle ──────────────────────────────────────────────
function handleResize() {
  applyConstraints()
}

onMounted(() => {
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
    <!-- Background is now applied at the viewport level so it fills everything.
         The dots pan and scale identically to the canvas world via CSS. -->
    <div
      class="canvas-bg"
      :style="{
        backgroundSize: gridBgSize,
        backgroundPosition: gridBgPos
      }"
    />

    <div
      class="canvas-world"
      :style="{
        transform
      }"
    >
      <slot />
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
  background-image: radial-gradient(circle, var(--dot-color) 1px, transparent 1px);
  will-change: background-position, background-size;
}

.canvas-world {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
  will-change: transform;
}
</style>
