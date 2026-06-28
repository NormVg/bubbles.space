<template>
  <div class="quick-access-hud">
    <div class="curve-top" />
    <div class="quick-access-bar">
      
      <!-- Icon 1: Sidebar Layout -->
      <button class="qa-btn" title="Sidebar">
        <LucidePanelLeft class="icon" :size="16" :stroke-width="1.5" />
      </button>

      <!-- Separator -->
      <div class="separator" />
      
      <!-- Icon 2: Waveform -->
      <button class="qa-btn" title="Audio">
        <LucideAudioLines class="icon" :size="16" :stroke-width="1.5" />
      </button>

      <!-- Icon 3: Package/Box -->
      <button class="qa-btn" title="Packages">
        <LucidePackage class="icon" :size="16" :stroke-width="1.5" />
      </button>

      <!-- Separator -->
      <div class="separator" />

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
const uiStore = useUIStore()
</script>

<style scoped>
/* ─── HUD Wrapper Styling ──────────────────────────────────────── */
.quick-access-hud {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: var(--bg-soft);
  border-radius: 18px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Inverted curve for top-left touching the right frame */
.curve-top {
  position: absolute;
  top: -24px;
  right: 0;
  width: 24px;
  height: 24px;
  background: radial-gradient(circle at 0 0, transparent 24px, var(--bg-soft) 24px);
  pointer-events: none;
}

/* Inverted curve for bottom-left touching the bottom frame */
.curve-left {
  position: absolute;
  bottom: 0;
  left: -12px;
  width: 12px;
  height: 12px;
  background: radial-gradient(circle at 0 0, transparent 12px, var(--bg-soft) 12px);
  pointer-events: none;
}

/* ─── Bar Content Styling ──────────────────────────────────────── */
.quick-access-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px 12px 14px 12px;
}

.qa-btn {
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #7b7b8f; /* Specific muted purple-gray from reference */
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.qa-btn:hover {
  color: var(--text-primary);
}

.qa-btn:active {
  transform: scale(0.92);
}

.separator {
  width: 14px;
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 2px 0;
}
</style>
