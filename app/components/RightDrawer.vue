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

function clampDrawerWidth(width: number) {
  if (typeof window === 'undefined') return width

  // User requested 45% to 65% range
  const minimumWidth = window.innerWidth * 0.45
  const maximumWidth = window.innerWidth * 0.65

  return Math.max(minimumWidth, Math.min(maximumWidth, width))
}

// This handles the persistent saved value
const drawerWidth = useLocalStorage('bubbles-chat-width-v3', typeof window !== 'undefined' ? window.innerWidth * 0.5 : 760)

// This handles the visual width, preventing 60fps local storage writes (lag)
const currentWidth = ref(clampDrawerWidth(drawerWidth.value))
watch(drawerWidth, (newVal) => {
  if (!isResizing.value) currentWidth.value = clampDrawerWidth(newVal)
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
    // Reverse the calculation since dragging left increases width from the right side
    const newWidth = window.innerWidth - e.clientX - 10 // Account for right-drawer-wrapper right: 10px offset

    currentWidth.value = clampDrawerWidth(newWidth)
    resizeRaf = null
  })
}

function endResize() {
  isResizing.value = false
  document.body.style.cursor = ''

  // Only write to localStorage ONCE at the end of the drag to prevent extreme lag
  drawerWidth.value = clampDrawerWidth(currentWidth.value)

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
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
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
  padding: 20px 32px 16px 32px;
  min-width: 0;
}

/* Base Closed State for inner elements */
:deep(.chat-session-header),
:deep(.chat-body),
:deep(.chat-input-wrapper) {
  will-change: transform, opacity;
  opacity: 0;
  transform: translateX(20px);
  /* Segment 1 (Closing): Both elements fade/slide out quickly */
  transition: opacity 0.2s ease-in, 
              transform 0.2s ease-in;
}

/* Segment 1 (Opening): Session context anchors the drawer first */
.right-drawer-wrapper.is-open :deep(.chat-session-header) {
  opacity: 1;
  transform: translateX(0);
  transition: transform 0.55s cubic-bezier(0.19, 1, 0.22, 1) 0.08s,
              opacity 0.35s ease-out 0.08s;
}

/* Segment 2 (Opening): Main content follows */
.right-drawer-wrapper.is-open :deep(.chat-body) {
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

@media (max-width: 760px) {
  .drawer-content {
    padding: 16px 16px 16px 16px;
  }
}
</style>
