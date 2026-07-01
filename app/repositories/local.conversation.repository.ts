import type { IConversationRepository } from './conversation.repository'
import type { ConversationMeta, ConversationDetail } from '../../shared/types/conversation.types'

const META_KEY = 'bubbles-meta-conversations'
const DETAIL_KEY_PREFIX = 'bubbles-conv-'

export class LocalConversationRepository implements IConversationRepository {
  async getMetadataList(): Promise<ConversationMeta[]> {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(META_KEY)
    if (!data) {
      // Data Migration check from old monolithic store
      return this.migrateOldData()
    }
    try {
      return JSON.parse(data) as ConversationMeta[]
    } catch {
      return []
    }
  }

  async getDetail(id: string): Promise<ConversationDetail | null> {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem(`${DETAIL_KEY_PREFIX}${id}`)
    if (!data) return null
    try {
      return JSON.parse(data) as ConversationDetail
    } catch {
      return null
    }
  }

  async save(meta: ConversationMeta, detail: ConversationDetail): Promise<void> {
    if (typeof window === 'undefined') return

    // Save detail
    localStorage.setItem(`${DETAIL_KEY_PREFIX}${meta.id}`, JSON.stringify(detail))

    // Update metadata list
    const metaList = await this.getMetadataList()
    const index = metaList.findIndex(m => m.id === meta.id)
    if (index >= 0) {
      metaList[index] = meta
    } else {
      metaList.unshift(meta)
    }
    
    // Sort by updatedAt descending
    metaList.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

    await this.saveMetadataList(metaList)
  }

  async saveMetadataList(metaList: ConversationMeta[]): Promise<void> {
    if (typeof window === 'undefined') return
    localStorage.setItem(META_KEY, JSON.stringify(metaList))
  }

  async delete(id: string): Promise<void> {
    if (typeof window === 'undefined') return
    
    // Remove detail
    localStorage.removeItem(`${DETAIL_KEY_PREFIX}${id}`)
    
    // Remove from metadata list
    const metaList = await this.getMetadataList()
    const updatedList = metaList.filter(m => m.id !== id)
    await this.saveMetadataList(updatedList)
  }

  /**
   * One-time migration for old monolithic `bubbles-conversations` key
   */
  private async migrateOldData(): Promise<ConversationMeta[]> {
    if (typeof window === 'undefined') return []
    const oldData = localStorage.getItem('bubbles-conversations')
    if (!oldData) return []

    try {
      const parsedOld = JSON.parse(oldData) as any[]
      const metaList: ConversationMeta[] = []

      for (const old of parsedOld) {
        if (!old.id) continue
        
        const meta: ConversationMeta = {
          id: old.id,
          title: old.title || 'New chat',
          createdAt: old.createdAt || new Date().toISOString(),
          updatedAt: old.updatedAt || new Date().toISOString(),
          messageCount: old.messageCount || 0,
          lastMessagePreview: old.lastMessagePreview || ''
        }

        const detail: ConversationDetail = {
          id: old.id,
          session: old.session,
          events: old.events || []
        }

        // Save new split format
        localStorage.setItem(`${DETAIL_KEY_PREFIX}${meta.id}`, JSON.stringify(detail))
        metaList.push(meta)
      }

      // Save new meta list
      metaList.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      localStorage.setItem(META_KEY, JSON.stringify(metaList))

      // Remove old key so we don't migrate again
      localStorage.removeItem('bubbles-conversations')

      return metaList
    } catch {
      return []
    }
  }
}
