<script setup lang="ts">
import { onMounted } from 'vue'
import WorkspaceSwitcher from './WorkspaceSwitcher.vue'
import BubblesAvatar from './BubblesAvatar.vue'
import QuickAccessBar from './QuickAccessBar.vue'
import SyncStatus from './SyncStatus.vue'
import SettingsModal from './SettingsModal.vue'
import RightDrawer from './RightDrawer.vue'
import ArchivePanel from './ArchivePanel.vue'
import AgentSessionProvider from './AgentSessionProvider.vue'
import { useConversationStore } from '../stores/conversations'
import { useWidgetStore } from '../stores/widgets'
import { useChatStore } from '../stores/chat'
import { useRealtimeSync } from '../composables/useRealtimeSync'

const conversationStore = useConversationStore()
const widgetStore = useWidgetStore()
const chatStore = useChatStore()

useRealtimeSync()

const isExpanded = computed(() => Object.keys(widgetStore.expandedWidgets).length > 0)

onMounted(() => {
  void conversationStore.init()
})
</script>

<template>
  <div class="hud-overlay">
    <ClientOnly>
      <AgentSessionProvider v-if="conversationStore.isInitialized" :key="`${conversationStore.activeConversationId}-${conversationStore.agentSessionKey}`" />
    </ClientOnly>

    <!-- Top Left: Avatar -->
    <div class="hud-avatar-wrapper">
      <BubblesAvatar :interactive="true" />
    </div>

    <!-- Top Right: Sync Status -->
    <div class="hud-sync-wrapper">
      <SyncStatus />
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
    <ArchivePanel />
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



.hud-avatar-wrapper {
  position: absolute;
  top: 20px;
  left: 20px;
  pointer-events: auto;
}

.hud-sync-wrapper {
  position: absolute;
  top: 20px;
  right: 20px;
  pointer-events: auto;
}

/* Make sure child interactive elements capture pointer events */
:deep(.state-bar),
:deep(.hud-avatar-wrapper),
:deep(.quick-access-hud),
:deep(.settings-modal-overlay),
:deep(.archive-panel),
:deep(.right-drawer-wrapper) {
  pointer-events: auto;
}
</style>
