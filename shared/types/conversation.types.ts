import type { HandleMessageStreamEvent, SessionState } from 'eve/client'

export interface ConversationMeta {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messageCount: number
  lastMessagePreview: string
}

export interface ConversationDetail {
  id: string
  session?: SessionState
  events: HandleMessageStreamEvent[]
}
