<script setup lang="ts">
import CanvasWorkspace from './components/CanvasWorkspace.vue'
import WorkspaceSwitcher from './components/WorkspaceSwitcher.vue'
import Taskbar from './components/Taskbar.vue'
</script>

<template>
  <div class="app-frame">
    <div class="app-shell">
      <CanvasWorkspace @canvas-click="() => {}" />
      <!-- Placed inside app-shell to seamlessly cut into the canvas -->
      <WorkspaceSwitcher />
    </div>
  </div>
</template>

<style>
@import './assets/base.css';

#__nuxt {
  width: 100%;
  height: 100vh;
}

.app-frame {
  width: 100%;
  height: 100vh;
  padding: 10px;
  background-color: var(--bg-soft);
  box-sizing: border-box;
  position: relative;
}

.app-shell {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 8px; /* Match Aura window inner shape on all corners */
  background-color: var(--bg-base);
  border: none; /* Removed all borders as requested */
  box-sizing: border-box;
}
</style>
