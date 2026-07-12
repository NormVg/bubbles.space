import { watch } from 'vue'
import { authClient } from '~/utils/auth-client'
import { ydoc, idbProvider } from '~/utils/yjs'
import * as Y from 'yjs'
import { useConversationStore } from '~/stores/conversations'
import { useWidgetStore } from '~/stores/widgets'
import { bytesToBase64 } from '~/utils/base64'

let worker: Worker | null = null
const localInstanceId = crypto.randomUUID()
let isInitializingAbly = false
let initComplete = false

export function useRealtimeSync() {
  const authState = authClient.useSession()

  // If already initialized, return the publisher
  if (initComplete) {
    return {
      publish: (event: string, data: any) => {
        if (event === 'sync:conversation') {
          worker?.postMessage({ type: 'PUBLISH_CONVERSATION', payload: data })
        }
      }
    }
  }

  const init = async () => {
    isInitializingAbly = true
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

    if (!worker && import.meta.client) {
      worker = new Worker(new URL('../workers/sync.worker.ts', import.meta.url), { type: 'module' })
      
      worker.onmessage = (event) => {
        const { type, payload } = event.data
        if (type === 'REMOTE_UPDATE') {
           Y.applyUpdate(ydoc, payload.update, 'worker')
        } else if (type === 'CONVERSATION_SYNC') {
           const conversationStore = useConversationStore()
           if (payload.action === 'delete') {
              if (conversationStore.activeConversationId === payload.id) {
                 void conversationStore.ensureConversation()
              } else {
                 void conversationStore.reloadMetadata()
              }
           } else {
              if (conversationStore.activeConversationId === payload.id) {
                 void conversationStore.reloadMetadata()
                 void conversationStore.selectConversation(payload.id)
              } else {
                 void conversationStore.reloadMetadata()
              }
           }
        }
      }

      let updateBuffer: Uint8Array[] = []
      let syncTimeout: any = null

      ydoc.on('update', (update, origin) => {
         // Prevent echo: don't send updates that originated from the worker or local DB
         if (origin !== 'worker' && origin !== 'server' && origin !== idbProvider) {
            worker?.postMessage({ type: 'LOCAL_UPDATE', payload: { update } })
            
            // Buffer updates to sync with cloud DB
            updateBuffer.push(update)
            
            const widgetStore = useWidgetStore()
            widgetStore.syncStatus = 'syncing'
            widgetStore.isSyncPending = true
            
            clearTimeout(syncTimeout)
            syncTimeout = setTimeout(async () => {
               if (updateBuffer.length === 0) return
               const merged = Y.mergeUpdates(updateBuffer)
               updateBuffer = []
               try {
                  await $fetch('/api/crdt/sync', { 
                     method: 'POST', 
                     body: { update: bytesToBase64(merged) } 
                  })
                  widgetStore.syncStatus = 'saved'
                  widgetStore.isSyncPending = false
               } catch (e) {
                  console.error('Failed to sync to cloud:', e)
                  widgetStore.syncStatus = 'error'
                  widgetStore.isSyncPending = false
               }
            }, 3000)
         }
      })

      const tokenUrl = window.location.origin + '/api/ably-token'
      worker.postMessage({
         type: 'INIT',
         payload: { userId, instanceId: localInstanceId, tokenUrl }
      })
    }

    // Safety net: Tab focus re-fetch
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab focused, re-syncing from DB...')
        const conversationStore = useConversationStore()
        void conversationStore.reloadMetadata()
        if (conversationStore.activeConversationId) {
          void conversationStore.selectConversation(conversationStore.activeConversationId)
        }
        
        // Actually, we should trigger a CRDT full-sync here to catch up on anything missed while sleeping
        // We can do this in Phase 3/4 via a REST call to POST /api/crdt/sync
      }
    }
    window.addEventListener('visibilitychange', handleVisibility)

    // We don't remove this event listener since the app stays alive and this is a singleton pattern
    
    initComplete = true
  }
  
  if (import.meta.client && !initComplete && !isInitializingAbly) {
    void init()
  }

  return {
    publish: (event: string, data: any) => {
      if (event === 'sync:conversation') {
        worker?.postMessage({ type: 'PUBLISH_CONVERSATION', payload: data })
      }
    }
  }
}
