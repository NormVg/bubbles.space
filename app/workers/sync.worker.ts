import * as Ably from 'ably'
import { bytesToBase64, base64ToBytes } from '../utils/base64'

let client: Ably.Realtime | null = null
let channel: Ably.RealtimeChannel | null = null
let localInstanceId = ''

self.onmessage = async (event) => {
  const { type, payload } = event.data

  if (type === 'INIT') {
    const { userId, instanceId, tokenUrl } = payload
    localInstanceId = instanceId
    
    // Initialize Ably
    client = new Ably.Realtime({ authUrl: tokenUrl })
    channel = client.channels.get(`user:${userId}`)
    
    // Listen for incoming Yjs updates from other tabs/devices
    channel.subscribe('crdt:update', (msg) => {
      if (msg.data.senderId === localInstanceId) return
      
      let updateData = msg.data.update
      if (typeof updateData === 'string') {
         updateData = base64ToBytes(updateData)
      }

      self.postMessage({
        type: 'REMOTE_UPDATE',
        payload: { update: updateData }
      })
    })
    
    // Listen for legacy conversation syncs
    channel.subscribe('sync:conversation', (msg) => {
      if (msg.data.senderId === localInstanceId) return
      self.postMessage({
        type: 'CONVERSATION_SYNC',
        payload: msg.data
      })
    })

    console.log(`[SyncWorker] Initialized for user ${userId}`)
  }

  if (type === 'LOCAL_UPDATE') {
    if (!channel) return
    const { update } = payload
    
    const base64Update = bytesToBase64(new Uint8Array(update))

    channel.publish('crdt:update', {
      senderId: localInstanceId,
      update: base64Update
    })
  }

  if (type === 'PUBLISH_CONVERSATION') {
    if (!channel) return
    channel.publish('sync:conversation', { ...payload, senderId: localInstanceId })
  }
}
