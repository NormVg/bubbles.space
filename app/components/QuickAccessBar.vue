<template>
  <div class="quick-access-hud" :class="{ 'drawer-open': uiStore.isRightDrawerOpen }">
    <div class="curve-top" />
    <div class="quick-access-bar">
      
      <!-- Icon 1: Sidebar Layout -->
      <button 
        class="qa-btn sidebar-btn" 
        :class="{ active: uiStore.isRightDrawerOpen }"
        title="Sidebar" 
        @click="uiStore.toggleRightDrawer()"
      >
        <LucidePanelLeft class="icon" :size="16" :stroke-width="1.5" />
      </button>
      
      <!-- Icon 2: Waveform -->
      <button 
        class="qa-btn voice-btn" 
        :class="{ active: voiceAgent.isListening.value, listening: voiceAgent.isListening.value }"
        title="Voice Mode"
        @click="toggleVoice"
      >
        <div class="icon-container">
          <LucideAudioLines class="icon waveform-icon" :size="16" :stroke-width="1.5" />
          <LucideSquare class="icon stop-icon" :size="12" :stroke-width="2" color="var(--danger, #ff5050)" fill="var(--danger, #ff5050)" />
        </div>
        
        <!-- Ripple effect for detecting voice -->
        <span class="voice-ripple"></span>
        <span class="voice-ripple delay"></span>
      </button>

      <!-- Icon 3: Package/Box -->
      <button class="qa-btn" title="Packages">
        <LucidePackage class="icon" :size="16" :stroke-width="1.5" />
      </button>

      <!-- Icon 4: Settings -->
      <button class="qa-btn" title="Settings" @click="uiStore.toggleSettings">
        <LucideSettings class="icon" :size="16" :stroke-width="1.5" />
      </button>

    </div>
    <div class="curve-left" />
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '../stores/ui'
import { useVoiceAgent } from '../composables/useVoiceAgent'
import { LucidePanelLeft, LucideAudioLines, LucideSquare, LucidePackage, LucideSettings } from 'lucide-vue-next'

const uiStore = useUIStore()
const voiceAgent = useVoiceAgent()

const toggleVoice = async () => {
  if (voiceAgent.isListening.value) {
    await voiceAgent.stop()
  } else {
    await voiceAgent.start({ autoSend: true })
  }
}
</script>

<style scoped>
/* ─── HUD Wrapper Styling ──────────────────────────────────────── */
.quick-access-hud {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 44px; /* Fixed width for perfect curve math */
  background: var(--glass-bg);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 22px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100; /* Always stay above the RightDrawer */
  transition: background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease;
}

/* When the sidebar drawer is open, we make the Quick Access HUD transparent 
   so it seamlessly merges into the drawer's background without seams or overlapping blurs */
.quick-access-hud.drawer-open {
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  box-shadow: none;
}

/* Inverted curve for top-left touching the right frame */
.curve-top {
  position: absolute;
  top: -22px;
  right: 0;
  width: 22px;
  height: 22px;
  /* Perfect blending: matches the remaining width exactly (44 - 22 = 22) */
  background: var(--gradient-cutout);
  backdrop-filter: blur(6px);
  pointer-events: none;
}

/* Inverted curve for bottom-left touching the bottom frame */
.curve-left {
  position: absolute;
  bottom: 0;
  left: -16px;
  width: 16px;
  height: 16px;
  background: var(--gradient-cutout-small);
  backdrop-filter: blur(6px);
  pointer-events: none;
  transition: opacity 0.2s ease;
}

/* Hide the inverted cutouts when the drawer is open because the drawer is perfectly curved */
.quick-access-hud.drawer-open .curve-top,
.quick-access-hud.drawer-open .curve-left {
  opacity: 0;
}

/* ─── Bar Content Styling ──────────────────────────────────────── */
.quick-access-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 22px 0 16px 0; /* Horizontal padding removed, rely on fixed width & center alignment */
  width: 100%;
}

.qa-btn {
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  position: relative;
}

.qa-btn:hover {
  color: var(--text-primary);
  background: var(--hover-bg);
}

.qa-btn.active {
  color: var(--text-primary);
  background: var(--glass-border);
}

.qa-btn:active {
  transform: scale(0.92);
}

/* ─── Sidebar Animation ──────────────────────────────────────── */
.sidebar-btn.active .icon {
  animation: sidebar-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.sidebar-btn.active {
  background: var(--hover-bg);
  box-shadow: inset 0 0 0 1px var(--glass-border);
}

@keyframes sidebar-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); color: var(--accent); }
  100% { transform: scale(1); }
}

/* ─── Voice Button Animation ──────────────────────────────────────── */
.voice-btn {
  overflow: visible;
  z-index: 10;
}

.icon-container {
  position: relative;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.waveform-icon, .stop-icon {
  position: absolute;
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.waveform-icon {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.stop-icon {
  opacity: 0;
  transform: scale(0.5) rotate(-90deg);
}

.voice-btn.listening .waveform-icon {
  opacity: 0;
  transform: scale(0.5) rotate(90deg);
}

.voice-btn.listening .stop-icon {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

/* Detecting Voice Ripples */
.voice-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: var(--danger, #ff5050);
  border-radius: 8px;
  transform: translate(-50%, -50%) scale(1);
  opacity: 0;
  pointer-events: none;
  z-index: -1;
}

.voice-btn.listening .voice-ripple {
  animation: ripple 2s cubic-bezier(0.19, 1, 0.22, 1) infinite;
}

.voice-btn.listening .voice-ripple.delay {
  animation-delay: 1s;
}

@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.35;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.8);
    opacity: 0;
  }
}
</style>
