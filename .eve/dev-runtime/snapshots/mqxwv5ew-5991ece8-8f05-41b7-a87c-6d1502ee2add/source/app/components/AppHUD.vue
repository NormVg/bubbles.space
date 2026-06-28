<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const activeWorkspace = ref('main')
const workspaces = ref([
  { id: 'main', label: 'Main' },
  { id: 'dev', label: 'Dev' },
  { id: 'design', label: 'Design' }
])

function setActive(id: string) {
  activeWorkspace.value = id
}

// We need to know the width of the switcher bulge to properly size the bottom frame
const switcherRef = ref<HTMLElement | null>(null)
const switcherWidth = ref(300)
const switcherHeight = ref(50)

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (switcherRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        switcherWidth.value = entry.contentRect.width
        switcherHeight.value = entry.contentRect.height
      }
    })
    resizeObserver.observe(switcherRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

</script>

<template>
  <div class="hud-layer">
    <div class="hud-container">
      
      <!-- The 4 edge frames -->
      <div class="frame-top" />
      <div class="frame-right" />
      <div class="frame-bottom" :style="{ left: `${switcherWidth}px` }" />
      <div class="frame-left" :style="{ bottom: `${switcherHeight}px` }" />

      <!-- The Switcher Bulge (Bottom Left) -->
      <div class="switcher-bulge" ref="switcherRef">
        <!-- Inner switcher UI -->
        <div class="ws-switcher">
          <div
            v-for="workspace in workspaces"
            :key="workspace.id"
            class="ws-tab"
            :class="{ active: activeWorkspace === workspace.id }"
          >
            <button class="ws-btn" @click="setActive(workspace.id)">
              {{ workspace.label }}
            </button>
            <button
              v-if="activeWorkspace === workspace.id"
              class="ws-delete"
              title="Delete workspace"
            >
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                <path
                  d="M2 2l6 6M8 2l-6 6"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>

          <button class="ws-add" title="New workspace">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
          </button>

          <div class="ws-divider" />

          <button class="ws-btn expand-btn" title="Expand">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>
        
        <!-- Inverted Curves embedded directly within the bulge layout to follow it precisely -->
        <div class="curve-top" />
        <div class="curve-right" />
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 
  The outer layer covers the screen but allows clicks to pass through 
  down to the canvas unless they hit a pointer-events: auto element.
*/
.hud-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 100;
  overflow: hidden; /* Prevent shadows from casting outside the window */
}

/* 
  The container groups all the opaque elements.
  Applying drop-shadow here traces the exact continuous union of all the shapes inside!
*/
.hud-container {
  position: absolute;
  inset: 0;
  /* 
    1st Shadow: The thin 1px translucent border tracing the inner edge 
    2nd Shadow: The deep inner shadow casting onto the canvas
  */
  filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.15)) drop-shadow(0 0 20px rgba(0, 0, 0, 0.6));
}

/* ─── Frame Edges (Solid var(--bg-soft)) ─── */
.frame-top {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 10px;
  background: var(--bg-soft);
}

.frame-right {
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: 10px;
  background: var(--bg-soft);
}

.frame-bottom {
  position: absolute;
  bottom: 0; right: 0;
  height: 10px;
  background: var(--bg-soft);
}

.frame-left {
  position: absolute;
  top: 0; left: 0;
  width: 10px;
  background: var(--bg-soft);
}

/* ─── Switcher Bulge (Bottom Left) ─── */
.switcher-bulge {
  position: absolute;
  bottom: 0;
  left: 0;
  background: var(--bg-soft);
  border-radius: 0 20px 0 0;
  pointer-events: auto; /* Make UI clickable */
  display: flex;
}

/* 
  Curves using simple radial-gradients.
  The transparent area reveals the canvas. 
  The solid area connects the bulge to the frames.
*/
.curve-top {
  position: absolute;
  bottom: 100%; /* Sits exactly on top of the bulge */
  left: 0; /* Flush with the left edge of the screen */
  width: 26px; /* 10px for the frame width + 16px curve radius */
  height: 16px;
  /* Draw solid color in the bottom-left, transparent everywhere else */
  /* We shift the circle horizontally by 10px to account for the frame underneath */
  background: radial-gradient(circle at 100% 0, transparent 16px, var(--bg-soft) 16px);
}

.curve-right {
  position: absolute;
  bottom: 0; /* Flush with the bottom of the screen */
  left: 100%; /* Sits exactly to the right of the bulge */
  width: 16px;
  height: 26px; /* 10px for the frame height + 16px curve radius */
  /* Draw solid color in the bottom-left, transparent everywhere else */
  background: radial-gradient(circle at 100% 0, transparent 16px, var(--bg-soft) 16px);
}

/* ─── Switcher UI (Inner Elements) ─── */
.ws-switcher {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  /* Add extra padding on left and bottom to account for the frame thickness visually */
  padding-left: 20px; 
  padding-bottom: 18px;
}

.ws-tab {
  display: flex;
  align-items: center;
  border-radius: 7px;
  transition: background 0.12s;
}

.ws-tab.active {
  background: rgba(205, 198, 247, 0.1);
}

.ws-btn {
  height: 32px;
  padding: 0 12px;
  background: none;
  border: none;
  border-radius: 7px;
  font-size: 14px;
  font-family: var(--font-sans);
  color: rgba(205, 198, 247, 0.4);
  cursor: pointer;
  transition: color 0.12s;
  white-space: nowrap;
}

.ws-tab:hover .ws-btn,
.ws-tab.active .ws-btn {
  color: #cdc6f7;
}

.ws-tab:not(.active):hover {
  background: rgba(205, 198, 247, 0.07);
}

.ws-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 6px;
  background: none;
  border: none;
  border-radius: 4px;
  color: rgba(205, 198, 247, 0.3);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
  flex-shrink: 0;
}

.ws-delete:hover {
  background: rgba(255, 80, 80, 0.15);
  color: #ff6b6b;
}

.ws-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: none;
  border: none;
  border-radius: 6px;
  color: rgba(205, 198, 247, 0.35);
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  margin-left: 4px;
}

.ws-add:hover {
  background: rgba(205, 198, 247, 0.1);
  color: #cdc6f7;
}

.ws-divider {
  width: 1px;
  height: 18px;
  background: rgba(205, 198, 247, 0.12);
  margin: 0 6px;
}

.expand-btn {
  width: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
