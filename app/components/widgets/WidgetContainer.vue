<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useWidgetStore } from '../../stores/widgets'
import { WidgetRegistry } from './WidgetRegistry'

const props = defineProps<{
  id: string
}>()

const store = useWidgetStore()
const widget = computed(() => store.widgets.find(w => w.id === props.id))
const containerEl = ref<HTMLElement | null>(null)

const isDragging = ref(false)
const dragStart = { x: 0, y: 0, wx: 0, wy: 0 }
const tempX = ref(0)
const tempY = ref(0)

const onMouseDown = (e: MouseEvent) => {
  if (!widget.value || !containerEl.value) return
  // Only drag from the header
  if (!(e.target as HTMLElement).closest('.widget-header')) return
  
  e.preventDefault()
  isDragging.value = true
  
  dragStart.x = e.clientX
  dragStart.y = e.clientY
  dragStart.wx = widget.value.x
  dragStart.wy = widget.value.y
  
  tempX.value = dragStart.wx
  tempY.value = dragStart.wy

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !containerEl.value || !widget.value) return
  
  // Calculate current scale dynamically so dragging is 1:1 regardless of canvas zoom
  const rect = containerEl.value.getBoundingClientRect()
  const scale = rect.width / containerEl.value.offsetWidth
  
  const dx = (e.clientX - dragStart.x) / scale
  const dy = (e.clientY - dragStart.y) / scale
  
  let newX = dragStart.wx + dx
  let newY = dragStart.wy + dy
  
  // Clamp to canvas boundaries
  const canvasWidth = 2560
  const canvasHeight = 1440
  
  tempX.value = Math.max(0, Math.min(newX, canvasWidth - widget.value.width))
  tempY.value = Math.max(0, Math.min(newY, canvasHeight - widget.value.height))
}

const onMouseUp = () => {
  if (!isDragging.value) return
  isDragging.value = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  
  store.updateWidget(props.id, {
    x: tempX.value,
    y: tempY.value
  })
}

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
})

const Component = computed(() => {
  if (!widget.value) return null
  return WidgetRegistry[widget.value.type] || null
})

const remove = () => {
  store.removeWidget(props.id)
}
</script>

<template>
  <div
    v-if="widget"
    ref="containerEl"
    class="widget"
    :class="{ dragging: isDragging }"
    :style="{
      transform: `translate(${isDragging ? tempX : widget.x}px, ${isDragging ? tempY : widget.y}px)`,
      width: `${widget.width}px`,
      height: `${widget.height}px`
    }"
  >
    <div class="widget-header" @mousedown="onMouseDown">
      <div class="widget-title">{{ widget.title || widget.type }}</div>
      <button class="widget-close" @click="remove" aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <div class="widget-body">
      <component :is="Component" v-if="Component" :data="widget.data" />
      <div v-else class="widget-error">Unknown widget type: {{ widget.type }}</div>
    </div>
  </div>
</template>

<style scoped>
.widget {
  position: absolute;
  top: 0;
  left: 0;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--widget-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(24px);
  will-change: transform;
  transition: box-shadow 0.2s ease, opacity 0.2s ease;
  z-index: 10;
}

.widget.dragging {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
  opacity: 0.95;
  z-index: 100;
}

/* Light mode specific adjustment for glassmorphism */
html.light .widget {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

html.light .widget-header {
  background: rgba(0, 0, 0, 0.03);
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid var(--border-subtle);
  cursor: grab;
  user-select: none;
}

.widget-header:active {
  cursor: grabbing;
}

.widget-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  opacity: 0.8;
  text-transform: capitalize;
  pointer-events: none;
}

.widget-close {
  opacity: 0.4;
  transition: all 0.2s ease;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.widget-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
  color: var(--danger);
}

html.light .widget-close:hover {
  background: rgba(0, 0, 0, 0.05);
}

.widget-body {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.widget-error {
  padding: 16px;
  color: var(--danger);
  font-size: 14px;
  text-align: center;
}
</style>
