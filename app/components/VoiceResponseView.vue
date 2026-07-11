<script setup lang="ts">
import { computed } from 'vue'
import type { EveMessage } from 'eve/vue'
import AILoader from './AILoader.vue'
import MarkdownRenderer from './MarkdownRenderer.vue'
import ToolCallGroup from './chat/ToolCallGroup.vue'
import { useVoiceAgent } from '../composables/useVoiceAgent'
import { useAppAgent } from '../composables/useAppAgent'
import { useChatStore } from '../stores/chat'

const voiceAgent = useVoiceAgent()
const eveAgent = useAppAgent()
const chatStore = useChatStore()

const latestAiMessage = computed(() => {
  const messages = eveAgent.data.value.messages
  if (!messages || messages.length === 0) return null

  const lastMessage = messages[messages.length - 1]
  
  // Only show the AI message if it is currently responding or has just responded to the latest prompt.
  // If the last message in history is a user message, the AI hasn't responded yet, so show nothing (hide old AI messages).
  if (lastMessage && lastMessage.role === 'assistant') {
    return lastMessage
  }
  
  return null
})

type GroupedPart = 
  | { type: 'text', text: string }
  | { type: 'tool-group', tools: import('eve/vue').EveDynamicToolPart[] }
  | { type: 'reasoning', reasoning: string }

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
    } else if ((part as any).type === 'reasoning') {
      currentToolGroup = null
      groups.push({ type: 'reasoning', reasoning: (part as any).reasoning || (part as any).text || '' })
    }
  }
  return groups
}

const currentMode = computed(() => {
   if (voiceAgent.isSpeaking.value) return 'speaking'
   
   if (latestAiMessage.value) {
     const hasProcessingTool = latestAiMessage.value.parts.some(p => 
       p.type === 'dynamic-tool' && ['input-streaming', 'input-available', 'approval-requested', 'running'].includes(p.state)
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
    <TransitionGroup name="context-pill" tag="div" class="voice-contexts">
      <div v-for="ctx in chatStore.pendingWidgetContexts" :key="ctx.id" class="voice-context-pill">
        <LucidePaperclip :size="10" stroke-width="2.5" />
        <span>{{ ctx.label }}</span>
        <button class="voice-context-clear" @click="chatStore.removeWidgetContext(ctx.id)" aria-label="Remove context" title="Remove context">
          <LucideX :size="10" stroke-width="2.5" />
        </button>
      </div>
    </TransitionGroup>
    
    <div v-if="voiceAgent.transcript.value" class="user-transcript">
      <span class="transcript-label">You:</span> {{ voiceAgent.transcript.value }}
    </div>

    <div v-if="latestAiMessage && voiceAgent.voiceSessionActive.value && eveAgent.status.value !== 'submitted' && !voiceAgent.isListening.value && !voiceAgent.isProcessingVoice.value" class="voice-response-content">
        <template v-for="(group, i) in getGroupedParts(latestAiMessage)" :key="i">
          <details v-if="group.type === 'reasoning' && group.reasoning" class="reasoning-block">
            <summary>Thought Process</summary>
            <div class="reasoning-content">{{ group.reasoning }}</div>
          </details>
          <MarkdownRenderer v-else-if="group.type === 'text'" :content="group.text" :isDone="eveAgent.status.value !== 'streaming'" />
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

.voice-contexts {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.voice-context-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 11px;
  color: var(--text-secondary);
  width: fit-content;
}

html.light .voice-context-pill {
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.06);
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

/* TransitionGroup Animations for Pills */
.context-pill-enter-active,
.context-pill-leave-active,
.context-pill-move {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  max-height: 40px;
}

.context-pill-enter-from,
.context-pill-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(4px);
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  border-width: 0;
}

.voice-contexts:empty {
  margin-bottom: 0;
}

.voice-context-clear {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  margin-left: 2px;
}

.voice-context-clear:hover {
  background: var(--glass-border);
  color: var(--text-primary);
}
</style>
