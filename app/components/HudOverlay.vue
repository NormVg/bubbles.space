<script setup lang="ts">
import WorkspaceSwitcher from './WorkspaceSwitcher.vue'
import BubblesAvatar from './BubblesAvatar.vue'
import QuickAccessBar from './QuickAccessBar.vue'
import SettingsModal from './SettingsModal.vue'
import RightDrawer from './RightDrawer.vue'
</script>

<template>
  <div class="hud-overlay">
    <!-- The 10px frame border all around the screen (using edges for blur support) -->
    <div class="hud-frame-edge edge-top" />
    <div class="hud-frame-edge edge-bottom" />
    <div class="hud-frame-edge edge-left" />
    <div class="hud-frame-edge edge-right" />
    
    <!-- Top Left: Avatar -->
    <div class="hud-avatar-wrapper">
      <BubblesAvatar :interactive="true" />
    </div>

    <!-- Bottom Left: Workspace Switcher -->
    <WorkspaceSwitcher />

    <!-- Right Drawer Overlay (behind QuickAccessBar via z-index) -->
    <ClientOnly>
      <RightDrawer />
    </ClientOnly>

    <!-- Bottom Right: Quick Access Bar -->
    <QuickAccessBar />

    <!-- Overlays -->
    <SettingsModal />
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
  
  /* Massive drop shadow to separate HUD from Canvas */
  filter: drop-shadow(var(--hud-shadow));
}

.hud-frame-edge {
  position: absolute;
  /* Distinct, premium dark glass that contrasts with the canvas */
  background: var(--glass-bg);
  backdrop-filter: blur(48px);
  -webkit-backdrop-filter: blur(48px);
  pointer-events: none;
  z-index: 10;
}

/* Edges for the HUD frame without inset lines */
.edge-top { top: 0; left: 0; right: 0; height: 10px; }
.edge-bottom { bottom: 0; left: 0; right: 0; height: 10px; }
.edge-left { top: 10px; bottom: 10px; left: 0; width: 10px; }
.edge-right { top: 10px; bottom: 10px; right: 0; width: 10px; }

.hud-avatar-wrapper {
  position: absolute;
  top: 20px;
  left: 20px;
  pointer-events: auto;
}

/* Make sure child interactive elements capture pointer events */
:deep(.state-bar),
:deep(.hud-avatar-wrapper),
:deep(.quick-access-hud),
:deep(.settings-modal-overlay),
:deep(.right-drawer-wrapper) {
  pointer-events: auto;
}
</style>
