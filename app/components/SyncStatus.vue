<script setup lang="ts">
import { computed } from 'vue'
import { CloudUpload, CloudOff, CheckCircle2 } from 'lucide-vue-next'
import { useWidgetStore } from '~/stores/widgets'

const widgetStore = useWidgetStore()

const statusIcon = computed(() => {
  switch (widgetStore.syncStatus) {
    case 'syncing':
      return CloudUpload
    case 'offline':
    case 'error':
      return CloudOff
    case 'saved':
    default:
      return CheckCircle2
  }
})

const statusText = computed(() => {
  switch (widgetStore.syncStatus) {
    case 'syncing':
      return 'Saving...'
    case 'offline':
    case 'error':
      return 'Offline - Saved Locally'
    case 'saved':
    default:
      return 'Saved to Cloud'
  }
})
</script>

<template>
  <div class="sync-status" :class="widgetStore.syncStatus">
    <component :is="statusIcon" class="sync-icon" :class="{ 'spin': widgetStore.syncStatus === 'syncing' }" />
    <span class="sync-text">{{ statusText }}</span>
  </div>
</template>

<style scoped>
.sync-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 20px;
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  cursor: default;
  pointer-events: auto; /* Ensure it blocks pointer events so it's a solid element */
}

/* Saved State */
.sync-status.saved {
  color: var(--text-tertiary);
  opacity: 0.7;
}
.sync-status.saved .sync-icon {
  color: #10b981; /* Emerald 500 */
}

/* Syncing State */
.sync-status.syncing {
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.2);
}
.sync-status.syncing .sync-icon {
  color: var(--text-primary);
}

/* Offline State */
.sync-status.offline, .sync-status.error {
  color: #f59e0b; /* Amber 500 */
  border-color: rgba(245, 158, 11, 0.3);
}

.sync-icon {
  width: 14px;
  height: 14px;
}

.spin {
  animation: pulse-spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes pulse-spin {
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
}
</style>
