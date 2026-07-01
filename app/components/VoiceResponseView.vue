<script setup lang="ts">
import { computed } from 'vue'
import type { EveMessage } from 'eve/vue'
import AILoader from './AILoader.vue'
import MarkdownRenderer from './MarkdownRenderer.vue'
import ToolCallGroup from './chat/ToolCallGroup.vue'
import { useVoiceAgent } from '../composables/useVoiceAgent'
import { useAppAgent } from '../composables/useAppAgent'

const voiceAgent = useVoiceAgent()
const eveAgent = useAppAgent()

const latestAiMessage = computed(() => {
  const messages = eveAgent.data.value.messages
  if (!messages || messages.length === 0) return null

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    if (message?.role === 'assistant') {
      return message
    }
  }
  return null
})

type GroupedPart = 
  | { type: 'text', text: string }
  | { type: 'tool-group', tools: import('eve/vue').EveDynamicToolPart[] }

const getGroupedParts = (message: EveMessage) => {
  const groups: GroupedPart[] = []
  let currentToolGroup: import('eve/vue').EveDynamicToolPart[] | null = null

  for (const part of message.parts) {
    if (part.type === 'dynamic-tool') {
      if (!currentToolGroup) {
        currentToolGroup = []
        groups.push({ type: 'tool-group', tools: currentToolGroup })
      }
      currentToolGroup.push(part as import('eve/vue').EveDynamicToolPart)
    } else if (part.type === 'text') {
      currentToolGroup = null
      if (part.text) {
        groups.push({ type: 'text', text: part.text })
      }
    }
  }
  return groups
}

const currentMode = computed(() => {
   if (voiceAgent.isSpeaking.value) return 'speaking'
   
   if (latestAiMessage.value) {
     const hasProcessingTool = latestAiMessage.value.parts.some(p => 
       p.type === 'dynamic-tool' && ['input-streaming', 'input-available', 'approval-requested'].includes(p.state)
     )
     if (hasProcessingTool) return 'tool'
   }

   if (eveAgent.status.value === 'submitted' || eveAgent.status.value === 'streaming') return 'thinking'
   
   return 'idle'
})

const modeColor = computed(() => {
  switch(currentMode.value) {
    case 'speaking': return 'var(--color-success, #10b981)' // Green for talking
    case 'tool': return 'var(--color-purple, #A855F7)' // Purple for tool usage
    case 'thinking': return 'var(--accent, #ff6b8b)' // Pink for thinking
    default: return 'var(--text-muted, #a1a1aa)' // Muted gray for idle
  }
})

const voiceStatusLabel = computed(() => {
  switch(currentMode.value) {
    case 'speaking': return 'Bubbles is speaking...'
    case 'tool': return 'Bubbles is using tools...'
    case 'thinking': return 'Bubbles is thinking...'
    default: return 'Bubbles is ready...'
  }
})
</script>

<template>
  <div class="voice-response-view">
    <div class="voice-response-header">
      <AILoader :size="12" :color="modeColor" :mode="currentMode" />
      <span>{{ voiceStatusLabel }}</span>
    </div>
    
    <div v-if="voiceAgent.transcript.value" class="user-transcript">
      <span class="transcript-label">You:</span> {{ voiceAgent.transcript.value }}
    </div>

    <div v-if="latestAiMessage" class="voice-response-content">
      <template v-for="(group, i) in getGroupedParts(latestAiMessage)" :key="i">
        <MarkdownRenderer v-if="group.type === 'text'" :content="group.text" :isDone="eveAgent.status.value !== 'streaming'" />
        <ToolCallGroup v-else-if="group.type === 'tool-group'" :tools="group.tools" />
      </template>
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
