<script setup lang="ts">
import { ref } from 'vue'

const activeWorkspace = ref('main')
const workspaces = ref([
  { id: 'main', label: 'Main' },
  { id: 'dev', label: 'Dev' },
  { id: 'design', label: 'Design' }
])

function setActive(id: string) {
  activeWorkspace.value = id
}
</script>

<template>
  <div class="state-bar">
    <div class="ws-switcher">
      <!-- Workspace tabs -->
      <div
        v-for="workspace in workspaces"
        :key="workspace.id"
        class="ws-tab"
        :class="{ active: activeWorkspace === workspace.id }"
      >
        <button class="ws-btn" @click="setActive(workspace.id)">
          {{ workspace.label }}
        </button>
        <!-- Delete cross just for visual parity with screenshot -->
        <button
          v-if="activeWorkspace === workspace.id"
          class="ws-delete"
          title="Delete workspace"
        >
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 2l6 6M8 2l-6 6"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>

      <!-- Add workspace -->
      <button class="ws-add" title="New workspace">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>
      </button>

      <div class="ws-divider" />

      <!-- Expand -->
      <button class="ws-btn expand-btn" title="Expand">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
    
    <!-- Inverse curve for seamless blending into the border on top-left and bottom-right -->
    <div class="curve-top" />
    <div class="curve-right" />
  </div>
</template>

<style scoped>
.state-bar {
  position: absolute;
  bottom: 0; /* Sit exactly inside the app-shell */
  left: 0;
  background: var(--bg-soft); /* Perfectly match the frame color */
  border-radius: 0 16px 0 0;
  z-index: 100;
  user-select: none;
  overflow: visible;
}

.curve-top {
  position: absolute;
  top: -16px;
  left: 0;
  width: 16px;
  height: 16px;
  background: radial-gradient(circle at 100% 0, transparent 16px, var(--bg-soft) 16px);
  pointer-events: none;
}

.curve-right {
  position: absolute;
  bottom: 0;
  right: -16px;
  width: 16px;
  height: 16px;
  background: radial-gradient(circle at 100% 0, transparent 16px, var(--bg-soft) 16px);
  pointer-events: none;
}

/* ─── Switcher Inner Styling ────────────────────────────────────── */
.ws-switcher {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 10px;
}

.ws-tab {
  display: flex;
  align-items: center;
  border-radius: 7px;
  transition: background 0.12s;
}

.ws-tab.active {
  background: rgba(205, 198, 247, 0.1);
}

.ws-btn {
  height: 26px;
  padding: 0 10px;
  background: none;
  border: none;
  border-radius: 7px;
  font-size: 12px;
  font-family: var(--font-sans);
  color: rgba(205, 198, 247, 0.4);
  cursor: pointer;
  transition: color 0.12s;
  white-space: nowrap;
}

.ws-tab:hover .ws-btn,
.ws-tab.active .ws-btn {
  color: #cdc6f7;
}

.ws-tab:not(.active):hover {
  background: rgba(205, 198, 247, 0.07);
}

.ws-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 4px;
  background: none;
  border: none;
  border-radius: 4px;
  color: rgba(205, 198, 247, 0.3);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
  flex-shrink: 0;
}

.ws-delete:hover {
  background: rgba(255, 80, 80, 0.15);
  color: #ff6b6b;
}

.ws-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: none;
  border: none;
  border-radius: 6px;
  color: rgba(205, 198, 247, 0.35);
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  margin-left: 2px;
}

.ws-add:hover {
  background: rgba(205, 198, 247, 0.1);
  color: #cdc6f7;
}

.ws-divider {
  width: 1px;
  height: 16px;
  background: rgba(205, 198, 247, 0.12);
  margin: 0 4px;
}

.expand-btn {
  width: 26px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
