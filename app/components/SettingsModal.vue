<template>
  <Transition name="modal">
    <div v-if="uiStore.isSettingsOpen" class="settings-modal-overlay" @click.self="uiStore.closeSettings">
      <div class="settings-modal-content">
        <div class="modal-body">
          <div class="settings-sidebar">
            <h2 class="sidebar-title">Settings</h2>
            <button class="nav-btn" :class="{ active: activeTab === 'general' }" @click="activeTab = 'general'">General</button>
            <button class="nav-btn" :class="{ active: activeTab === 'appearance' }" @click="activeTab = 'appearance'">Appearance</button>
            <button class="nav-btn" :class="{ active: activeTab === 'account' }" @click="activeTab = 'account'">Account</button>
            
            <div class="sidebar-divider"></div>
            <span class="sidebar-label">Agent Engine</span>
            <button class="nav-btn" :class="{ active: activeTab === 'engine' }" @click="activeTab = 'engine'">
              Model Settings
            </button>
            
            <div class="sidebar-divider"></div>
            <span class="sidebar-label">Personalization</span>
            <button class="nav-btn" :class="{ active: activeTab === 'soul' }" @click="activeTab = 'soul'">
              Bubbles
            </button>
            <button class="nav-btn" :class="{ active: activeTab === 'user' }" @click="activeTab = 'user'">
              User
            </button>
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
              <div class="setting-item avatar-preview-item">
                <div class="setting-info">
                  <label>Avatar Emotion Lab</label>
                  <span class="desc">Type to preview different Bubbles emotions</span>
                  <div class="emotion-input-wrapper">
                    <input 
                      type="text" 
                      v-model="previewEmotion" 
                      placeholder="e.g. happy, frustrate, think, tool, listening" 
                      class="emotion-input"
                    />
                    <div class="quick-emotions">
                      <button @click="previewEmotion = 'normal'" class="tiny-btn">Normal</button>
                      <button @click="previewEmotion = 'think'" class="tiny-btn">Think</button>
                      <button @click="previewEmotion = 'happy'" class="tiny-btn">Happy</button>
                      <button @click="previewEmotion = 'frustrate'" class="tiny-btn">Frustrate</button>
                      <button @click="previewEmotion = 'tool'" class="tiny-btn">Tool</button>
                      <button @click="previewEmotion = 'listening'" class="tiny-btn">Listen</button>
                    </div>
                  </div>
                </div>
                
                <div class="avatar-preview-display">
                  <BubblesAvatar :emotionOverride="previewEmotion" :animate="true" :invert="colorMode === 'dark'" />
                </div>
              </div>
            </div>

            <!-- ACCOUNT TAB -->
            <div v-if="activeTab === 'account'" class="setting-group">
              <h3>Account Profile</h3>
              <div class="setting-item account-details-item" v-if="session.data">
                <div class="account-profile">
                  <img v-if="session.data.user.image" :src="session.data.user.image" alt="Profile" class="account-avatar" />
                  <div v-else class="account-avatar placeholder">{{ session.data.user.name.charAt(0) }}</div>
                  <div class="account-info">
                    <span class="account-name">{{ session.data.user.name }}</span>
                    <span class="account-email">{{ session.data.user.email }}</span>
                  </div>
                </div>
                <button class="logout-btn" @click="logout" title="Sign Out">
                  <LucideLogOut :size="15" />
                  Sign Out
                </button>
              </div>
            </div>

            <!-- BUBBLES TAB -->
            <div v-if="activeTab === 'soul'" class="setting-group">
              <div class="editor-header">
                <div class="editor-info">
                  <h3>Bubbles</h3>
                  <p class="desc">Define how Bubbles thinks, speaks, and behaves. This acts as the core instruction set injected into every conversation.</p>
                </div>
              </div>
              <textarea 
                v-model="editSystemPrompt"
                class="settings-textarea large-textarea" 
                placeholder="e.g. You are concise and direct. You prefer functional code over OOP. Never use emojis. Always explain trade-offs..."
              ></textarea>
            </div>

            <!-- USER TAB -->
            <div v-if="activeTab === 'user'" class="setting-group">
              <div class="editor-header">
                <div class="editor-info">
                  <h3>User</h3>
                  <p class="desc">Tell Bubbles about yourself. This context helps it give you more relevant, personalized, and accurate answers.</p>
                </div>
              </div>
              <textarea 
                v-model="editAboutMe"
                class="settings-textarea large-textarea" 
                placeholder="e.g. I'm a frontend developer working with Vue and Nuxt. I prefer dark mode and minimal UI. I'm based in India..."
              ></textarea>
            </div>

            <!-- AGENT ENGINE TAB -->
            <div v-if="activeTab === 'engine'" class="setting-group">
              <div class="editor-header">
                <div class="editor-info">
                  <h3>Model Settings</h3>
                  <p class="desc">Configure the AI engine that powers Bubbles. Select a model or type a custom one.</p>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Preferred Model</label>
                  <span class="desc">e.g. ollama:llama3 or leave blank for default</span>
                </div>
                <div class="model-input-wrapper">
                  <div class="input-group">
                    <input 
                      type="text" 
                      v-model="editPreferredModel" 
                      list="ollama-models"
                      class="premium-input"
                      placeholder="Default (gemma4:31b-cloud)"
                    />
                    <button class="refresh-icon-btn" @click="fetchModels" :disabled="isFetchingModels" title="Refresh local models">
                      <LucideRefreshCw :size="14" :class="{ 'spin-icon': isFetchingModels }" />
                    </button>
                  </div>
                  
                  <datalist id="ollama-models">
                    <option v-for="m in availableModels" :key="m.name" :value="`ollama:${m.name}`">
                      {{ m.name }}
                    </option>
                  </datalist>
                  
                  <div v-if="isFetchingModels && availableModels.length === 0" class="fetching-models-text">
                    <LucideLoader :size="12" class="spin-icon" /> Fetching models...
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        <div class="modal-footer">
          <button class="secondary-btn" @click="uiStore.closeSettings">Close</button>
          <button class="primary-save-btn" @click="saveUserSettings" :disabled="isSaving" v-if="['engine', 'soul', 'user'].includes(activeTab)">
            <LucideCheck v-if="!isSaving" :size="14" />
            <LucideLoader v-else :size="14" class="spin-icon" />
            {{ isSaving ? 'Saved' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUIStore } from '../stores/ui'
import { useColorMode } from '@vueuse/core'
import BubblesAvatar from './BubblesAvatar.vue'
import { authClient } from '~/utils/auth-client'

const uiStore = useUIStore()
const activeTab = ref('account') // Default to account tab to test
const previewEmotion = ref('normal')
const session = authClient.useSession()

const editSystemPrompt = ref('')
const editAboutMe = ref('')
const editPreferredModel = ref('')
const editReasoningEffort = ref('high')
const isSaving = ref(false)

const availableModels = ref<any[]>([])
const isFetchingModels = ref(false)

async function fetchModels() {
  isFetchingModels.value = true
  try {
    const res = await fetch('/api/ollama/models')
    const data = await res.json()
    if (data.success) {
      availableModels.value = data.models
    }
  } catch (error) {
    console.error('Failed to fetch models', error)
  } finally {
    isFetchingModels.value = false
  }
}

// Fetch models when the settings modal opens
watch(() => uiStore.isSettingsOpen, (isOpen) => {
  if (isOpen && availableModels.value.length === 0) {
    fetchModels()
  }
})

// Sync form when session loads
watch(() => session.value?.data, (data) => {
  if (data?.user) {
    // @ts-ignore - better-auth types are extended at runtime
    editSystemPrompt.value = data.user.systemPrompt || ''
    // @ts-ignore
    let aboutText = data.user.aboutMe || ''
    
    // Auto-seed name and email into the markdown file if missing
    if (!aboutText.toLowerCase().includes('name:')) {
      aboutText = `name: ${data.user.name || 'User'}\nemail: ${data.user.email || ''}\n\n${aboutText}`
    }
    
    editAboutMe.value = aboutText
    
    // @ts-ignore
    editPreferredModel.value = data.user.preferredModel || ''
    // @ts-ignore
    editReasoningEffort.value = data.user.reasoningEffort || 'high'
  }
}, { immediate: true })

async function saveUserSettings() {
  isSaving.value = true
  try {
    await authClient.updateUser({
      systemPrompt: editSystemPrompt.value,
      aboutMe: editAboutMe.value,
      // @ts-ignore
      preferredModel: editPreferredModel.value,
      // @ts-ignore
      reasoningEffort: editReasoningEffort.value
    })
  } catch (error) {
    console.error('Failed to save settings:', error)
  } finally {
    isSaving.value = false
  }
}

async function logout() {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = '/'
      }
    }
  })
}

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

/* ─── Modal Footer ──────────────────────────────────────── */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px 24px;
  background: var(--bg-soft);
  border-top: 1px solid var(--border-subtle);
  gap: 12px;
}

.secondary-btn {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary-btn:hover {
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

.sidebar-divider {
  height: 1px;
  background: var(--border-subtle);
  margin: 16px 12px 12px 12px;
}

.sidebar-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  padding: 0 12px;
  margin-bottom: 8px;
  font-family: var(--font-sans);
}

.nav-btn-file {
  font-family: var(--font-mono);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.settings-main {
  flex: 1;
  padding: 48px 40px 32px;
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

/* ─── Avatar Preview ──────────────────────────────────────── */
.avatar-preview-item {
  align-items: flex-start;
}

.emotion-input-wrapper {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.emotion-input {
  background: var(--bg-soft);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  width: 220px;
  font-family: var(--font-mono);
  outline: none;
  transition: border-color 0.2s;
}

.emotion-input:focus {
  border-color: var(--accent);
}

.quick-emotions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 260px;
}

.tiny-btn {
  background: var(--glass-border);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.tiny-btn:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.avatar-preview-display {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-soft);
  border: 1px dashed var(--border-subtle);
  border-radius: 12px;
  margin-left: 20px;
}

/* ─── Account Tab ──────────────────────────────────────── */
.account-details-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.account-profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.account-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--bg-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.account-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.account-email {
  font-size: 13px;
  color: var(--text-secondary);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 60, 60, 0.1);
  color: #ff4444;
  border: 1px solid rgba(255, 60, 60, 0.2);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: rgba(255, 60, 60, 0.15);
  border-color: rgba(255, 60, 60, 0.3);
}

.settings-textarea {
  background: var(--bg-soft);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  font-family: var(--font-mono);
  outline: none;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;
  width: 100%;
}

.settings-textarea:focus {
  border-color: var(--accent);
}

/* ─── File Editor Tabs (soul.md / user.md) ──────────────── */
.file-editor-group {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.large-textarea {
  min-height: 250px;
  font-size: 14px;
  line-height: 1.6;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.editor-info {
  max-width: 400px;
}

.editor-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.editor-info .desc {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* ─── Model Settings UI ──────────────────────────────────────── */
.model-input-wrapper {
  margin-top: 12px;
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.premium-input {
  flex: 1;
  background: var(--bg-soft);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-family: var(--font-sans);
  outline: none;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.premium-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(var(--accent-rgb), 0.15);
}

.refresh-icon-btn {
  background: var(--bg-soft);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.refresh-icon-btn:hover {
  color: var(--text-primary);
  border-color: var(--border);
  background: var(--hover-bg);
}

.fetching-models-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

.primary-save-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--text-primary);
  color: var(--bg-base);
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.primary-save-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.editor-textarea {
  flex-grow: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  padding: 16px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  resize: none;
  outline: none;
  min-height: 250px;
}

.editor-textarea:focus {
  /* Subtle inner glow on focus */
  box-shadow: inset 0 0 0 1px var(--border-subtle);
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
