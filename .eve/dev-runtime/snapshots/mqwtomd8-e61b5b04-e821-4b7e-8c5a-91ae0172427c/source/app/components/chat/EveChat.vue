<script setup lang="ts">
import { computed, ref } from 'vue'

const { data, status, send } = useEveAgent()

const isBusy = computed(() => status.value === "submitted" || status.value === "streaming")
const message = ref("")

async function handleSubmit() {
  const text = message.value.trim()
  if (!text || isBusy.value) return
  
  message.value = ""
  await send({ message: text })
}
</script>

<template>
  <div class="eve-chat-wrapper">
    <div class="chat-header">
      <h2>Agent Chat</h2>
    </div>

    <div class="chat-messages">
      <div v-if="!data?.messages?.length" class="empty-state">
        <LucideBot :size="48" class="empty-icon" />
        <p>Send a message to start chatting with your AI assistant.</p>
      </div>
      
      <template v-for="msg in data?.messages" :key="msg.id">
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

      <div v-if="isBusy" class="typing-indicator">
        <LucideLoader2 class="spin" :size="16" /> Agent is typing...
      </div>
    </div>
    
    <form @submit.prevent="handleSubmit" class="input-form">
      <input 
        v-model="message" 
        :disabled="isBusy" 
        placeholder="Type a message..."
        class="message-input"
      />
      <button 
        type="submit" 
        :disabled="isBusy"
        class="send-button"
      >
        <LucideSend :size="18" />
      </button>
    </form>
  </div>
</template>

<style scoped>
.eve-chat-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1rem;
}

.chat-header {
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.chat-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.chat-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* Custom scrollbar for webkit */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}
.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}
.chat-messages::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #888;
  margin: auto;
  gap: 1rem;
}

.empty-icon {
  opacity: 0.5;
}

.message-bubble {
  padding: 0.85rem 1.15rem;
  border-radius: 18px;
  max-width: 85%;
  line-height: 1.5;
  font-size: 0.95rem;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #888;
  font-style: italic;
  font-size: 0.9rem;
  align-self: flex-start;
  margin-left: 0.5rem;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.input-form {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.message-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  background-color: var(--input-bg);
  color: inherit;
  border-radius: 24px;
  outline: none;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.message-input:focus {
  border-color: var(--user-msg-bg);
  box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--user-msg-bg);
  color: var(--user-msg-color);
  border: none;
  border-radius: 22px;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.1s ease;
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-button:hover:not(:disabled) {
  opacity: 0.9;
  transform: scale(1.05);
}

.send-button:active:not(:disabled) {
  transform: scale(0.95);
}
</style>
