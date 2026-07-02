import { defineStore } from 'pinia'
import { computed, ref, shallowRef, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { EveMessage } from 'eve/vue'
import type { HandleMessageStreamEvent, SessionState } from 'eve/client'
import type { ConversationMeta, ConversationDetail } from '../../shared/types/conversation.types'
import { conversationService } from '../services/conversation.service'

export const useConversationStore = defineStore('conversations', () => {
  // Use useLocalStorage just to persist the active ID, as it is very small
  const activeConversationId = useLocalStorage<string>('bubbles-active-conversation-id', '')
  
  // State
  const metaList = shallowRef<ConversationMeta[]>([])
  const activeDetail = shallowRef<ConversationDetail | null>(null)
  const isInitialized = ref(false)
  const isInitializing = ref(false)

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
    if (typeof window === 'undefined') return // SSR guard

    const loadedMeta = await conversationService.loadMetadataList()
    metaList.value = loadedMeta
    if (loadedMeta.length === 0) {
      await ensureConversation()
    } else if (!activeConversationId.value || !loadedMeta.find(m => m.id === activeConversationId.value)) {
      await selectConversation(loadedMeta[0]!.id)
    } else {
      // Reload active detail
      await loadActiveDetail(activeConversationId.value)
    }

    isInitialized.value = true
    isInitializing.value = false
  }

  async function loadActiveDetail(id: string) {
    if (!id) return
    const detail = await conversationService.loadDetail(id)
    if (detail) {
      activeDetail.value = detail
      activeConversationId.value = id
    }
  }

  // Watch for active ID changes from outside (like other tabs via LocalStorage)
  watch(activeConversationId, (newId) => {
    if (isInitialized.value && newId && (!activeDetail.value || activeDetail.value.id !== newId)) {
      void loadActiveDetail(newId)
    }
  })

  // Actions
  async function ensureConversation() {
    if (!isInitialized.value && !isInitializing.value) await init()
    if (metaList.value.length === 0) {
      const { meta, detail } = await conversationService.createNewConversation()
      metaList.value = [meta]
      activeDetail.value = detail
      activeConversationId.value = meta.id
      return meta
    }
    const active = activeConversationMeta.value
    if (active) return active

    activeConversationId.value = metaList.value[0]?.id ?? ''
    return activeConversationMeta.value
  }

  async function createConversation(title = 'New chat') {
    const { meta, detail } = await conversationService.createNewConversation(title)
    metaList.value = [meta, ...metaList.value]
    activeDetail.value = detail
    activeConversationId.value = meta.id
    return meta
  }

  async function selectConversation(id: string) {
    if (metaList.value.some((c: ConversationMeta) => c.id === id)) {
      await loadActiveDetail(id)
    }
  }

  async function deleteConversation(id: string) {
    await conversationService.deleteConversation(id)
    
    metaList.value = metaList.value.filter((c: ConversationMeta) => c.id !== id)

    if (metaList.value.length === 0) {
      const { meta, detail } = await conversationService.createNewConversation()
      metaList.value = [meta]
      activeDetail.value = detail
      activeConversationId.value = meta.id
      return
    }

    if (activeConversationId.value === id) {
      await selectConversation(metaList.value[0]?.id ?? '')
    }
  }

  async function updateSession(id: string, session: SessionState) {
    await conversationService.updateSessionOnly(id, session)
    if (activeDetail.value && activeDetail.value.id === id) {
      activeDetail.value = { ...activeDetail.value, session }
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

    const { meta: nextMeta, detail: nextDetail } = await conversationService.saveSnapshot(currentMeta, input)
    
    // Update local reactive state
    const newMetaList = [...metaList.value]
    const index = newMetaList.findIndex((m: ConversationMeta) => m.id === id)
    if (index >= 0) {
      newMetaList[index] = nextMeta
    }
    // Re-sort
    newMetaList.sort((a: ConversationMeta, b: ConversationMeta) => b.updatedAt.localeCompare(a.updatedAt))
    metaList.value = newMetaList

    if (activeDetail.value && activeDetail.value.id === id) {
      activeDetail.value = nextDetail
    }
  }

  return {
    init,
    isInitialized,
    activeConversation: activeConversationMeta, // Kept for backwards compatibility
    activeConversationId,
    conversations: metaList, // Kept for backwards compatibility
    activeDetail,
    activeConversationEvents,
    sortedConversations,
    createConversation,
    deleteConversation,
    ensureConversation,
    selectConversation,
    updateFromAgentSnapshot,
    updateSession
  }
})
