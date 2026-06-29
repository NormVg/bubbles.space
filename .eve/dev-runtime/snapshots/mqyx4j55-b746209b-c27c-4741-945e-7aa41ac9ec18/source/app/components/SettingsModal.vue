<template>
  <Transition name="modal">
    <div v-if="uiStore.isSettingsOpen" class="settings-modal-overlay" @click.self="uiStore.closeSettings">
      <div class="settings-modal-content">
        <button class="close-btn" @click="uiStore.closeSettings">
          <LucideX :size="18" />
        </button>
        
        <div class="modal-body">
          <div class="settings-sidebar">
            <h2 class="sidebar-title">Settings</h2>
            <button class="nav-btn" :class="{ active: activeTab === 'general' }" @click="activeTab = 'general'">General</button>
            <button class="nav-btn" :class="{ active: activeTab === 'appearance' }" @click="activeTab = 'appearance'">Appearance</button>
            <button class="nav-btn" :class="{ active: activeTab === 'account' }" @click="activeTab = 'account'">Account</button>
            <button class="nav-btn" :class="{ active: activeTab === 'advanced' }" @click="activeTab = 'advanced'">Advanced</button>
          </div>
          <div class="settings-main">
            <!-- GENERAL TAB -->
            <div v-if="activeTab === 'general'" class="setting-group">
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

            <!-- APPEARANCE TAB -->
            <div v-if="activeTab === 'appearance'" class="setting-group">
              <h3>Theme</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <label>Color Mode</label>
                  <span class="desc">Choose how Bubbles looks to you</span>
                </div>
                
                <div class="theme-switcher">
                  <button 
                    class="theme-btn" 
                    :class="{ active: colorMode === 'light' }" 
                    @click="colorMode = 'light'"
                  >
                    <LucideSun :size="15" />
                    Light
                  </button>
                  <button 
                    class="theme-btn" 
                    :class="{ active: colorMode === 'dark' }" 
                    @click="colorMode = 'dark'"
                  >
                    <LucideMoon :size="15" />
                    Dark
                  </button>
                  <button 
                    class="theme-btn" 
                    :class="{ active: colorMode === 'auto' }" 
                    @click="colorMode = 'auto'"
                  >
                    <LucideMonitor :size="15" />
                    System
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUIStore } from '../stores/ui'
import { useColorMode } from '@vueuse/core'

const uiStore = useUIStore()
const activeTab = ref('appearance') // Default to appearance so they see it immediately

const colorMode = useColorMode({
  emitAuto: true,
  modes: {
    light: 'light',
    dark: 'dark'
  }
})
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
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
  border-radius: 6px;
  pointer-events: auto;
}

.settings-modal-content {
  width: 90%;
  height: 80%;
  max-width: 860px;
  max-height: 600px;
  background: var(--bg-base);
  border: 1px solid var(--border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--widget-shadow);
  overflow: hidden;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.close-btn:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.modal-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.settings-sidebar {
  width: 220px;
  padding: 24px 12px;
  background: var(--bg-soft);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  padding: 0 12px;
  margin-bottom: 16px;
  font-family: var(--font-sans);
}

.nav-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  text-align: left;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.nav-btn.active {
  background: var(--glass-border);
  color: var(--text-primary);
  font-weight: 600;
}

.settings-main {
  flex: 1;
  padding: 32px 40px;
  overflow-y: auto;
  font-family: var(--font-sans);
}

.setting-group {
  margin-bottom: 40px;
}

.setting-group h3 {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-subtle);
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
  font-size: 14px;
  font-weight: 500;
}

.setting-info .desc {
  color: var(--text-secondary);
  font-size: 13px;
}

.toggle-switch {
  width: 44px;
  height: 24px;
  background: var(--glass-border);
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
  background: var(--accent);
}

.toggle-switch.active::after {
  transform: translateX(20px);
}

/* ─── Theme Switcher ──────────────────────────────────────── */
.theme-switcher {
  display: flex;
  background: var(--hover-bg);
  border-radius: 10px;
  padding: 4px;
  gap: 4px;
}

.theme-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-btn:hover {
  color: var(--text-primary);
}

.theme-btn.active {
  background: var(--bg-elevated);
  color: var(--text-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-subtle);
}

/* ─── Modal Animations ──────────────────────────────────────── */
/* 1. Background Overlay */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* 2. Modal Container (Springy scale-up) */
.modal-enter-active .settings-modal-content,
.modal-leave-active .settings-modal-content {
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s, 
              opacity 0.4s ease 0.05s;
}
.modal-enter-from .settings-modal-content,
.modal-leave-to .settings-modal-content {
  transform: scale(0.92) translateY(20px);
  opacity: 0;
}

/* 3. Sidebar (Slides from left) */
.modal-enter-active .settings-sidebar {
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s,
              opacity 0.5s ease 0.15s;
}
.modal-enter-from .settings-sidebar {
  transform: translateX(-15px);
  opacity: 0;
}

/* 4. Main Content (Slides up from bottom) */
.modal-enter-active .settings-main {
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s,
              opacity 0.5s ease 0.2s;
}
.modal-enter-from .settings-main {
  transform: translateY(15px);
  opacity: 0;
}

/* 5. Header (Fades and drops in slightly) */
.modal-enter-active .modal-header {
  transition: opacity 0.5s ease 0.25s, 
              transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.25s;
}
.modal-enter-from .modal-header {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
