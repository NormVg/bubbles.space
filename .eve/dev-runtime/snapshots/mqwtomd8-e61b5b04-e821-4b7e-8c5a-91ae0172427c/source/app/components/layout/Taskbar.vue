<script setup lang="ts">
import { useWorkspaceStore } from '~/stores/workspace'

const wsStore = useWorkspaceStore()
</script>

<template>
  <div class="taskbar-wrapper">
    <div class="taskbar">
      <div class="taskbar-left">
        <slot name="left" />
      </div>
      
      <div class="taskbar-center">
        <slot name="center" />
      </div>

      <div class="taskbar-right">
        <button 
          class="taskbar-btn" 
          :class="{ active: wsStore.sidePanelOpen }"
          @click="wsStore.toggleSidePanel()"
          title="Toggle Chat"
        >
          <LucideMessageCircle :size="20" />
        </button>
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.taskbar-wrapper {
  position: fixed;
  bottom: 16px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 101;
  pointer-events: none; /* Let clicks pass through outside the taskbar */
}

.taskbar {
  pointer-events: auto;
  height: 56px;
  background: var(--chat-bg);
  backdrop-filter: blur(20px) saturate(1.5);
  -webkit-backdrop-filter: blur(20px) saturate(1.5);
  border: 1px solid var(--border-color);
  border-radius: 28px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  min-width: 300px;
  gap: 16px;
}

html.dark .taskbar {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.taskbar-left, .taskbar-right, .taskbar-center {
  display: flex;
  align-items: center;
  gap: 8px;
}

.taskbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.taskbar-btn:hover {
  background: var(--agent-msg-bg);
}

.taskbar-btn.active {
  background: var(--user-msg-bg);
  color: var(--user-msg-color);
}
</style>
