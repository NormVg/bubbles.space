<script setup lang="ts">
import { onMounted } from 'vue'
import WorkspaceSwitcher from './WorkspaceSwitcher.vue'
import BubblesAvatar from './BubblesAvatar.vue'
import QuickAccessBar from './QuickAccessBar.vue'
import SettingsModal from './SettingsModal.vue'
import RightDrawer from './RightDrawer.vue'
import ArchivePanel from './ArchivePanel.vue'
import AgentSessionProvider from './AgentSessionProvider.vue'
import { useConversationStore } from '../stores/conversations'
import { authClient } from '~/utils/auth-client'
import { LogOut } from 'lucide-vue-next'

const conversationStore = useConversationStore()
const session = authClient.useSession()

async function logout() {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = '/'
      }
    }
  })
}

onMounted(() => {
  void conversationStore.init()
})
</script>

<template>
  <div class="hud-overlay">
    <ClientOnly>
      <AgentSessionProvider v-if="conversationStore.isInitialized" :key="conversationStore.activeConversationId" />
    </ClientOnly>

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

    <!-- Top Right: User Profile -->
    <div v-if="session.data" class="hud-user-profile">
      <img v-if="session.data.user.image" :src="session.data.user.image" alt="Profile" class="user-avatar" />
      <div v-else class="user-avatar placeholder">{{ session.data.user.name.charAt(0) }}</div>
      <button class="logout-btn" @click="logout" title="Sign Out">
        <LogOut :size="16" />
      </button>
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
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
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
:deep(.hud-user-profile),
:deep(.quick-access-hud),
:deep(.settings-modal-overlay),
:deep(.archive-panel),
:deep(.right-drawer-wrapper) {
  pointer-events: auto;
}

.hud-user-profile {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-color);
  border-radius: 100px;
  z-index: 50;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--bg-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  color: var(--text-secondary);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(255, 60, 60, 0.1);
  color: #ff4444;
}
</style>
