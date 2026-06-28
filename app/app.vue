<script setup lang="ts">
import CanvasWorkspace from './components/CanvasWorkspace.vue'
import HudOverlay from './components/HudOverlay.vue'
import { useUIStore } from './stores/ui'

const uiStore = useUIStore()
</script>

<template>
  <div class="desktop">
    <!-- Cinematic wrapper that scales down when drawer is open -->
    <div class="canvas-wrapper" :class="{ 'shift-back': uiStore.isRightDrawerOpen }">
      <CanvasWorkspace @canvas-click="() => {}" />
    </div>
    
    <!-- HUD stays crisp on top -->
    <HudOverlay />
  </div>
</template>

<style>
@import './assets/base.css';

#__nuxt {
  width: 100%;
  height: 100vh;
}

.desktop {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #000; /* Darker background so the scaled canvas looks good */
}

.canvas-wrapper {
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease;
  transform-origin: center;
  /* Match canvas base background */
  background-color: var(--bg-base);
}

.canvas-wrapper.shift-back {
  transform: scale(0.98);
  filter: blur(4px) brightness(0.6);
  border-radius: 12px;
  overflow: hidden;
}
</style>
