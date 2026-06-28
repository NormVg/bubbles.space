<script setup lang="ts">
import CanvasWorkspace from './components/CanvasWorkspace.vue'
import HudOverlay from './components/HudOverlay.vue'
</script>

<template>
  <div class="desktop">
    <CanvasWorkspace @canvas-click="() => {}" />
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
</style>
