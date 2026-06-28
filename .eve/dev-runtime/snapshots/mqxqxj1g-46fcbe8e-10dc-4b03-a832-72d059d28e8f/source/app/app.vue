<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppStore } from './stores/app'

const appStore = useAppStore()
const { data, status, send } = useEveAgent();

const isBusy = computed(() => status.value === "submitted" || status.value === "streaming");

const message = ref("");

async function handleSubmit() {
  const text = message.value.trim();
  if (!text || isBusy.value) return;

  message.value = "";
  // `send` adds the message to `data.messages` directly and streams the response
  await send({ message: text });
}
</script>

<template>
  <div class="app-container">
    <div class="header">
      <h1><LucideSparkles class="logo-icon" :size="28" /> Bubbles.space</h1>
      <button class="theme-toggle" @click="appStore.toggleTheme()">
        <LucideSun v-if="appStore.theme === 'dark'" :size="18" class="icon" />
        <LucideMoon v-else :size="18" class="icon" />
        <span>{{ appStore.theme === 'dark' ? 'Light' : 'Dark' }}</span>
      </button>
    </div>

    <div class="chat-container">
      <div v-if="!data?.messages?.length" class="empty-state">
        Send a message to start chatting with the agent!
      </div>

      <template v-for="msg in data?.messages" :key="msg.id">
        <!-- Render each part of the message -->
        <template v-for="(part, idx) in msg.parts" :key="idx">
          <div v-if="part.type === 'text' || part.type === 'error'" class="message-bubble" :class="msg.role">
            <template v-if="part.type === 'text'">
              {{ part.text }}
            </template>
            <template v-else-if="part.type === 'error'">
              <span class="error-text">Error: {{ part.error.message }}</span>
            </template>
          </div>
        </template>
      </template>

      <div v-if="isBusy" class="typing-indicator">Agent is typing...</div>
    </div>

    <form @submit.prevent="handleSubmit" class="input-form">
      <input
        v-model="message"
        :disabled="isBusy"
        placeholder="Type your message..."
        class="message-input"
      />
      <button
        type="submit"
        :disabled="isBusy"
        class="send-button"
      >
        Send
      </button>
    </form>
  </div>

  <AuraLogo/>
</template>

<style>
/* Global CSS for VueUse useColorMode */
html {
  transition: background-color 0.3s ease, color 0.3s ease;
}

html.light {
  background-color: #ffffff;
  color: #1a1a1a;
  --border-color: #e5e5e5;
  --chat-bg: #f9f9f9;
  --user-msg-bg: #0070f3;
  --user-msg-color: #ffffff;
  --agent-msg-bg: #f0f0f0;
  --agent-msg-color: #1a1a1a;
  --input-bg: #ffffff;
}

html.dark {
  background-color: #121212;
  color: #e0e0e0;
  --border-color: #333333;
  --chat-bg: #1e1e1e;
  --user-msg-bg: #3291ff;
  --user-msg-color: #ffffff;
  --agent-msg-bg: #2a2a2a;
  --agent-msg-color: #e0e0e0;
  --input-bg: #1e1e1e;
}

/* Component Styles */
.app-container {
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  color: var(--user-msg-bg);
}

.theme-toggle {
  background: transparent;
  border: 1px solid var(--border-color);
  color: inherit;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-toggle:hover {
  background: var(--agent-msg-bg);
}

.chat-container {
  border: 1px solid var(--border-color);
  background-color: var(--chat-bg);
  border-radius: 12px;
  padding: 1.5rem;
  min-height: 400px;
  max-height: 60vh;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}

.empty-state {
  color: #888;
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
}

.message-bubble {
  padding: 0.75rem 1.25rem;
  border-radius: 18px;
  max-width: 80%;
  line-height: 1.5;
}

.message-bubble.user {
  background-color: var(--user-msg-bg);
  color: var(--user-msg-color);
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.message-bubble.assistant {
  background-color: var(--agent-msg-bg);
  color: var(--agent-msg-color);
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.error-text {
  color: #ff4a4a;
}

.typing-indicator {
  color: #888;
  font-style: italic;
  font-size: 0.9rem;
  align-self: flex-start;
  margin-left: 0.5rem;
}

.input-form {
  display: flex;
  gap: 0.5rem;
}

.message-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  background-color: var(--input-bg);
  color: inherit;
  border-radius: 8px;
  outline: none;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.message-input:focus {
  border-color: var(--user-msg-bg);
}

.send-button {
  padding: 0.75rem 1.5rem;
  background: var(--user-msg-bg);
  color: var(--user-msg-color);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.2s ease;
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-button:hover:not(:disabled) {
  opacity: 0.9;
}
</style>
