import { defineStore } from 'pinia'
import { computed, ref, shallowRef, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { EveMessage } from 'eve/vue'
import type { HandleMessageStreamEvent, SessionState } from 'eve/client'
import type { ConversationMeta, ConversationDetail } from '../../shared/types/conversation.types'

export const useConversationStore = defineStore('conversations', () => {
  // Use useLocalStorage just to persist the active ID, as it is very small
  const activeConversationId = useLocalStorage<string>('bubbles-active-conversation-id', '')
  
  // State
  const metaList = shallowRef<ConversationMeta[]>([])
  const activeDetail = shallowRef<ConversationDetail | null>(null)
  const isInitialized = ref(false)
  const isInitializing = ref(false)
  
  // A key to force AgentSessionProvider to remount if the agent gets permanently stuck
  const agentSessionKey = ref(0)
  
  const { publish } = useRealtimeSync()

  // Anti-stale load guard
  let detailLoadCounter = 0

  // Getters
  const sortedConversations = computed(() => [...metaList.value])
  const activeConversationMeta = computed(() =>
    metaList.value.find((c: ConversationMeta) => c.id === activeConversationId.value) ?? null
  )
  const activeConversationEvents = computed(() => activeDetail.value?.events ?? [])

  // Initialization
  async function init() {
    if (isInitialized.value || isInitializing.value) return
    isInitializing.value = true
    
    try {
      // 1. Instant Local Load
      const localMetaStr = localStorage.getItem('bubbles-meta-conversations')
      let hasLocalData = false
      if (localMetaStr) {
        const parsed = JSON.parse(localMetaStr)
        if (Array.isArray(parsed) && parsed.length > 0) {
          metaList.value = parsed
          hasLocalData = true
        }
      }

      // 2. Background DB Sync
      try {
        const serverMeta = await $fetch<ConversationMeta[]>('/api/chat')
        
        if (serverMeta && serverMeta.length > 0) {
          metaList.value = serverMeta
          localStorage.setItem('bubbles-meta-conversations', JSON.stringify(serverMeta))
        } else if (hasLocalData) {
          // DB is empty but we have local data. Push legacy chats to DB.
          for (const meta of metaList.value) {
            const detailStr = localStorage.getItem(`bubbles-conv-${meta.id}`)
            if (detailStr) {
              const detail = JSON.parse(detailStr)
              await $fetch('/api/chat', { method: 'POST', body: { ...meta, ...detail } })
            }
          }
        }
      } catch (dbErr) {
        console.error('Failed to load chat metadata from DB:', dbErr)
      }

      if (metaList.value.length === 0) {
        await ensureConversation()
      } else if (!activeConversationId.value || !metaList.value.find(m => m.id === activeConversationId.value)) {
        await selectConversation(metaList.value[0]!.id)
      } else {
        await loadActiveDetail(activeConversationId.value)
      }
    } catch (e) {
      console.error('Failed to init conversations:', e)
    }

    isInitialized.value = true
    isInitializing.value = false
  }

  async function reloadMetadata() {
    try {
      const serverMeta = await $fetch<ConversationMeta[]>('/api/chat')
      if (serverMeta) {
        metaList.value = serverMeta
        localStorage.setItem('bubbles-meta-conversations', JSON.stringify(serverMeta))
      }
    } catch (e) {
      console.error('Failed to reload chat metadata from DB:', e)
    }
  }

  async function loadActiveDetail(id: string) {
    if (!id) return
    
    const currentLoadId = ++detailLoadCounter
    
    // 1. Instant Local Load
    const localDetailStr = localStorage.getItem(`bubbles-conv-${id}`)
    if (localDetailStr) {
      activeDetail.value = JSON.parse(localDetailStr)
      activeConversationId.value = id
    }

    // 2. Background DB Sync
    try {
      const serverDetail = await $fetch<ConversationDetail & ConversationMeta>(`/api/chat/${id}`)
      if (currentLoadId !== detailLoadCounter) {
        // A newer load has superseded this response. Discard it.
        return
      }
      if (serverDetail) {
        activeDetail.value = serverDetail
        activeConversationId.value = id
        try {
          localStorage.setItem(`bubbles-conv-${id}`, JSON.stringify(serverDetail))
        } catch (storageError) {
          console.warn('Could not save conversation to localStorage (quota exceeded)', storageError)
        }
      }
    } catch (e) {
      console.error('Failed to fetch chat details from DB:', e)
    }
  }

  // Watch for active ID changes from outside (like other tabs via LocalStorage)
  watch(activeConversationId, (newId) => {
    if (isInitialized.value && newId && (!activeDetail.value || activeDetail.value.id !== newId)) {
      void loadActiveDetail(newId)
    }
  })

  // Debounced Sync Engine (Per Conversation)
  const syncTimeouts = new Map<string, any>()
  const pendingSyncs = new Map<string, () => Promise<void>>()

  function flushSync(id: string) {
    if (syncTimeouts.has(id)) {
      clearTimeout(syncTimeouts.get(id))
      syncTimeouts.delete(id)
    }
    const syncFn = pendingSyncs.get(id)
    if (syncFn) {
      pendingSyncs.delete(id)
      void syncFn()
    }
  }

  async function syncChatToDB(meta: ConversationMeta, detail: ConversationDetail) {
    // 1. Instant Local Save
    localStorage.setItem(`bubbles-conv-${meta.id}`, JSON.stringify(detail))
    localStorage.setItem('bubbles-meta-conversations', JSON.stringify(metaList.value))

    // 2. Debounced DB Save per conversation
    if (syncTimeouts.has(meta.id)) {
      clearTimeout(syncTimeouts.get(meta.id))
    }
    
    const syncFn = async () => {
      try {
        await $fetch('/api/chat', {
          method: 'POST',
          body: { ...meta, ...detail }
        })
        publish('sync:conversation', { id: meta.id, action: 'upsert', ts: Date.now() })
      } catch (e) {
        console.error('Failed to sync chat to DB:', e)
      }
    }
    
    pendingSyncs.set(meta.id, syncFn)

    syncTimeouts.set(meta.id, setTimeout(() => {
      syncTimeouts.delete(meta.id)
      pendingSyncs.delete(meta.id)
      void syncFn()
    }, 2000))
  }

  // Actions
  async function ensureConversation() {
    if (!isInitialized.value && !isInitializing.value) await init()
    if (metaList.value.length === 0) {
      return await createConversation()
    }
    const active = activeConversationMeta.value
    if (active) return active

    activeConversationId.value = metaList.value[0]?.id ?? ''
    return activeConversationMeta.value
  }

  async function createConversation(title = 'New chat') {
    const now = new Date().toISOString()
    const id = crypto.randomUUID()
    
    const meta: ConversationMeta = {
      id, title, createdAt: now, updatedAt: now, messageCount: 0, lastMessagePreview: ''
    }
    const detail: ConversationDetail = {
      id, events: []
    }
    
    metaList.value = [meta, ...metaList.value]
    activeDetail.value = detail
    activeConversationId.value = id
    
    await syncChatToDB(meta, detail)
    return meta
  }

  async function selectConversation(id: string) {
    if (activeConversationId.value && activeConversationId.value !== id) {
      flushSync(activeConversationId.value)
    }
    if (metaList.value.some((c: ConversationMeta) => c.id === id)) {
      await loadActiveDetail(id)
    }
  }

  function forceReloadAgent() {
    agentSessionKey.value++
  }

  async function deleteConversation(id: string) {
    // 1. Synchronously clear timers and discard pending syncs
    if (syncTimeouts.has(id)) {
      clearTimeout(syncTimeouts.get(id))
      syncTimeouts.delete(id)
    }
    pendingSyncs.delete(id)
    
    // 2. Optimistically update local state BEFORE network requests!
    // This prevents AgentSessionProvider from recreating it during unmount or background throttles.
    localStorage.removeItem(`bubbles-conv-${id}`)
    metaList.value = metaList.value.filter((c: ConversationMeta) => c.id !== id)
    localStorage.setItem('bubbles-meta-conversations', JSON.stringify(metaList.value))

    if (metaList.value.length === 0) {
      // Don't await createConversation, just trigger it so the UI responds instantly
      void createConversation()
    } else if (activeConversationId.value === id) {
      // Don't await selectConversation
      void selectConversation(metaList.value[0]?.id ?? '')
    }

    // 3. Perform network delete in the background
    try {
      await $fetch(`/api/chat/${id}`, { method: 'DELETE' })
      publish('sync:conversation', { id, action: 'delete', ts: Date.now() })
    } catch (e) {
      console.error('Failed to delete chat from DB:', e)
      // Optional: rollback on failure, but for delete it's usually fine to just log
    }
  }

  async function updateSession(id: string, session: SessionState) {
    const meta = metaList.value.find(m => m.id === id)
    if (!meta) return
    
    if (activeDetail.value && activeDetail.value.id === id) {
      activeDetail.value = { ...activeDetail.value, session }
      await syncChatToDB(meta, activeDetail.value)
    } else {
      // If updating a non-active session, load it first
      const localDetailStr = localStorage.getItem(`bubbles-conv-${id}`)
      if (localDetailStr) {
        const detail = JSON.parse(localDetailStr)
        detail.session = session
        await syncChatToDB(meta, detail)
      }
    }
  }

  async function updateFromAgentSnapshot(
    id: string,
    input: {
      events: readonly HandleMessageStreamEvent[]
      messages: readonly EveMessage[]
      session: SessionState
    }
  ) {
    const currentMeta = metaList.value.find((m: ConversationMeta) => m.id === id)
    if (!currentMeta) return

    const now = new Date().toISOString()
    const messageCount = input.messages.length

    // Helper functions directly inside
    const getMessageText = (message: EveMessage): string => {
      const raw = message.parts.filter(part => part.type === 'text').map(part => part.text).join('')
      return raw.replace(/<system_context>[\s\S]*?<\/system_context>\n*/g, '').replace(/\[Widget: .*?\][\s\S]*?\[\/Widget\]\n*/g, '').trim()
    }
    
    const createTitle = (messages: readonly EveMessage[]): string => {
      const firstUserText = messages.filter(message => message.role === 'user').map(m => getMessageText(m)).find(text => text.length > 0)
      if (!firstUserText) return 'New chat'
      return firstUserText.length > 44 ? `${firstUserText.slice(0, 44).trim()}...` : firstUserText
    }
    
    const createPreview = (messages: readonly EveMessage[]): string => {
      const lastText = [...messages].reverse().map(m => getMessageText(m)).find(text => text.length > 0)
      if (!lastText) return ''
      return lastText.length > 72 ? `${lastText.slice(0, 72).trim()}...` : lastText
    }

    const title = currentMeta.title === 'New chat' ? createTitle(input.messages) : currentMeta.title

    const nextMeta: ConversationMeta = {
      ...currentMeta,
      title,
      updatedAt: messageCount > currentMeta.messageCount ? now : currentMeta.updatedAt,
      messageCount,
      lastMessagePreview: createPreview(input.messages)
    }

    const nextDetail: ConversationDetail = {
      id: currentMeta.id,
      session: input.session,
      events: [...input.events]
    }
    
    // Update local reactive state
    const newMetaList = [...metaList.value]
    const index = newMetaList.findIndex((m: ConversationMeta) => m.id === id)
    if (index >= 0) {
      newMetaList[index] = nextMeta
    }
    newMetaList.sort((a: ConversationMeta, b: ConversationMeta) => b.updatedAt.localeCompare(a.updatedAt))
    metaList.value = newMetaList

    if (activeDetail.value && activeDetail.value.id === id) {
      activeDetail.value = nextDetail
    }

    await syncChatToDB(nextMeta, nextDetail)
  }

  return {
    init,
    isInitialized,
    activeConversation: activeConversationMeta, // Kept for backwards compatibility
    activeConversationId,
    agentSessionKey,
    conversations: metaList, // Kept for backwards compatibility
    activeDetail,
    activeConversationEvents,
    sortedConversations,
    createConversation,
    deleteConversation,
    ensureConversation,
    selectConversation,
    flushSync,
    forceReloadAgent,
    reloadMetadata,
    updateFromAgentSnapshot,
    updateSession
  }
})
