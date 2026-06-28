<script setup lang="ts">
import { useAppStore } from './stores/app'
import FixedCanvas from './components/canvas/FixedCanvas.vue'
import SidePanel from './components/layout/SidePanel.vue'
import Taskbar from './components/layout/Taskbar.vue'
import EveChat from './components/chat/EveChat.vue'

const appStore = useAppStore()
</script>

<template>
  <div class="desktop-environment">
    <!-- Main Background Workspace -->
    <FixedCanvas>
      <div class="welcome-overlay">
        <div class="logo-container">
          <LucideSparkles class="logo-icon" :size="48" />
          <h1>Bubbles.space</h1>
          <p>Your fixed-space AI desktop.</p>
        </div>
      </div>
    </FixedCanvas>

    <!-- UI Overlays -->
    <SidePanel>
      <EveChat />
    </SidePanel>

    <Taskbar>
      <template #left>
        <button class="theme-toggle" @click="appStore.toggleTheme()" title="Toggle Theme">
          <LucideSun v-if="appStore.theme === 'dark'" :size="18" />
          <LucideMoon v-else :size="18" />
        </button>
      </template>
    </Taskbar>
  </div>
</template>

<style>
/* Global Resets */
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: system-ui, -apple-system, sans-serif;
}

/* Global CSS for VueUse useColorMode */
html {
  transition: background-color 0.3s ease, color 0.3s ease;
}

html.light {
  background-color: #f5f5f7;
  color: #1d1d1f;
  --border-color: rgba(0, 0, 0, 0.1);
  --chat-bg: rgba(255, 255, 255, 0.85);
  --user-msg-bg: #0071e3;
  --user-msg-color: #ffffff;
  --agent-msg-bg: #f5f5f7;
  --agent-msg-color: #1d1d1f;
  --input-bg: #ffffff;
}

html.dark {
  background-color: #000000;
  color: #f5f5f7;
  --border-color: rgba(255, 255, 255, 0.15);
  --chat-bg: rgba(30, 30, 34, 0.85);
  --user-msg-bg: #0a84ff;
  --user-msg-color: #ffffff;
  --agent-msg-bg: #2c2c2e;
  --agent-msg-color: #f5f5f7;
  --input-bg: #1c1c1e;
}

.desktop-environment {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.welcome-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* Let clicks pass to canvas if needed */
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.logo-container h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.logo-container p {
  margin: 0;
  font-size: 1.1rem;
}

.logo-icon {
  color: var(--user-msg-bg);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid transparent;
  color: inherit;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background: var(--agent-msg-bg);
  border-color: var(--border-color);
}
</style>
