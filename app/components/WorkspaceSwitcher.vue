<script setup lang="ts">
import { ref, markRaw, onMounted } from 'vue'
import MockMarkdownHandler from './MockMarkdownHandler.vue'

const activeWorkspace = ref('main')
const workspaces = ref([
  { id: 'main', label: 'Main' },
  { id: 'dev', label: 'Dev' },
  { id: 'design', label: 'Design' }
])

const isExpanded = ref(false)
const activeComponent = ref(markRaw(MockMarkdownHandler))

const slotWrapperRef = ref<HTMLElement | null>(null)
const slotInnerRef = ref<HTMLElement | null>(null)
const switcherBarRef = ref<HTMLElement | null>(null)

function setActive(id: string) {
  activeWorkspace.value = id
}

function toggleExpand() {
  if (!slotWrapperRef.value || !slotInnerRef.value || !switcherBarRef.value) return

  isExpanded.value = !isExpanded.value
  const wrapper = slotWrapperRef.value
  const inner = slotInnerRef.value
  const switcher = switcherBarRef.value

  // We measure the target dimensions of the inner content
  const targetH = inner.scrollHeight
  const targetW = inner.scrollWidth
  const baseW = switcher.offsetWidth // The width of just the tab bar

  // Animate the wrapper dimensions
  if (isExpanded.value) {
    wrapper.style.display = 'block'
    wrapper.animate(
      [
        { height: '0px', width: `${baseW}px`, opacity: 0 },
        { height: `${targetH}px`, width: `${Math.max(baseW, targetW)}px`, opacity: 1 }
      ],
      { duration: 250, easing: 'cubic-bezier(0.19, 1, 0.22, 1)', fill: 'forwards' }
    )
  } else {
    // When collapsing, we need to animate back to 0 height and base width
    const currentH = inner.scrollHeight
    const animation = wrapper.animate(
      [
        { height: `${currentH}px`, width: `${Math.max(baseW, targetW)}px`, opacity: 1 },
        { height: '0px', width: `${baseW}px`, opacity: 0 }
      ],
      { duration: 200, easing: 'cubic-bezier(0.55, 0.05, 0.68, 0.19)', fill: 'forwards' }
    )
    
    // Hide completely after animation to prevent tab-indexing invisible content
    animation.onfinish = () => {
      if (!isExpanded.value) {
        wrapper.style.display = 'none'
      }
    }
  }
}
</script>

<template>
  <div class="state-bar">
    <!-- Dynamic Slot Area (Above the tabs) -->
    <div class="dynamic-slot-wrapper" ref="slotWrapperRef" style="display: none; height: 0; overflow: hidden;">
      <div class="dynamic-slot-inner" ref="slotInnerRef">
        <component :is="activeComponent" v-if="activeComponent" />
      </div>
    </div>

    <div class="ws-switcher" ref="switcherBarRef">
      <!-- Workspace tabs -->
      <div
        v-for="workspace in workspaces"
        :key="workspace.id"
        class="ws-tab"
        :class="{ active: activeWorkspace === workspace.id }"
      >
        <button class="ws-btn" @click="setActive(workspace.id)">
          {{ workspace.label }}
        </button>
        <!-- Delete cross just for visual parity with screenshot -->
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

      <!-- Add workspace -->
      <button class="ws-add" title="New workspace">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>
      </button>

      <div class="ws-divider" />

      <!-- Expand -->
      <button class="ws-btn expand-btn" title="Expand" @click="toggleExpand">
        <div class="expand-icon" :class="{ 'is-expanded': isExpanded }">
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
        </div>
      </button>
    </div>
    
    <!-- Inverse curve for seamless blending into the border on top-left and bottom-right -->
    <div class="curve-top" />
    <div class="curve-right" />
  </div>
</template>

<style scoped>
.state-bar {
  position: absolute;
  bottom: 10px; /* Aligned with the inner edge of the 10px HUD frame */
  left: 10px;   /* Aligned with the inner edge of the 10px HUD frame */
  background: var(--bg-soft); /* Perfectly match the frame color */
  border-radius: 0 16px 0 0;
  user-select: none;
  overflow: visible;
  width: fit-content;
  /* NO box-shadow here; depth is applied via the HUD overlay's drop-shadow */
}

/* ─── Dynamic Slot ─────────────────────────────────────────────── */
.dynamic-slot-wrapper {
  /* Dimensions are controlled via JS animations */
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.dynamic-slot-inner {
  width: fit-content;
  height: max-content;
}

/* ─── HUD Curves ────────────────────────────────────────────────── */
.curve-top {
  position: absolute;
  top: -16px;
  left: 0;
  width: 16px;
  height: 16px;
  background: radial-gradient(circle at 100% 0, transparent 16px, var(--bg-soft) 16px);
  pointer-events: none;
}

.curve-right {
  position: absolute;
  bottom: 0;
  right: -16px;
  width: 16px;
  height: 16px;
  background: radial-gradient(circle at 100% 0, transparent 16px, var(--bg-soft) 16px);
  pointer-events: none;
}

/* ─── Switcher Inner Styling ────────────────────────────────────── */
.ws-switcher {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 10px;
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
  height: 26px;
  padding: 0 10px;
  background: none;
  border: none;
  border-radius: 7px;
  font-size: 12px;
  font-family: var(--font-sans);
  color: rgba(205, 198, 247, 0.4);
  cursor: pointer;
  transition: color 0.12s, transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
}

.ws-btn:active {
  transform: scale(0.96); /* Maya Design interaction rule */
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
  width: 16px;
  height: 16px;
  margin-right: 4px;
  background: none;
  border: none;
  border-radius: 4px;
  color: rgba(205, 198, 247, 0.3);
  cursor: pointer;
  transition: background 0.1s, color 0.1s, transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}

.ws-delete:hover {
  background: rgba(255, 80, 80, 0.15);
  color: #ff6b6b;
}

.ws-delete:active {
  transform: scale(0.9);
}

.ws-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: none;
  border: none;
  border-radius: 6px;
  color: rgba(205, 198, 247, 0.35);
  cursor: pointer;
  transition: background 0.12s, color 0.12s, transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-left: 2px;
}

.ws-add:hover {
  background: rgba(205, 198, 247, 0.1);
  color: #cdc6f7;
}

.ws-add:active {
  transform: scale(0.96);
}

.ws-divider {
  width: 1px;
  height: 16px;
  background: rgba(205, 198, 247, 0.12);
  margin: 0 4px;
}

.expand-btn {
  width: 26px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1); /* Maya spring-bounce */
}

.expand-icon.is-expanded {
  transform: rotate(180deg);
}
</style>
