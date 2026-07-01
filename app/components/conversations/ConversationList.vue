<script setup lang="ts">
import { computed } from 'vue'
import { useConversationStore } from '../../stores/conversations'
import type { ConversationMeta } from '../../../shared/types/conversation.types'

const props = withDefaults(defineProps<{
  showHeader?: boolean
  variant?: 'rail' | 'panel'
}>(), {
  showHeader: true,
  variant: 'rail'
})

const emit = defineEmits<{
  create: [conversation: ConversationMeta]
  select: [conversation: ConversationMeta]
}>()

const conversationStore = useConversationStore()

const conversations = computed(() => conversationStore.sortedConversations)

function getRelativeTime(value: string) {
  const timestamp = new Date(value).getTime()
  const delta = Date.now() - timestamp
  const minute = 60 * 1000
  const hour = minute * 60
  const day = hour * 24

  if (delta < minute) return 'Now'
  if (delta < hour) return `${Math.floor(delta / minute)}m ago`
  if (delta < day) return `${Math.floor(delta / hour)}h ago`
  return `${Math.floor(delta / day)}d ago`
}

async function createChat() {
  const conversation = await conversationStore.createConversation()
  emit('create', conversation)
  emit('select', conversation)
}

async function selectChat(conversation: ConversationMeta) {
  await conversationStore.selectConversation(conversation.id)
  emit('select', conversation)
}

function deleteChat(conversation: ConversationMeta) {
  void conversationStore.deleteConversation(conversation.id)
}

function getItemStyle(index: number) {
  return {
    '--item-delay': `${Math.min(index, 6) * 24}ms`
  }
}
</script>

<template>
  <section class="conversation-list" :class="`conversation-list--${props.variant}`" aria-label="Conversations">
    <div v-if="props.showHeader" class="conversation-list-header">
      <div>
        <p class="eyebrow">Sessions</p>
        <h2>Chats</h2>
      </div>

      <button class="new-chat-btn" type="button" aria-label="Create new chat" @click="createChat">
        <LucidePlus :size="16" stroke-width="2" />
      </button>
    </div>

    <div class="conversation-items" role="list">
      <article
        v-for="(conversation, index) in conversations"
        :key="conversation.id"
        class="conversation-item"
        :class="{ active: conversation.id === conversationStore.activeConversationId }"
        :style="getItemStyle(index)"
        role="listitem"
      >
        <button class="conversation-main" type="button" @click="selectChat(conversation)">
          <span class="conversation-icon" aria-hidden="true">
            <LucideMessageSquare :size="15" stroke-width="1.8" />
          </span>
          <span class="conversation-copy">
            <span class="conversation-title">{{ conversation.title }}</span>
            <span class="conversation-preview">
              {{ conversation.lastMessagePreview || 'Start a new thread' }}
            </span>
            <span class="conversation-meta">
              {{ getRelativeTime(conversation.updatedAt) }}
              <span v-if="conversation.messageCount > 0"> · {{ conversation.messageCount }} messages</span>
            </span>
          </span>
        </button>

        <button
          class="conversation-delete"
          type="button"
          :aria-label="`Delete ${conversation.title}`"
          @click.stop="deleteChat(conversation)"
        >
          <LucideTrash2 :size="14" stroke-width="1.8" />
        </button>
      </article>
    </div>
  </section>
</template>

<style scoped>
.conversation-list {
  display: flex;
  flex-direction: column;
  min-width: 216px;
  width: 232px;
  height: 100%;
  gap: 16px;
  border-right: 1px solid var(--glass-border);
  padding: 4px 16px 4px 0;
}

.conversation-list--panel {
  width: 100%;
  min-width: 0;
  height: 100%;
  gap: 0;
  border-right: 0;
  padding: 0;
}

.conversation-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.eyebrow {
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h2 {
  color: var(--text-primary);
  font-size: 17px;
  font-weight: 500;
  line-height: 1.4;
  text-wrap: balance;
}

.new-chat-btn,
.conversation-delete {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
  border-radius: 8px;
  color: var(--text-secondary);
  transition:
    background-color 150ms cubic-bezier(0.19, 1, 0.22, 1),
    color 150ms cubic-bezier(0.19, 1, 0.22, 1),
    transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.new-chat-btn:hover,
.conversation-delete:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.new-chat-btn:active,
.conversation-delete:active,
.conversation-main:active {
  transform: scale(0.96);
}

.conversation-items {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 2px;
}

.conversation-list--panel .conversation-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(232px, 1fr));
  align-content: start;
  gap: 8px;
  padding: 2px 4px 12px 2px;
}

.conversation-items::-webkit-scrollbar {
  width: 4px;
}

.conversation-items::-webkit-scrollbar-thumb {
  background: var(--glass-border);
  border-radius: 9999px;
}

.conversation-item {
  position: relative;
  border: 1px solid transparent;
  border-radius: 12px;
  opacity: 0;
  transform: translateY(6px);
  animation: item-enter 220ms cubic-bezier(0.19, 1, 0.22, 1) forwards;
  animation-delay: var(--item-delay);
  transition:
    border-color 180ms cubic-bezier(0.19, 1, 0.22, 1),
    background-color 180ms cubic-bezier(0.19, 1, 0.22, 1);
}

.conversation-item:hover {
  background: var(--hover-bg);
}

.conversation-list--panel .conversation-item {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.055);
}

.conversation-item.active {
  background: var(--hover-bg);
  border-color: var(--glass-border);
}

.conversation-list--panel .conversation-item.active {
  background: rgba(255, 255, 255, 0.035);
  border-color: rgba(255, 255, 255, 0.11);
}

.conversation-main {
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-height: 76px;
  gap: 10px;
  padding: 12px 38px 12px 12px;
  text-align: left;
  border-radius: 11px;
  transition: transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.conversation-list--panel .conversation-main {
  min-height: 72px;
  padding: 10px 36px 10px 10px;
}

.conversation-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  border-radius: 8px;
  background: var(--glass-border);
  color: var(--text-secondary);
}

.conversation-copy {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 2px;
}

.conversation-title,
.conversation-preview,
.conversation-meta {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-title {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
}

.conversation-preview {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.conversation-meta {
  color: var(--text-muted);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  line-height: 1.4;
}

.conversation-delete {
  position: absolute;
  top: 6px;
  right: 4px;
  min-width: 32px;
  min-height: 32px;
  opacity: 0;
}

.conversation-item:hover .conversation-delete,
.conversation-delete:focus-visible {
  opacity: 1;
}

@keyframes item-enter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .conversation-item {
    animation: none;
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 760px) {
  .conversation-list {
    width: 100%;
    min-height: 180px;
    height: auto;
    padding: 0 0 16px 0;
    border-right: 0;
    border-bottom: 1px solid var(--glass-border);
  }

  .conversation-items {
    max-height: 220px;
  }

  .conversation-list--panel {
    min-height: 0;
    height: 100%;
    padding: 0;
    border-bottom: 0;
  }

.conversation-list--panel .conversation-items {
    max-height: none;
    grid-template-columns: 1fr;
  }
}
</style>
