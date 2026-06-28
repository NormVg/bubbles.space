<script setup lang="ts">
import CanvasWorkspace from './components/CanvasWorkspace.vue'
import AppHUD from './components/AppHUD.vue'
</script>

<template>
  <div class="app-root">
    <div class="app-canvas-container">
      <CanvasWorkspace @canvas-click="() => {}" />
    </div>
    
    <!-- The unified HUD component rendering the frames and Switcher with precise composited shadows -->
    <AppHUD />
  </div>
</template>

<style>
/* Make sure body takes up full height with no margins */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--bg-soft);
}

.app-root {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.app-canvas-container {
  position: absolute;
  /* 
    The canvas is clipped slightly inward to let the HUD edges cover it completely,
    ensuring no tiny subpixel gaps.
  */
  inset: 5px; 
  border-radius: 8px; /* Smooth corners for the canvas itself */
  background-color: var(--bg-base);
  overflow: hidden;
}
</style>
