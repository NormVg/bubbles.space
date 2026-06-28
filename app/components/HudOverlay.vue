<script setup lang="ts">
import WorkspaceSwitcher from './WorkspaceSwitcher.vue'
import BubblesAvatar from './BubblesAvatar.vue'
import QuickAccessBar from './QuickAccessBar.vue'
import SettingsModal from './SettingsModal.vue'
import RightDrawer from './RightDrawer.vue'
</script>

<template>
  <div class="hud-overlay">
    <!-- Single 10px frame border with rounded inner/outer corners using CSS masking -->
    <div class="hud-frame" />
    
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
  filter: var(--hud-shadow);
}

.hud-frame {
  position: absolute;
  inset: 0;
  border: 10px solid transparent; /* Defines the 10px thickness */
  border-radius: 26px; /* Outer corner radius (yields 16px inner radius) */
  
  /* Distinct, premium dark glass that contrasts with the canvas */
  background: var(--glass-bg);
  backdrop-filter: blur(48px);
  -webkit-backdrop-filter: blur(48px);
  pointer-events: none;
  z-index: 10;
  
  /* Mask Magic: Subtracts the padding-box from the border-box to isolate the 10px border */
  mask-image: linear-gradient(black, black), linear-gradient(black, black);
  mask-clip: border-box, padding-box;
  mask-composite: exclude;
  
  -webkit-mask-image: linear-gradient(black, black), linear-gradient(black, black);
  -webkit-mask-clip: border-box, padding-box;
  -webkit-mask-composite: destination-out;
}

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
