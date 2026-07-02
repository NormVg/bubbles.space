<script setup lang="ts">
import { ref, computed, onUnmounted, watch, onMounted, nextTick } from 'vue'
import { useWidgetStore } from '../../stores/widgets'
import { useChatStore } from '../../stores/chat'
import { WidgetRegistry } from './WidgetRegistry'

const props = defineProps<{
  id: string
}>()

const store = useWidgetStore()
const chatStore = useChatStore()
const widget = computed(() => store.widgets.find(w => w.id === props.id))
const containerEl = ref<HTMLElement | null>(null)

// Edit State
const isEditing = ref(false)

const toggleEdit = () => {
  isEditing.value = !isEditing.value
}

const handleSave = (newData: Record<string, any>) => {
  store.updateWidget(props.id, { data: { ...widget.value?.data, ...newData } })
  isEditing.value = false
}

const isContextAdded = ref(false)

const addAsContext = () => {
  if (!widget.value) return
  
  const w = widget.value
  let textContent = ''
  
  if (w.type === 'markdown') {
    textContent = w.data.content || ''
  } else if (w.type === 'mermaid') {
    textContent = `\`\`\`mermaid\n${w.data.chart || ''}\n\`\`\``
  } else {
    textContent = JSON.stringify(w.data)
  }
  
  chatStore.addWidgetContext({
    id: w.id,
    label: w.title || w.type,
    text: textContent
  })
  
  // Visual feedback
  isContextAdded.value = true
  setTimeout(() => {
    isContextAdded.value = false
  }, 2000)
}

// Drag State
const isDragging = ref(false)
const dragStart = { x: 0, y: 0, wx: 0, wy: 0, w: 0, h: 0, scale: 1 }
let currentX = 0
let currentY = 0

// Resize State
const isResizing = ref(false)
const resizeStart = { x: 0, y: 0, w: 0, h: 0, wx: 0, wy: 0, scale: 1 }
let currentW = 0
let currentH = 0

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
  
  const rect = containerEl.value.getBoundingClientRect()
  const scale = rect.width / containerEl.value.offsetWidth

  dragStart.x = e.clientX
  dragStart.y = e.clientY
  dragStart.wx = widget.value.x
  dragStart.wy = widget.value.y
  dragStart.w = widget.value.width
  dragStart.h = widget.value.height
  dragStart.scale = scale || 1
  
  currentX = dragStart.wx
  currentY = dragStart.wy

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

let dragRaf: number | null = null
let latestDragX = 0
let latestDragY = 0

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !containerEl.value || !widget.value) return
  
  latestDragX = e.clientX
  latestDragY = e.clientY
  
  if (dragRaf) return
  
  dragRaf = requestAnimationFrame(() => {
    dragRaf = null
    if (!containerEl.value) return
  
  const dx = (latestDragX - dragStart.x) / dragStart.scale
  const dy = (latestDragY - dragStart.y) / dragStart.scale
  
  let newX = dragStart.wx + dx
  let newY = dragStart.wy + dy
  
  const canvasWidth = 2560
  const canvasHeight = 1440
  
    currentX = Math.max(0, Math.min(newX, canvasWidth - dragStart.w))
    currentY = Math.max(0, Math.min(newY, canvasHeight - dragStart.h))
    
    // Direct DOM Bypass - skipping Vue Reactivity for 60fps drag
    containerEl.value.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
  })
}

const onMouseUp = () => {
  if (!isDragging.value) return
  isDragging.value = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  
  store.updateWidget(props.id, {
    x: currentX,
    y: currentY
  })
}

// Resizing Logic
const onResizeDown = (e: MouseEvent) => {
  if (!widget.value || !containerEl.value) return
  e.preventDefault()
  e.stopPropagation()
  
  isResizing.value = true
  
  const rect = containerEl.value.getBoundingClientRect()
  const scale = rect.width / containerEl.value.offsetWidth

  resizeStart.x = e.clientX
  resizeStart.y = e.clientY
  resizeStart.w = widget.value.width
  resizeStart.h = widget.value.height
  resizeStart.wx = widget.value.x
  resizeStart.wy = widget.value.y
  resizeStart.scale = scale || 1
  
  currentW = resizeStart.w
  currentH = resizeStart.h
  
  window.addEventListener('mousemove', onResizeMove)
  window.addEventListener('mouseup', onResizeUp)
}

let resizeRaf: number | null = null
let latestResizeX = 0
let latestResizeY = 0

const onResizeMove = (e: MouseEvent) => {
  if (!isResizing.value || !containerEl.value || !widget.value) return
  
  latestResizeX = e.clientX
  latestResizeY = e.clientY
  
  if (resizeRaf) return
  
  resizeRaf = requestAnimationFrame(() => {
    resizeRaf = null
    if (!containerEl.value) return
  
  const dx = (latestResizeX - resizeStart.x) / resizeStart.scale
  const dy = (latestResizeY - resizeStart.y) / resizeStart.scale
  
  const minWidth = 200
  const minHeight = 150
  
  const canvasWidth = 2560
  const canvasHeight = 1440
  
  let newW = Math.max(minWidth, resizeStart.w + dx)
  let newH = Math.max(minHeight, resizeStart.h + dy)
  
  // Ensure we don't resize beyond canvas right/bottom edges
  newW = Math.min(newW, canvasWidth - resizeStart.wx)
  newH = Math.min(newH, canvasHeight - resizeStart.wy)
  
    currentW = newW
    currentH = newH
    
    // Direct DOM Bypass
    containerEl.value.style.width = `${currentW}px`
    containerEl.value.style.height = `${currentH}px`
    containerEl.value.style.containIntrinsicSize = `${currentW}px ${currentH}px`
  })
}

const onResizeUp = () => {
  if (!isResizing.value) return
  isResizing.value = false
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup', onResizeUp)
  
  store.updateWidget(props.id, {
    width: currentW,
    height: currentH
  })
}

const Component = computed(() => {
  if (!widget.value) return null
  return WidgetRegistry[widget.value.type] || null
})

const remove = () => {
  store.removeWidget(props.id)
}

// Transfer Logic
const showTransferMenu = ref(false)
const toggleTransferMenu = () => {
  showTransferMenu.value = !showTransferMenu.value
}

const otherWorkspaces = computed(() => {
  return store.workspaces.filter(w => w.id !== store.activeWorkspaceId)
})

const moveToWorkspace = (targetId: string) => {
  store.moveWidgetToWorkspace(props.id, targetId)
  showTransferMenu.value = false
}

const closeTransferMenu = () => {
  if (showTransferMenu.value) showTransferMenu.value = false
}

// Sync from store to DOM when not dragging/resizing
const syncDOM = () => {
  if (!widget.value || !containerEl.value) return
  
  if (!isDragging.value) {
    currentX = widget.value.x
    currentY = widget.value.y
    containerEl.value.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
  }
  
  if (!isResizing.value) {
    currentW = widget.value.width
    currentH = widget.value.height
    containerEl.value.style.width = `${currentW}px`
    containerEl.value.style.height = `${currentH}px`
    containerEl.value.style.containIntrinsicSize = `${currentW}px ${currentH}px`
  }
}

onMounted(() => {
  window.addEventListener('click', closeTransferMenu)
  syncDOM()
})

onUnmounted(() => {
  window.removeEventListener('click', closeTransferMenu)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup', onResizeUp)
})

watch(() => widget.value, () => {
  syncDOM()
}, { deep: true })

</script>

<template>
  <div
    v-if="widget"
    ref="containerEl"
    class="widget group"
    :class="{ dragging: isDragging, resizing: isResizing, editing: isEditing }"
  >
    <!-- Drag Handle & Title -->
    <div class="widget-drag-handle" @mousedown="onMouseDown">
      <div class="drag-pill"></div>
      <div v-if="widget.title" class="widget-title">{{ widget.title }}</div>
    </div>
    
    <!-- Floating Action Buttons -->
    <div class="widget-actions">
      <!-- Add as Context -->
      <button class="widget-action-btn" :class="{ success: isContextAdded }" @click.stop="addAsContext" aria-label="Add to chat context" title="Add to chat">
        <svg v-if="!isContextAdded" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>
      
      <!-- Edit Toggle -->
      <button class="widget-action-btn" :class="{ active: isEditing }" @click.stop="toggleEdit" aria-label="Edit widget" title="Edit">
        <svg v-if="!isEditing" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>

      <!-- Transfer -->
      <div class="transfer-dropdown-container">
        <button class="widget-action-btn" :class="{ active: showTransferMenu }" @click.stop="toggleTransferMenu" aria-label="Transfer widget" title="Transfer to Workspace">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </button>
        
        <Transition name="fade-pop">
          <div v-if="showTransferMenu" class="transfer-menu" @click.stop>
            <div class="transfer-menu-header">Send to Workspace</div>
            <div class="transfer-menu-list">
              <button
                v-for="ws in otherWorkspaces"
                :key="ws.id"
                class="transfer-menu-item"
                @click.stop="moveToWorkspace(ws.id)"
              >
                {{ ws.label }}
              </button>
              <div v-if="otherWorkspaces.length === 0" class="transfer-menu-empty">
                No other workspaces available
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Archive -->
      <button class="widget-action-btn" @click.stop="store.archiveWidget(props.id)" aria-label="Archive widget" title="Archive">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="21 8 21 21 3 21 3 8"></polyline>
          <rect x="1" y="3" width="22" height="5"></rect>
          <line x1="10" y1="12" x2="14" y2="12"></line>
        </svg>
      </button>
      
      <!-- Close -->
      <button class="widget-action-btn widget-action-close" @click.stop="remove" aria-label="Close widget" title="Close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <!-- Widget Content -->
    <div class="widget-body" v-memo="[widget.data, widget.type, isEditing, widget.width, widget.height]">
      <component :is="Component" v-if="Component" :data="widget.data" :is-editing="isEditing" @save="handleSave" />
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
  background: rgba(20, 20, 22, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: visible; /* Need visible for floating close button if it overhangs, but content should clip */
  z-index: 10;
  transition: box-shadow 0.2s ease;
  user-select: none;
  min-width: min-content;
  min-height: min-content;
  contain: layout style;
  content-visibility: auto;
}

/* Light mode support */
html.light .widget {
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
}

.widget:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

html.light .widget:hover {
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
}

.widget.dragging {
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.25);
  z-index: 100;
  will-change: transform;
}

.widget.resizing {
  z-index: 100;
  will-change: width, height;
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

/* Drag Handle & Title */
.widget-drag-handle {
  position: relative;
  width: 100%;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 6px;
  cursor: grab;
  z-index: 20;
}

.widget-drag-handle:active {
  cursor: grabbing;
}

.drag-pill {
  width: 32px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  transition: background 0.2s ease, opacity 0.2s ease;
  opacity: 0;
}

html.light .drag-pill {
  background: rgba(0, 0, 0, 0.15);
}

.widget.group:hover .drag-pill, .widget.dragging .drag-pill {
  opacity: 1;
}

.widget-drag-handle:hover .drag-pill {
  background: rgba(255, 255, 255, 0.4);
}

html.light .widget-drag-handle:hover .drag-pill {
  background: rgba(0, 0, 0, 0.3);
}

.widget-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  margin-top: 4px;
  opacity: 0.6;
  pointer-events: none;
}


/* Floating Action Buttons */
.widget-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  z-index: 20;
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.widget.group:hover .widget-actions,
.widget.editing .widget-actions {
  opacity: 1;
  transform: translateY(0);
}

.widget-action-btn {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: all 0.15s ease;
}

html.light .widget-action-btn {
  background: rgba(255, 255, 255, 0.7);
  color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.widget-action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  transform: scale(1.08);
}

html.light .widget-action-btn:hover {
  background: rgba(0, 0, 0, 0.08);
  color: #000;
}

.widget-action-btn.active {
  background: var(--accent);
  color: var(--accent-foreground);
  border-color: transparent;
}

.widget-action-btn.success {
  background: rgba(46, 204, 113, 0.9);
  color: #fff;
  border-color: transparent;
  transform: scale(1.08);
}

.widget-action-close:hover {
  background: rgba(231, 76, 60, 0.8);
  color: #fff;
  border-color: transparent;
}

html.light .widget-action-close:hover {
  background: rgba(231, 76, 60, 0.9);
  color: #fff;
}

/* Transfer Menu */
.transfer-dropdown-container {
  position: relative;
  display: flex;
}

.transfer-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 180px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  padding: 6px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

html.light .transfer-menu {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.transfer-menu-header {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  padding: 6px 8px;
  margin-bottom: 2px;
}

.transfer-menu-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.transfer-menu-item {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 13px;
  padding: 8px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.transfer-menu-item:hover {
  background: var(--accent);
  color: var(--accent-foreground);
}

.transfer-menu-empty {
  font-size: 12px;
  color: var(--text-muted);
  padding: 8px;
  text-align: center;
  font-style: italic;
}

.fade-pop-enter-active,
.fade-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: top right;
}

.fade-pop-enter-from,
.fade-pop-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
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

/* Widget Animations from CanvasWorkspace TransitionGroup */
.widget.widget-anim-enter-active,
.widget.widget-anim-leave-active {
  transition: opacity 0.25s cubic-bezier(0.2, 0, 0, 1), scale 0.25s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease;
}

.widget.widget-anim-enter-from,
.widget.widget-anim-leave-to {
  opacity: 0;
  scale: 0.96;
}

.widget.widget-anim-leave-active {
  pointer-events: none;
}
</style>
