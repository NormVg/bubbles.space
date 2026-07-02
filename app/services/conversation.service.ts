import { LocalConversationRepository } from '../repositories/local.conversation.repository'
import type { IConversationRepository } from '../repositories/conversation.repository'
import type { ConversationMeta, ConversationDetail } from '../../shared/types/conversation.types'
import type { EveMessage } from 'eve/vue'
import type { HandleMessageStreamEvent, SessionState } from 'eve/client'

export class ConversationService {
  constructor(private readonly repository: IConversationRepository) {}

  async loadMetadataList(): Promise<ConversationMeta[]> {
    return this.repository.getMetadataList()
  }

  async loadDetail(id: string): Promise<ConversationDetail | null> {
    return this.repository.getDetail(id)
  }

  async createNewConversation(title = 'New chat'): Promise<{ meta: ConversationMeta, detail: ConversationDetail }> {
    const now = new Date().toISOString()
    const id = crypto.randomUUID()

    const meta: ConversationMeta = {
      id,
      title,
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
      lastMessagePreview: ''
    }

    const detail: ConversationDetail = {
      id,
      events: []
    }

    await this.repository.save(meta, detail)
    return { meta, detail }
  }

  async deleteConversation(id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async saveSnapshot(
    currentMeta: ConversationMeta,
    input: {
      events: readonly HandleMessageStreamEvent[]
      messages: readonly EveMessage[]
      session: SessionState
    }
  ): Promise<{ meta: ConversationMeta, detail: ConversationDetail }> {
    const now = new Date().toISOString()
    const messageCount = input.messages.length

    const title = currentMeta.title === 'New chat'
      ? this.createTitleFromMessages(input.messages)
      : currentMeta.title

    const nextMeta: ConversationMeta = {
      ...currentMeta,
      title,
      updatedAt: messageCount > currentMeta.messageCount ? now : currentMeta.updatedAt,
      messageCount,
      lastMessagePreview: this.createPreviewFromMessages(input.messages)
    }

    const nextDetail: ConversationDetail = {
      id: currentMeta.id,
      session: input.session,
      events: [...input.events]
    }

    await this.repository.save(nextMeta, nextDetail)
    return { meta: nextMeta, detail: nextDetail }
  }

  async updateSessionOnly(id: string, session: SessionState): Promise<void> {
    const detail = await this.loadDetail(id)
    if (!detail) return
    const metaList = await this.loadMetadataList()
    const meta = metaList.find(m => m.id === id)
    if (!meta) return

    detail.session = session
    await this.repository.save(meta, detail)
  }

  private getMessageText(message: EveMessage): string {
    const raw = message.parts
      .filter(part => part.type === 'text')
      .map(part => part.text)
      .join('')
    
    return raw
      .replace(/<system_context>[\s\S]*?<\/system_context>\n*/g, '')
      .replace(/\[Widget: .*?\][\s\S]*?\[\/Widget\]\n*/g, '')
      .trim()
  }

  private createTitleFromMessages(messages: readonly EveMessage[]): string {
    const firstUserText = messages
      .filter(message => message.role === 'user')
      .map(m => this.getMessageText(m))
      .find(text => text.length > 0)

    if (!firstUserText) return 'New chat'
    return firstUserText.length > 44 ? `${firstUserText.slice(0, 44).trim()}...` : firstUserText
  }

  private createPreviewFromMessages(messages: readonly EveMessage[]): string {
    const lastText = [...messages]
      .reverse()
      .map(m => this.getMessageText(m))
      .find(text => text.length > 0)

    if (!lastText) return ''
    return lastText.length > 72 ? `${lastText.slice(0, 72).trim()}...` : lastText
  }
}

// Singleton export
export const conversationService = new ConversationService(new LocalConversationRepository())
