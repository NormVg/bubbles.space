<script setup lang="ts">
import WorkspaceSwitcher from './WorkspaceSwitcher.vue'
import BubblesAvatar from './BubblesAvatar.vue'
import QuickAccessBar from './QuickAccessBar.vue'
import SettingsModal from './SettingsModal.vue'
import RightDrawer from './RightDrawer.vue'
</script>

<template>
  <div class="hud-overlay">
    <!-- Bulletproof SVG Mask using viewport units to guarantee sizing regardless of SVG wrapper dimensions -->
    <svg width="0" height="0" style="position: absolute; pointer-events: none;">
      <defs>
        <mask id="hud-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100vw" height="100vh">
          <rect class="mask-outer" />
          <rect class="mask-inner" />
        </mask>
      </defs>
    </svg>

    <!-- Single 10px frame border with rounded inner/outer corners -->
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
.mask-outer {
  x: 0;
  y: 0;
  width: 100vw;
  height: 100vh;
  fill: white;
}

.mask-inner {
  x: 10px;
  y: 10px;
  width: calc(100vw - 20px);
  height: calc(100vh - 20px);
  rx: 16px;
  fill: black;
}

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
  
  /* Distinct, premium dark glass that contrasts with the canvas */
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  pointer-events: none;
  z-index: 10;
  
  /* SVG Mask provides perfect cross-browser support */
  mask: url(#hud-mask);
  -webkit-mask: url(#hud-mask);
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
