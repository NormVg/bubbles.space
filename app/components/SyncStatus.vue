<script setup lang="ts">
import { computed } from 'vue'
import { CloudUpload, CloudOff, CloudCheck } from 'lucide-vue-next'
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
      return CloudCheck
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
  </div>
</template>

<style scoped>
.sync-status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--text-secondary);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
  pointer-events: auto;
}

/* Saved State - Ultra minimal, almost invisible until hovered */
.sync-status.saved {
  color: var(--text-tertiary);
  opacity: 0.3;
}
.sync-status.saved:hover {
  opacity: 0.8;
  color: #10b981; /* Emerald 500 */
}

/* Syncing State - Active and spinning */
.sync-status.syncing {
  color: var(--text-primary);
  opacity: 1;
}

/* Offline State - Amber alert */
.sync-status.offline, .sync-status.error {
  color: #f59e0b; /* Amber 500 */
  opacity: 1;
}

.sync-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2.5px;
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
