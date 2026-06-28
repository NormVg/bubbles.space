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

.canvas-wrapper {
  width: 100%;
  height: 100%;
  background-color: var(--bg-base);
}
</style>
