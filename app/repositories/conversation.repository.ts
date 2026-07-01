import type { ConversationMeta, ConversationDetail } from '../../shared/types/conversation.types'

export interface IConversationRepository {
  /**
   * Fetch all conversation metadata for the sidebar list.
   */
  getMetadataList(): Promise<ConversationMeta[]>

  /**
   * Fetch a single conversation's full details (events, session state).
   */
  getDetail(id: string): Promise<ConversationDetail | null>

  /**
   * Save the full state of a conversation (both metadata and details).
   */
  save(meta: ConversationMeta, detail: ConversationDetail): Promise<void>

  /**
   * Update only the metadata list without modifying the detail payload.
   */
  saveMetadataList(metaList: ConversationMeta[]): Promise<void>

  /**
   * Delete a conversation entirely.
   */
  delete(id: string): Promise<void>
}
