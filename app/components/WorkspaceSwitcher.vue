<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import VoiceResponseView from './VoiceResponseView.vue'
import { useVoiceAgent } from '../composables/useVoiceAgent'
import { useAppAgent } from '../composables/useAppAgent'

const activeWorkspace = ref('main')
const workspaces = ref([
  { id: 'main', label: 'Main' },
  { id: 'dev', label: 'Dev' },
  { id: 'design', label: 'Design' }
])

const isExpanded = ref(false)

const voiceAgent = useVoiceAgent()
const eveAgent = useAppAgent()

const hasDynamicContent = computed(() => voiceAgent.voiceSessionActive.value)

watch(() => voiceAgent.voiceSessionActive.value, async (active) => {
  await nextTick()
  if (active && !isExpanded.value) {
    toggleExpand()
  } else if (!active && isExpanded.value) {
    toggleExpand()
  }
})

const slotWrapperRef = ref<HTMLElement | null>(null)
const slotInnerRef = ref<HTMLElement | null>(null)
const switcherBarRef = ref<HTMLElement | null>(null)

function setActive(id: string) {
  activeWorkspace.value = id
}

function toggleExpand() {
  if (!hasDynamicContent.value && !isExpanded.value) return
  if (!slotWrapperRef.value || !slotInnerRef.value || !switcherBarRef.value) return

  const wrapper = slotWrapperRef.value
  const inner = slotInnerRef.value
  const switcher = switcherBarRef.value

  const baseW = switcher.offsetWidth // The width of just the tab bar

  // Capture current state before cancelling animations to ensure smooth interruption
  const computed = window.getComputedStyle(wrapper)
  const isHidden = wrapper.style.display === 'none'
  const currentH = isHidden ? 0 : parseFloat(computed.height) || 0
  const currentW = isHidden ? baseW : parseFloat(computed.width) || baseW
  const currentOpacity = isHidden ? 0 : parseFloat(computed.opacity) || 0

  // Cancel any existing animations
  wrapper.getAnimations().forEach(a => a.cancel())
  inner.getAnimations().forEach(a => a.cancel())
  
  // Set inline styles to current to prepare for animation
  wrapper.style.height = `${currentH}px`
  wrapper.style.width = `${currentW}px`

  isExpanded.value = !isExpanded.value

  if (isExpanded.value) {
    // Make visible FIRST and set to auto to measure natural size
    wrapper.style.display = 'block'
    wrapper.style.height = 'auto'
    wrapper.style.width = 'max-content'
    wrapper.style.minWidth = `${baseW}px`
    
    const targetH = inner.scrollHeight
    const targetW = inner.scrollWidth

    // 1. Animate Wrapper (Dimensions)
    const wrapperAnim = wrapper.animate(
      [
        { height: `${currentH}px`, width: `${currentW}px` },
        { height: `${targetH}px`, width: `${Math.max(baseW, targetW)}px` }
      ],
      { duration: 400, easing: 'cubic-bezier(0.19, 1, 0.22, 1)', fill: 'forwards' }
    )
    
    // 2. Animate Inner Content (Fade + Slide up)
    const innerAnim = inner.animate(
      [
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0px)' }
      ],
      { duration: 350, delay: 50, easing: 'cubic-bezier(0.19, 1, 0.22, 1)', fill: 'forwards' }
    )
    
    wrapperAnim.onfinish = () => {
      if (isExpanded.value) {
        // We must cancel the animation so its 'forwards' fill doesn't override the auto height
        wrapperAnim.cancel()
        wrapper.style.height = 'auto'
        wrapper.style.width = 'max-content'
      }
    }
  } else {
    // When collapsing:
    // 1. Fade out inner content quickly
    inner.animate(
      [
        { opacity: 1, transform: 'translateY(0px)' },
        { opacity: 0, transform: 'translateY(5px)' }
      ],
      { duration: 150, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }
    )

    // 2. Shrink wrapper with a slight delay
    const wrapperAnim = wrapper.animate(
      [
        { height: `${currentH}px`, width: `${currentW}px` },
        { height: '0px', width: `${baseW}px` }
      ],
      { duration: 300, delay: 50, easing: 'cubic-bezier(0.19, 1, 0.22, 1)', fill: 'forwards' }
    )
    
    wrapperAnim.onfinish = () => {
      if (!isExpanded.value) {
        wrapperAnim.cancel()
        inner.getAnimations().forEach(a => a.cancel())
        wrapper.style.display = 'none'
        wrapper.style.height = '0'
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
        <VoiceResponseView v-if="voiceAgent.voiceSessionActive.value" />
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

      <div v-if="hasDynamicContent" class="ws-divider" />

      <!-- Expand -->
      <button v-if="hasDynamicContent" class="ws-btn expand-btn" title="Expand" @click="toggleExpand">
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
  background: var(--glass-bg); 
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 0 16px 0 0;
  user-select: none;
  overflow: visible;
  width: fit-content;
}

/* ─── Dynamic Slot ─────────────────────────────────────────────── */
.dynamic-slot-wrapper {
  /* Dimensions are controlled via JS animations */
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
  background: var(--gradient-cutout-right);
  backdrop-filter: blur(6px);
  pointer-events: none;
}

.curve-right {
  position: absolute;
  bottom: 0;
  right: -16px;
  width: 16px;
  height: 16px;
  background: var(--gradient-cutout-right);
  backdrop-filter: blur(6px);
  pointer-events: none;
}

/* ─── Switcher Inner Styling ────────────────────────────────────── */
.ws-switcher {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 10px;
  width: max-content; /* Ensure the tab row never stretches, so its offsetWidth is a reliable baseline */
}

.ws-tab {
  display: flex;
  align-items: center;
  border-radius: 7px;
  transition: background 0.12s;
}

.ws-tab.active {
  background: var(--hover-bg);
}

.ws-btn {
  height: 26px;
  padding: 0 10px;
  background: none;
  border: none;
  border-radius: 7px;
  font-size: 12px;
  font-family: var(--font-sans);
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.12s, transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
}

.ws-btn:active {
  transform: scale(0.96); /* Maya Design interaction rule */
}

.ws-tab:hover .ws-btn,
.ws-tab.active .ws-btn {
  color: var(--text-primary);
}

.ws-tab:not(.active):hover {
  background: var(--hover-bg);
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
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.1s, color 0.1s, transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}

.ws-delete:hover {
  background: rgba(255, 80, 80, 0.15);
  color: var(--danger);
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
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.12s, color 0.12s, transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-left: 2px;
}

.ws-add:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.ws-add:active {
  transform: scale(0.96);
}

.ws-divider {
  width: 1px;
  height: 16px;
  background: var(--glass-border);
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
