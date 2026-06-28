<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useWorkspaceStore } from '~/stores/workspace'

const wsStore = useWorkspaceStore()
const MIN_W = 350
const MAX_W = 800
const panelWidth = ref(400)
const isResizing = ref(false)

function startResize(e: MouseEvent) {
  if (!wsStore.sidePanelOpen) return
  e.preventDefault()
  isResizing.value = true
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

function doResize(e: MouseEvent) {
  if (!isResizing.value) return
  const w = window.innerWidth - e.clientX
  panelWidth.value = Math.min(MAX_W, Math.max(MIN_W, w))
}

function endResize() {
  if (!isResizing.value) return
  isResizing.value = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

onMounted(() => {
  window.addEventListener('mousemove', doResize)
  window.addEventListener('mouseup', endResize)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', doResize)
  window.removeEventListener('mouseup', endResize)
})
</script>

<template>
  <div class="side-panel" :class="{ closed: !wsStore.sidePanelOpen }" :style="{ width: panelWidth + 'px' }">
    <div class="resize-handle" @mousedown="startResize" />
    <div class="panel-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.side-panel {
  position: fixed;
  top: 16px;
  right: 16px;
  bottom: 80px; /* Leave space for taskbar if needed, or 16px if taskbar is floating */
  background: var(--chat-bg);
  backdrop-filter: blur(28px) saturate(1.4);
  -webkit-backdrop-filter: blur(28px) saturate(1.4);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow:
    -8px 8px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow: hidden;
  transform: translateX(0);
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s ease;
  opacity: 1;
}

html.dark .side-panel {
  box-shadow:
    -8px 8px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.side-panel.closed {
  transform: translateX(calc(100% + 32px));
  opacity: 0;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  top: 0;
  left: -4px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  z-index: 10;
}

.resize-handle:hover {
  background: var(--border-color);
  opacity: 0.5;
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  padding: 1rem;
}
</style>
