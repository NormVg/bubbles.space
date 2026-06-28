<template>
  <Transition name="modal">
    <div v-if="uiStore.isSettingsOpen" class="settings-modal-overlay" @click.self="uiStore.closeSettings">
      <div class="settings-modal-content">
        <div class="modal-header">
          <h2>Settings</h2>
          <button class="close-btn" @click="uiStore.closeSettings">
            <LucideX :size="20" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="settings-sidebar">
            <button class="nav-btn active">General</button>
            <button class="nav-btn">Appearance</button>
            <button class="nav-btn">Account</button>
            <button class="nav-btn">Advanced</button>
          </div>
          <div class="settings-main">
            <div class="setting-group">
              <h3>System Preferences</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <label>Start on Login</label>
                  <span class="desc">Automatically launch Bubbles on startup</span>
                </div>
                <div class="toggle-switch active"></div>
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <label>Hardware Acceleration</label>
                  <span class="desc">Use GPU to render animations smoothly</span>
                </div>
                <div class="toggle-switch active"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useUIStore } from '../stores/ui'
const uiStore = useUIStore()
</script>

<style scoped>
.settings-modal-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Dark translucent backdrop */
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  border-radius: 6px;
  pointer-events: auto;
}

.settings-modal-content {
  width: 80%;
  height: 80%;
  max-width: 1000px;
  max-height: 700px;
  background: rgba(20, 20, 25, 0.85);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-sans);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.modal-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.settings-sidebar {
  width: 240px;
  padding: 24px 16px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  text-align: left;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.nav-btn.active {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  font-weight: 500;
}

.settings-main {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  font-family: var(--font-sans);
}

.setting-group {
  margin-bottom: 40px;
}

.setting-group h3 {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.setting-info label {
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 500;
}

.setting-info .desc {
  color: var(--text-muted);
  font-size: 13px;
}

.toggle-switch {
  width: 44px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.toggle-switch.active {
  background: #cdc6f7;
}

.toggle-switch.active::after {
  transform: translateX(20px);
}

/* ─── Modal Animations ──────────────────────────────────────── */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-active .settings-modal-content,
.modal-leave-active .settings-modal-content {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .settings-modal-content {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

.modal-leave-to .settings-modal-content {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
