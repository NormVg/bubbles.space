<script setup lang="ts">
import CanvasWorkspace from './components/CanvasWorkspace.vue'
import HudOverlay from './components/HudOverlay.vue'
import { useUIStore } from './stores/ui'

const uiStore = useUIStore()
</script>

<template>
  <div class="desktop">
    <!-- Removed shift-back scale and blur so the canvas stays perfectly clear -->
    <div class="canvas-wrapper">
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
  background-color: var(--bg-base);
}

@keyframes canvas-reveal {
  0% {
    opacity: 0;
    transform: scale(0.96);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes hud-reveal {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.canvas-wrapper {
  width: 100%;
  height: 100%;
  background-color: var(--bg-base);
  animation: canvas-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  will-change: transform, opacity;
}

.hud-overlay {
  animation: hud-reveal 1s ease-out forwards;
  animation-delay: 0.15s;
  opacity: 0;
}
</style>
