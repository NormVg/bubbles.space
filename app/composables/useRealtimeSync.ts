import * as Ably from 'ably'
import { onMounted, onBeforeUnmount } from 'vue'
import { authClient } from '~/utils/auth-client'

let globalClient: Ably.Realtime | null = null
let channel: Ably.RealtimeChannel | null = null

export function useRealtimeSync() {
  const authState = authClient.useSession()

  // If already initialized, return the publisher
  if (globalClient) {
    return {
      publish: (event: string, data: any) => {
        if (channel) channel.publish(event, data)
      }
    }
  }

  const init = async () => {
    // We need to wait for auth state to be ready
    if (authState.value.isPending) {
      await new Promise<void>(resolve => {
        const unwatch = watch(() => authState.value.isPending, (isPending) => {
          if (!isPending) {
            unwatch()
            resolve()
          }
        })
      })
    }

    if (!authState.value.data?.user?.id) return
    const userId = authState.value.data.user.id

    globalClient = new Ably.Realtime({
      authUrl: '/api/ably-token'
    })

    channel = globalClient.channels.get(`user:${userId}`)

    // Handle widget syncs
    let widgetSyncTimeout: any = null
    channel.subscribe('sync:widgets', (msg) => {
      // Ignore our own events
      if (msg.connectionId === globalClient?.connection.id) return
      
      console.log('Received remote widget sync', msg.data)
      
      // Debounce re-fetch to avoid spamming the DB
      if (widgetSyncTimeout) clearTimeout(widgetSyncTimeout)
      widgetSyncTimeout = setTimeout(() => {
        const widgetStore = useWidgetStore()
        void widgetStore.reloadFromServer()
      }, 500)
    })

    // Handle conversation syncs
    let conversationSyncTimeout: any = null
    channel.subscribe('sync:conversation', (msg) => {
      if (msg.connectionId === globalClient?.connection.id) return
      console.log('Received remote conversation sync', msg.data)
      
      const data = msg.data as { id: string, action: 'upsert' | 'delete' }
      const conversationStore = useConversationStore()
      
      if (data.action === 'delete') {
        if (conversationStore.activeConversationId === data.id) {
           void conversationStore.ensureConversation() // Will redirect to a valid conversation
        } else {
           void conversationStore.reloadMetadata()
        }
      } else {
        if (conversationStore.activeConversationId === data.id) {
          void conversationStore.reloadMetadata()
          void conversationStore.selectConversation(data.id)
        } else {
          void conversationStore.reloadMetadata()
        }
      }
    })
    
    // Safety net: Tab focus re-fetch
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab focused, re-syncing from DB...')
        const conversationStore = useConversationStore()
        const widgetStore = useWidgetStore()
        void conversationStore.reloadMetadata()
        if (conversationStore.activeConversationId) {
          void conversationStore.selectConversation(conversationStore.activeConversationId)
        }
        void widgetStore.reloadFromServer()
      }
    }
    window.addEventListener('visibilitychange', handleVisibility)
  }
  
  onMounted(() => {
    if (!globalClient) {
      void init()
    }
  })

  return {
    publish: (event: string, data: any) => {
      if (channel) channel.publish(event, data)
    }
  }
}
