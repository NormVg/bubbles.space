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

// Drag State
const isDragging = ref(false)
const dragStart = { x: 0, y: 0, wx: 0, wy: 0 }
const tempX = ref(0)
const tempY = ref(0)

// Resize State
const isResizing = ref(false)
const resizeStart = { x: 0, y: 0, w: 0, h: 0 }
const tempWidth = ref(0)
const tempHeight = ref(0)

// Dragging Logic
const onMouseDown = (e: MouseEvent) => {
  if (!widget.value || !containerEl.value) return
  
  const target = e.target as HTMLElement
  
  // Only drag from the dedicated drag handle
  if (!target.closest('.widget-drag-handle')) {
    return
  }
  
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
  
  const rect = containerEl.value.getBoundingClientRect()
  const scale = rect.width / containerEl.value.offsetWidth
  
  const dx = (e.clientX - dragStart.x) / scale
  const dy = (e.clientY - dragStart.y) / scale
  
  let newX = dragStart.wx + dx
  let newY = dragStart.wy + dy
  
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

// Resizing Logic
const onResizeDown = (e: MouseEvent) => {
  if (!widget.value || !containerEl.value) return
  e.preventDefault()
  e.stopPropagation()
  
  isResizing.value = true
  resizeStart.x = e.clientX
  resizeStart.y = e.clientY
  resizeStart.w = widget.value.width
  resizeStart.h = widget.value.height
  
  tempWidth.value = resizeStart.w
  tempHeight.value = resizeStart.h
  
  window.addEventListener('mousemove', onResizeMove)
  window.addEventListener('mouseup', onResizeUp)
}

const onResizeMove = (e: MouseEvent) => {
  if (!isResizing.value || !containerEl.value || !widget.value) return
  
  const rect = containerEl.value.getBoundingClientRect()
  const scale = rect.width / containerEl.value.offsetWidth
  
  const dx = (e.clientX - resizeStart.x) / scale
  const dy = (e.clientY - resizeStart.y) / scale
  
  const minWidth = 200
  const minHeight = 150
  
  const canvasWidth = 2560
  const canvasHeight = 1440
  
  let newW = Math.max(minWidth, resizeStart.w + dx)
  let newH = Math.max(minHeight, resizeStart.h + dy)
  
  // Ensure we don't resize beyond canvas right/bottom edges
  newW = Math.min(newW, canvasWidth - widget.value.x)
  newH = Math.min(newH, canvasHeight - widget.value.y)
  
  tempWidth.value = newW
  tempHeight.value = newH
}

const onResizeUp = () => {
  if (!isResizing.value) return
  isResizing.value = false
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup', onResizeUp)
  
  store.updateWidget(props.id, {
    width: tempWidth.value,
    height: tempHeight.value
  })
}

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup', onResizeUp)
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
    class="widget group"
    :class="{ dragging: isDragging, resizing: isResizing }"
    :style="{
      transform: `translate(${isDragging ? tempX : widget.x}px, ${isDragging ? tempY : widget.y}px)`,
      width: `${isResizing ? tempWidth : widget.width}px`,
      height: `${isResizing ? tempHeight : widget.height}px`
    }"
  >
    <!-- Drag Handle -->
    <div class="widget-drag-handle" @mousedown="onMouseDown">
      <div class="drag-pill"></div>
    </div>
    
    <!-- Floating Close Button -->
    <button class="widget-close" @click.stop="remove" aria-label="Close widget">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    
    <!-- Widget Content -->
    <div class="widget-body">
      <component :is="Component" v-if="Component" :data="widget.data" />
      <div v-else class="widget-error">Unknown widget type: {{ widget.type }}</div>
    </div>
    
    <!-- Resize Handle -->
    <div class="widget-resize-handle" @mousedown="onResizeDown">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="21" y1="21" x2="12" y2="21"></line>
        <line x1="21" y1="12" x2="21" y2="21"></line>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.widget {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(20, 20, 22, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: visible; /* Need visible for floating close button if it overhangs, but content should clip */
  will-change: transform, width, height;
  z-index: 10;
  transition: box-shadow 0.2s ease;
  user-select: none;
  min-width: min-content;
  min-height: min-content;
}

/* Light mode support */
html.light .widget {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.widget:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

html.light .widget:hover {
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.widget.dragging {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
  z-index: 100;
}

.widget.resizing {
  z-index: 100;
}

.widget-body {
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 15px; /* slightly smaller than outer to fit inside border cleanly */
  overflow: hidden; /* Clips the inner content */
  display: flex;
  flex-direction: column;
}

.widget-error {
  padding: 16px;
  color: var(--danger);
  font-size: 14px;
  text-align: center;
  margin: auto;
}

/* Drag Handle */
.widget-drag-handle {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 6px;
  cursor: grab;
  z-index: 20;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.widget-drag-handle:active {
  cursor: grabbing;
}

.widget.group:hover .widget-drag-handle, .widget.dragging .widget-drag-handle {
  opacity: 1;
}

.drag-pill {
  width: 32px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  transition: background 0.2s ease;
}

html.light .drag-pill {
  background: rgba(0, 0, 0, 0.15);
}

.widget-drag-handle:hover .drag-pill {
  background: rgba(255, 255, 255, 0.4);
}

html.light .widget-drag-handle:hover .drag-pill {
  background: rgba(0, 0, 0, 0.3);
}

/* Floating Close Button */
.widget-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 20;
  cursor: pointer;
  backdrop-filter: blur(8px);
}

html.light .widget-close {
  background: rgba(255, 255, 255, 0.7);
  color: #000;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.widget.group:hover .widget-close, .widget.resizing .widget-close {
  opacity: 1;
  transform: scale(1);
}

.widget-close:hover {
  background: rgba(231, 76, 60, 0.8);
  border-color: transparent;
  transform: scale(1.1) !important;
}

html.light .widget-close:hover {
  background: rgba(231, 76, 60, 0.9);
  color: #fff;
}

/* Resize Handle */
.widget-resize-handle {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  color: rgba(255, 255, 255, 0.3);
  opacity: 0;
  transition: opacity 0.2s ease, color 0.2s ease;
  cursor: se-resize;
  z-index: 20;
  padding: 2px;
}

html.light .widget-resize-handle {
  color: rgba(0, 0, 0, 0.2);
}

.widget.group:hover .widget-resize-handle, .widget.resizing .widget-resize-handle {
  opacity: 1;
}

.widget-resize-handle:hover {
  color: rgba(255, 255, 255, 0.8);
}

html.light .widget-resize-handle:hover {
  color: rgba(0, 0, 0, 0.6);
}
</style>
