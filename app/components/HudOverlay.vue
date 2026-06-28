<script setup lang="ts">
import WorkspaceSwitcher from './WorkspaceSwitcher.vue'
import BubblesAvatar from './BubblesAvatar.vue'
import QuickAccessBar from './QuickAccessBar.vue'
</script>

<template>
  <div class="hud-overlay">
    <!-- The 10px frame border all around the screen -->
    <div class="hud-frame" />
    
    <!-- Top Left: Avatar -->
    <BubblesAvatar />

    <!-- Bottom Left: Workspace Switcher -->
    <WorkspaceSwitcher />

    <!-- Bottom Right: Quick Access Bar -->
    <QuickAccessBar />
  </div>
</template>

<style scoped>
.hud-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 100;
  overflow: hidden; /* Prevent shadows from bleeding out of the window */
  
  filter: drop-shadow(0 0 24px rgba(0, 0, 0, 0.5));
}

.hud-frame {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border-radius: 6px; /* Subtle inner border radius */
  box-shadow: 0 0 0 20px var(--bg-soft); /* Fills the 10px gap and keeps outer corners square */
  pointer-events: none;
}

/* Make sure child interactive elements capture pointer events */
:deep(.state-bar),
:deep(.bubbles-avatar-hud),
:deep(.quick-access-hud) {
  pointer-events: auto;
}
</style>
