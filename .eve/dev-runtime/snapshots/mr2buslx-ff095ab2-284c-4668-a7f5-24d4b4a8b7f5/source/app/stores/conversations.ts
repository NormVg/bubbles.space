import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { EveMessage } from 'eve/vue'
import type { HandleMessageStreamEvent, SessionState } from 'eve/client'

export interface ConversationRecord {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  session?: SessionState
  events: HandleMessageStreamEvent[]
  messageCount: number
  lastMessagePreview: string
}

function createConversationRecord(title = 'New chat'): ConversationRecord {
  const now = new Date().toISOString()

  return {
    id: crypto.randomUUID(),
    title,
    createdAt: now,
    updatedAt: now,
    events: [],
    messageCount: 0,
    lastMessagePreview: ''
  }
}

function getMessageText(message: EveMessage) {
  return message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('')
    .trim()
}

function createTitleFromMessages(messages: readonly EveMessage[]) {
  const firstUserText = messages
    .filter(message => message.role === 'user')
    .map(getMessageText)
    .find(text => text.length > 0)

  if (!firstUserText) return 'New chat'

  return firstUserText.length > 44 ? `${firstUserText.slice(0, 44).trim()}...` : firstUserText
}

function createPreviewFromMessages(messages: readonly EveMessage[]) {
  const lastText = [...messages]
    .reverse()
    .map(getMessageText)
    .find(text => text.length > 0)

  if (!lastText) return ''

  return lastText.length > 72 ? `${lastText.slice(0, 72).trim()}...` : lastText
}

export const useConversationStore = defineStore('conversations', () => {
  const conversations = useLocalStorage<ConversationRecord[]>('bubbles-conversations', [])
  const activeConversationId = useLocalStorage<string>('bubbles-active-conversation-id', '')

  const sortedConversations = computed(() =>
    [...conversations.value].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  )

  const activeConversation = computed(() =>
    conversations.value.find(conversation => conversation.id === activeConversationId.value) ?? null
  )

  function ensureConversation() {
    if (conversations.value.length === 0) {
      const conversation = createConversationRecord()
      conversations.value = [conversation]
      activeConversationId.value = conversation.id
      return conversation
    }

    const active = activeConversation.value
    if (active) return active

    activeConversationId.value = conversations.value[0]?.id ?? ''
    return activeConversation.value
  }

  function createConversation(title = 'New chat') {
    const conversation = createConversationRecord(title)
    conversations.value = [conversation, ...conversations.value]
    activeConversationId.value = conversation.id
    return conversation
  }

  function selectConversation(id: string) {
    if (conversations.value.some(conversation => conversation.id === id)) {
      activeConversationId.value = id
    }
  }

  function deleteConversation(id: string) {
    const nextConversations = conversations.value.filter(conversation => conversation.id !== id)

    if (nextConversations.length === 0) {
      const fallback = createConversationRecord()
      conversations.value = [fallback]
      activeConversationId.value = fallback.id
      return
    }

    conversations.value = nextConversations
    if (activeConversationId.value === id) {
      activeConversationId.value = nextConversations[0]?.id ?? ''
    }
  }

  function updateSession(id: string, session: SessionState) {
    conversations.value = conversations.value.map(conversation =>
      conversation.id === id ? { ...conversation, session } : conversation
    )
  }

  function updateFromAgentSnapshot(
    id: string,
    input: {
      events: readonly HandleMessageStreamEvent[]
      messages: readonly EveMessage[]
      session: SessionState
    }
  ) {
    const now = new Date().toISOString()
    const messageCount = input.messages.length

    conversations.value = conversations.value.map(conversation => {
      if (conversation.id !== id) return conversation

      const title = conversation.title === 'New chat'
        ? createTitleFromMessages(input.messages)
        : conversation.title

      return {
        ...conversation,
        title,
        updatedAt: messageCount > conversation.messageCount ? now : conversation.updatedAt,
        session: input.session,
        events: [...input.events],
        messageCount,
        lastMessagePreview: createPreviewFromMessages(input.messages)
      }
    })
  }

  return {
    activeConversation,
    activeConversationId,
    conversations,
    sortedConversations,
    createConversation,
    deleteConversation,
    ensureConversation,
    selectConversation,
    updateFromAgentSnapshot,
    updateSession
  }
})
