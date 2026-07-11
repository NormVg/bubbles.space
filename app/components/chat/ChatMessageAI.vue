<template>
  <div class="ai-message-wrapper">
    <div class="ai-message">
      <template v-for="(group, i) in groupedParts" :key="i">
        <details v-if="group.type === 'reasoning' && group.reasoning" class="reasoning-block">
          <summary>Thought Process</summary>
          <div class="reasoning-content">{{ group.reasoning }}</div>
        </details>
        <MarkdownRenderer v-else-if="group.type === 'text'" :content="group.text" :isDone="isDone" />
        <ToolCallGroup v-else-if="group.type === 'tool-group'" :tools="group.tools" />
      </template>
    </div>
    <div class="ai-message-actions">
      <button class="chat-action-btn" title="Copy" @click="emit('copy')">
        <LucideCopy :size="14" stroke-width="2.5" />
        <span>Copy</span>
      </button>
      <button class="chat-action-btn" title="Reply" @click="emit('reply')">
        <LucideReply :size="14" stroke-width="2.5" />
        <span>Reply</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EveMessage, EveDynamicToolPart } from 'eve/vue'

import MarkdownRenderer from '../MarkdownRenderer.vue'
import ToolCallGroup from './ToolCallGroup.vue'

const props = defineProps<{
  message: EveMessage
  isDone: boolean
}>()

const emit = defineEmits<{
  (e: 'copy'): void
  (e: 'reply'): void
}>()

type GroupedPart = 
  | { type: 'text', text: string }
  | { type: 'tool-group', tools: EveDynamicToolPart[] }
  | { type: 'reasoning', reasoning: string }

const groupedParts = computed(() => {
  const groups: GroupedPart[] = []
  let currentToolGroup: EveDynamicToolPart[] | null = null

  for (const part of props.message.parts) {
    if (part.type === 'dynamic-tool') {
      if (!currentToolGroup) {
        currentToolGroup = []
        groups.push({ type: 'tool-group', tools: currentToolGroup })
      }
      currentToolGroup.push(part as EveDynamicToolPart)
    } else if (part.type === 'text') {
      currentToolGroup = null
      groups.push({ type: 'text', text: part.text })
    } else if ((part as any).type === 'reasoning') {
      currentToolGroup = null
      groups.push({ type: 'reasoning', reasoning: (part as any).reasoning || (part as any).text || '' })
    }
  }
  return groups
})
</script>

<style scoped>
.ai-message-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 32px;
}

.ai-message {
  width: 100%;
  max-width: calc(100% - 24px);
  align-self: flex-start;
  margin-bottom: 8px;
}

.ai-message-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.ai-message-wrapper:hover .ai-message-actions {
  opacity: 1;
}

.chat-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chat-action-btn:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

/* ─── Reasoning Block ──────────────────────────────────────── */
.reasoning-block {
  margin-bottom: 12px;
  background: var(--bg-soft);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  overflow: hidden;
}

.reasoning-block summary {
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-muted);
  cursor: pointer;
  user-select: none;
  background: var(--bg-soft);
}

.reasoning-block summary:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.reasoning-content {
  padding: 12px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  border-top: 1px solid var(--border-subtle);
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
}
</style>
