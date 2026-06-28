<script setup lang="ts">
import { useAppStore } from '~/stores/app'
const appStore = useAppStore()
</script>

<template>
  <div class="fixed-canvas">
    <div class="canvas-grid" :class="{ dark: appStore.theme === 'dark' }" />
    <div class="canvas-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.fixed-canvas {
  position: absolute;
  inset: 0;
  overflow: hidden;
  user-select: none;
  background-color: var(--chat-bg);
}

.canvas-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 24px 24px;
}

.canvas-grid.dark {
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
}

.canvas-content {
  position: absolute;
  inset: 0;
}
</style>
