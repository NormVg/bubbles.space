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
        <ChatInterface />
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUIStore } from '../stores/ui'
import { useLocalStorage } from '@vueuse/core'
import ChatInterface from './chat/ChatInterface.vue'

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

let resizeRaf: number | null = null

function doResize(e: MouseEvent) {
  if (!isResizing.value) return
  
  if (resizeRaf !== null) {
    cancelAnimationFrame(resizeRaf)
  }
  
  resizeRaf = requestAnimationFrame(() => {
    const newWidth = window.innerWidth - e.clientX

    // Clamp width to bounds (40vw min, 90vw max)
    const minW = window.innerWidth * 0.45
    const maxW = window.innerWidth * 0.65
    currentWidth.value = Math.max(minW, Math.min(maxW, newWidth))
    resizeRaf = null
  })
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
  z-index: 40;
  pointer-events: none; /* Clicks pass through to canvas when closed */
}

/* The wrapper no longer toggles pointer-events or width. 
   The inner panel handles its own pointer-events to prevent layout recalculation jitter. */

.drawer-backdrop {
  position: fixed;
  inset: 10px;
  z-index: 1;
  background: transparent;
  pointer-events: auto;
}

/* ─── Drawer Panel ──────────────────────────────────────── */
.right-drawer {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;

  /* Deep glassmorphism gradient aesthetic */
  background: var(--gradient-drawer);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border: none;
  border-radius: 16px;
  box-shadow: var(--widget-shadow);

  z-index: 2;
  display: flex;
  flex-direction: column;

  /* Hardware acceleration for buttery smooth animation */
  will-change: transform, opacity;
  transform: translateZ(0); /* Force layer creation */

  /* Closed State (Closing Animation Segment) */
  transform: translate3d(100%, 0, 0);
  opacity: 0;
  pointer-events: none; /* Crucial to prevent interaction when closed */
  
  /* Closing is fast and accelerates out of the screen */
  transition: transform 0.35s cubic-bezier(0.4, 0, 1, 1), 
              opacity 0.25s cubic-bezier(0.4, 0, 1, 1);
}

/* Open State (Opening Animation Segment) */
.right-drawer-wrapper.is-open .right-drawer {
  transform: translate3d(0, 0, 0);
  opacity: 1;
  pointer-events: auto; /* Enable interaction */

  /* Opening is a rich, highly-damped spring that decelerates beautifully */
  transition: transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), 
              opacity 0.5s ease-out;
}

/* Disable transition during drag for 1:1 mouse tracking */
.right-drawer.is-resizing {
  transition: none !important;
  will-change: width, transform; /* optimize while dragging */
}

/* ─── Resizer ────────────────────────────────────────────── */
.resizer {
  position: absolute;
  top: 0;
  left: -2px;
  width: 12px;
  height: 100%;
  cursor: ew-resize;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Closed state */
  opacity: 0;
  transition: opacity 0.2s ease-in;
}

.right-drawer-wrapper.is-open .resizer {
  /* Open state */
  opacity: 1;
  /* Segment 3: Fades in very late to add micro-interaction richness */
  transition: opacity 0.4s ease-out 0.4s;
}

.resizer-line {
  width: 2px;
  height: 32px;
  background: var(--glass-border);
  border-radius: 2px;
  transition: background 0.2s ease;
}

.resizer:hover .resizer-line,
.right-drawer.is-resizing .resizer-line {
  background: var(--text-muted);
}

/* ─── Drawer Content (Staggered Children) ───────────────────── */
.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 32px 32px 16px 32px;
}

/* Base Closed State for inner elements */
:deep(.chat-messages),
:deep(.chat-input-wrapper) {
  will-change: transform, opacity;
  opacity: 0;
  transform: translateX(20px);
  /* Segment 1 (Closing): Both elements fade/slide out quickly */
  transition: opacity 0.2s ease-in, 
              transform 0.2s ease-in;
}

/* Segment 2 (Opening): Chat messages slide in first */
.right-drawer-wrapper.is-open :deep(.chat-messages) {
  opacity: 1;
  transform: translateX(0);
  transition: transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, 
              opacity 0.55s ease-out 0.1s;
}

/* Segment 3 (Opening): Input box slides in distinctly after the messages */
.right-drawer-wrapper.is-open :deep(.chat-input-wrapper) {
  opacity: 1;
  transform: translateX(0);
  transition: transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.25s, 
              opacity 0.55s ease-out 0.2s;
}
</style>
