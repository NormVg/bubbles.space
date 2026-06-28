<template>
  <div class="right-drawer-wrapper" :class="{ 'is-open': uiStore.isRightDrawerOpen }">
    <!-- Optional invisible backdrop to close when clicking outside (on canvas) -->
    <div 
      class="drawer-backdrop" 
      v-if="uiStore.isRightDrawerOpen" 
      @click="uiStore.closeRightDrawer"
    ></div>

    <!-- The actual drawer panel -->
    <aside class="right-drawer">
      <div class="drawer-content">
        
        <div class="drawer-header">
          <h2 class="drawer-title">Sidebar Panel</h2>
          <p class="drawer-subtitle">Dynamic Content Area</p>
        </div>

        <div class="drawer-body">
          <div class="empty-state">
            <LucideLayoutTemplate :size="32" class="empty-icon" />
            <p>Select a component to view</p>
          </div>
        </div>
        
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '../stores/ui'
const uiStore = useUIStore()
</script>

<style scoped>
/* ─── Wrapper & Backdrop ──────────────────────────────────────── */
.right-drawer-wrapper {
  position: absolute;
  top: 10px;
  right: 10px;
  bottom: 10px;
  /* Width must not block the screen when closed */
  width: 0;
  z-index: 50; /* Lower than QuickAccessBar (which should be 100) */
  pointer-events: none;
}

.right-drawer-wrapper.is-open {
  width: auto;
  pointer-events: auto;
}

.drawer-backdrop {
  position: fixed;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  z-index: 1;
  /* Very subtle backdrop if needed, or completely transparent */
  background: rgba(0, 0, 0, 0.1);
}

/* ─── Drawer Panel ──────────────────────────────────────── */
.right-drawer {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  
  /* Constraints based on user requirements */
  width: 400px; /* Default width */
  min-width: 35vw;
  max-width: 90vw;
  
  /* Deep glassmorphism aesthetic matching SettingsModal */
  background: rgba(20, 20, 25, 0.85);
  backdrop-filter: blur(24px);
  border: 1px solid var(--border);
  border-right: none;
  border-radius: 16px 0 0 16px;
  box-shadow: -12px 0 32px rgba(0, 0, 0, 0.3), inset 1px 0 0 rgba(255, 255, 255, 0.05);
  
  z-index: 2;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  /* Base state for animation (closed) */
  transform: translateX(100%);
  opacity: 0;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), 
              opacity 0.4s ease;
}

/* Open State */
.right-drawer-wrapper.is-open .right-drawer {
  transform: translateX(0);
  opacity: 1;
}

/* ─── Drawer Content (Staggered Animations) ────────────────────── */
.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 32px;
  /* Base state for child animations */
  opacity: 0;
  transform: translateX(20px);
  transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.right-drawer-wrapper.is-open .drawer-content {
  /* Delays to create a staggered, alive feel */
  opacity: 1;
  transform: translateX(0);
  transition-delay: 0.1s; /* Content follows the panel slide */
}

.drawer-header {
  margin-bottom: 32px;
  /* Another stagger step for header specifically */
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.4s ease 0.15s, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s;
}

.right-drawer-wrapper.is-open .drawer-header {
  opacity: 1;
  transform: translateY(0);
}

.drawer-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.drawer-subtitle {
  font-size: 14px;
  color: var(--text-muted);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  /* Final stagger step for body content */
  opacity: 0;
  transform: translateY(15px);
  transition: opacity 0.5s ease 0.2s, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s;
}

.right-drawer-wrapper.is-open .drawer-body {
  opacity: 1;
  transform: translateY(0);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  gap: 16px;
  opacity: 0.5;
}

.empty-icon {
  color: var(--text-secondary);
}
</style>
