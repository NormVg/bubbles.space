<script setup lang="ts">
import { computed } from 'vue'
import type { EveMessage } from 'eve/vue'
import AILoader from './AILoader.vue'
import MarkdownRenderer from './MarkdownRenderer.vue'
import { useVoiceAgent } from '../composables/useVoiceAgent'
import { useAppAgent } from '../composables/useAppAgent'

const voiceAgent = useVoiceAgent()
const eveAgent = useAppAgent()

function getMessageText(message: EveMessage) {
  return message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('')
}

const voiceStatusLabel = computed(() => {
  if (eveAgent.status.value === 'submitted' || eveAgent.status.value === 'streaming') return 'Bubbles is thinking...'
  if (voiceAgent.isSpeaking.value) return 'Bubbles is speaking...'
  return 'Bubbles is ready...'
})

const latestAiMessageText = computed(() => {
  const messages = eveAgent.data.value.messages
  if (!messages || messages.length === 0) return ''

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    if (message?.role === 'assistant') {
      return getMessageText(message)
    }
  }

  return ''
})
</script>

<template>
  <div class="voice-response-view">
    <div class="voice-response-header">
      <AILoader :size="12" color="var(--accent)" />
      <span>{{ voiceStatusLabel }}</span>
    </div>
    
    <div v-if="voiceAgent.transcript.value" class="user-transcript">
      <span class="transcript-label">You:</span> {{ voiceAgent.transcript.value }}
    </div>

    <div v-if="latestAiMessageText" class="voice-response-content">
      <MarkdownRenderer :content="latestAiMessageText" :isDone="eveAgent.status.value !== 'streaming'" />
    </div>
  </div>
</template>

<style scoped>
.voice-response-view {
  padding: 16px;
  width: max-content;
  max-width: 450px;
  box-sizing: border-box;
}

.voice-response-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.voice-response-header:last-child {
  margin-bottom: 0;
}

.user-transcript {
  font-size: 13px;
  color: var(--text-secondary);
  font-style: italic;
  margin-bottom: 12px;
  line-height: 1.4;
  padding-left: 8px;
  border-left: 2px solid var(--glass-border);
}

.transcript-label {
  font-weight: 600;
  font-style: normal;
  color: var(--text-primary);
}

.voice-response-content {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.5;
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--glass-border) transparent;
}
.voice-response-content::-webkit-scrollbar {
  width: 4px;
}
.voice-response-content::-webkit-scrollbar-thumb {
  background: var(--glass-border);
  border-radius: 4px;
}
</style>
