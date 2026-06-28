<template>
  <div class="right-drawer-wrapper" :class="{ 'is-open': uiStore.isRightDrawerOpen }">
    <!-- Optional invisible backdrop to close when clicking outside (on canvas) -->
    <div 
      class="drawer-backdrop" 
      v-if="uiStore.isRightDrawerOpen" 
      @click="uiStore.closeRightDrawer"
    ></div>

    <!-- The actual drawer panel -->
    <aside 
      class="right-drawer" 
      :style="{ width: currentWidth + 'px' }" 
      :class="{ 'is-resizing': isResizing }"
    >
      <!-- Resizer handle -->
      <div class="resizer" @mousedown.prevent="startResize">
        <div class="resizer-line"></div>
      </div>

      <div class="drawer-content">
        <div class="drawer-header">
          <h2 class="drawer-title">Sidebar Panel</h2>
          <p class="drawer-subtitle">Dynamic Content Area</p>
        </div>

        <div class="drawer-body">
          <div class="empty-state">
            <LucideLayoutTemplate :size="32" class="empty-icon" />
            <p>Select a component to view</p>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUIStore } from '../stores/ui'
import { useLocalStorage } from '@vueuse/core'

const uiStore = useUIStore()

// This handles the persistent saved value
const drawerWidth = useLocalStorage('bubbles-drawer-width', 400)

// This handles the visual width, preventing 60fps local storage writes (lag)
const currentWidth = ref(drawerWidth.value)
watch(drawerWidth, (newVal) => {
  if (!isResizing.value) currentWidth.value = newVal
})

const isResizing = ref(false)

function startResize(e: MouseEvent) {
  isResizing.value = true
  document.body.style.cursor = 'ew-resize'
  window.addEventListener('mousemove', doResize)
  window.addEventListener('mouseup', endResize)
}

function doResize(e: MouseEvent) {
  if (!isResizing.value) return
  const newWidth = window.innerWidth - e.clientX
  
  // Clamp width to bounds (40vw min, 90vw max)
  const minW = window.innerWidth * 0.4
  const maxW = window.innerWidth * 0.9
  currentWidth.value = Math.max(minW, Math.min(maxW, newWidth))
}

function endResize() {
  isResizing.value = false
  document.body.style.cursor = ''
  
  // Only write to localStorage ONCE at the end of the drag to prevent extreme lag
  drawerWidth.value = currentWidth.value

  window.removeEventListener('mousemove', doResize)
  window.removeEventListener('mouseup', endResize)
}
</script>

<style scoped>
/* ─── Wrapper & Backdrop ──────────────────────────────────────── */
.right-drawer-wrapper {
  position: absolute;
  top: 10px;
  right: 10px;
  bottom: 10px;
  width: 0;
  z-index: 50; 
  pointer-events: none;
}

.right-drawer-wrapper.is-open {
  width: auto;
  pointer-events: auto;
}

.drawer-backdrop {
  position: fixed;
  inset: 10px;
  z-index: 1;
  background: transparent;
}

/* ─── Drawer Panel ──────────────────────────────────────── */
.right-drawer {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  
  /* Highly translucent frosted glass aesthetic so canvas is clearly visible */
  background: rgba(20, 20, 25, 0.75);
  backdrop-filter: blur(48px);
  -webkit-backdrop-filter: blur(48px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-right: none;
  border-radius: 16px 0 0 16px;
  box-shadow: -12px 0 32px rgba(0, 0, 0, 0.3), inset 1px 0 0 rgba(255, 255, 255, 0.05);
  
  z-index: 2;
  display: flex;
  flex-direction: column;

  /* Smooth slide out from border, no bounce */
  transform: translateX(100%);
  opacity: 0;
  transition: transform 0.4s ease-out, opacity 0.3s ease-out;
}

/* Open State */
.right-drawer-wrapper.is-open .right-drawer {
  transform: translateX(0);
  opacity: 1;
}

/* Disable transition during drag for 1:1 mouse tracking */
.right-drawer.is-resizing {
  transition: none !important;
}

/* ─── Resizer ────────────────────────────────────────────── */
.resizer {
  position: absolute;
  top: 0;
  left: -2px; /* Slight overflow to make grabbing easier */
  width: 12px;
  height: 100%;
  cursor: ew-resize;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resizer-line {
  width: 2px;
  height: 32px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  transition: background 0.2s ease;
}

.resizer:hover .resizer-line,
.right-drawer.is-resizing .resizer-line {
  background: rgba(255, 255, 255, 0.5);
}

/* ─── Drawer Content (Staggered Animations) ────────────────────── */
.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 32px;
  /* Use padding-left so it doesn't overlap the resizer */
  padding-left: 40px;
  opacity: 0;
  transform: translateX(10px);
  transition: opacity 0.3s ease-out, transform 0.4s ease-out;
  overflow: hidden;
}

.right-drawer-wrapper.is-open .drawer-content {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 0.1s; 
}

.drawer-header {
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(-5px);
  transition: opacity 0.3s ease-out 0.15s, transform 0.4s ease-out 0.15s;
}

.right-drawer-wrapper.is-open .drawer-header {
  opacity: 1;
  transform: translateY(0);
}

.drawer-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.drawer-subtitle {
  font-size: 14px;
  color: var(--text-muted);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s ease-out 0.2s, transform 0.5s ease-out 0.2s;
}

.right-drawer-wrapper.is-open .drawer-body {
  opacity: 1;
  transform: translateY(0);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  gap: 16px;
  opacity: 0.5;
}

.empty-icon {
  color: var(--text-secondary);
}
</style>
