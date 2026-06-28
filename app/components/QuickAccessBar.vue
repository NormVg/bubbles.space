<template>
  <div class="quick-access-hud">
    <div class="curve-top" />
    <div class="quick-access-bar">
      <button class="qa-btn" title="Search">
        <LucideSearch class="icon" :size="18" :stroke-width="1.5" />
      </button>
      <button class="qa-btn" title="Settings" @click="uiStore.toggleSettings">
        <LucideSettings class="icon" :size="18" :stroke-width="1.5" />
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
  /* Deep glassmorphism background */
  background: rgba(20, 20, 25, 0.4);
  backdrop-filter: blur(16px);
  border-radius: 16px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: -4px -4px 12px rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  border-left: 1px solid rgba(255, 255, 255, 0.04);
}

/* Inverted curve for top-left touching the right frame */
.curve-top {
  position: absolute;
  top: -16px;
  right: 0;
  width: 16px;
  height: 16px;
  background: radial-gradient(circle at 0 0, transparent 16px, rgba(20, 20, 25, 0.4) 16px);
  backdrop-filter: blur(16px);
  pointer-events: none;
}

/* Inverted curve for bottom-left touching the bottom frame */
.curve-left {
  position: absolute;
  bottom: 0;
  left: -16px;
  width: 16px;
  height: 16px;
  background: radial-gradient(circle at 0 0, transparent 16px, rgba(20, 20, 25, 0.4) 16px);
  backdrop-filter: blur(16px);
  pointer-events: none;
}

/* ─── Bar Content Styling ──────────────────────────────────────── */
.quick-access-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px 12px;
}

.qa-btn {
  background: transparent;
  border: none;
  border-radius: 12px;
  width: 36px;
  height: 36px;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* Magnetic hover effect simulation */
.qa-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.qa-btn:active {
  transform: translateY(1px) scale(0.92);
  background: rgba(255, 255, 255, 0.04);
}
</style>
