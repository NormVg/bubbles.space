<template>
  <div class="user-message-wrapper">
    <div class="user-message">
      <template v-for="(part, i) in message.parts" :key="i">
        <div v-if="part.type === 'text'" class="user-message-content">
          <UserMessageQuotes v-if="parsedData(part.text).quotes.length > 0" :quotes="parsedData(part.text).quotes" />
          
          <!-- Attached Widgets -->
          <div v-if="parsedData(part.text).widgets.length > 0" class="user-attachments">
            <div v-for="(w, idx) in parsedData(part.text).widgets" :key="idx" class="user-attachment-pill">
              <LucidePaperclip :size="12" stroke-width="2" class="attachment-icon" />
              <span>Widget: {{ w.label }}</span>
            </div>
          </div>
          
          <div class="user-message-text" v-if="parsedData(part.text).text">{{ parsedData(part.text).text }}</div>
        </div>
      </template>
    </div>
    <div class="user-message-actions">
      <button class="chat-action-btn" title="Copy" @click="emit('copy')">
        <LucideCopy :size="14" stroke-width="2.5" />
        <span>Copy</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EveMessage } from 'eve/vue'

import UserMessageQuotes from './UserMessageQuotes.vue'

const props = defineProps<{
  message: EveMessage
}>()

const emit = defineEmits<{
  (e: 'copy'): void
}>()

const cleanUserText = (text: string) => {
  return text.replace(/<system_context>[\s\S]*?<\/system_context>\n*/g, '').trim()
}

const parseUserMessage = (text: string) => {
  const lines = text.split('\n')
  const parsedQuotes: string[] = []
  const parsedWidgets: { label: string }[] = []
  const message: string[] = []
  
  let currentQuote: string[] = []
  let inQuotes = true
  let inWidget = false
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    if (inWidget) {
      if (trimmedLine === '[/Widget]') {
        inWidget = false
      }
      continue
    }

    if (inQuotes) {
      if (line.startsWith('> ')) {
        currentQuote.push(line.substring(2))
      } else if (trimmedLine === '') {
        if (currentQuote.length > 0) {
          parsedQuotes.push(currentQuote.join('\n').trim())
          currentQuote = []
        }
      } else if (trimmedLine.startsWith('[Widget: ')) {
        if (currentQuote.length > 0) {
          parsedQuotes.push(currentQuote.join('\n').trim())
          currentQuote = []
        }
        const label = trimmedLine.substring(9, trimmedLine.length - 1)
        parsedWidgets.push({ label })
        inWidget = true
      } else {
        inQuotes = false
        if (currentQuote.length > 0) {
          parsedQuotes.push(currentQuote.join('\n').trim())
          currentQuote = []
        }
        message.push(line)
      }
    } else {
      if (trimmedLine.startsWith('[Widget: ')) {
        const label = trimmedLine.substring(9, trimmedLine.length - 1)
        parsedWidgets.push({ label })
        inWidget = true
      } else {
        message.push(line)
      }
    }
  }
  
  if (inQuotes && currentQuote.length > 0) {
    parsedQuotes.push(currentQuote.join('\n').trim())
  }
  
  return {
    text: message.join('\n').trim(),
    quotes: parsedQuotes,
    widgets: parsedWidgets
  }
}

// Cache parsed parts so we don't recalculate on every re-render
const parsedPartsMap = computed(() => {
  const map = new Map()
  for (const part of props.message.parts) {
    if (part.type === 'text') {
      const cleaned = cleanUserText(part.text)
      map.set(part.text, parseUserMessage(cleaned))
    }
  }
  return map
})

const parsedData = (rawText: string) => {
  return parsedPartsMap.value.get(rawText) || { text: '', quotes: [], widgets: [] }
}
</script>

<style scoped>
.user-message-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 32px;
}

.user-message {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px 18px 4px 18px;
  padding: 12px 16px;
  margin-bottom: 4px;
  max-width: 85%;
  align-self: flex-end;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--text-primary);
  font-size: 14.5px;
  line-height: 1.6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

html.light .user-message {
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.user-attachments {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}

.user-attachment-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  width: fit-content;
}

html.light .user-attachment-pill {
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.attachment-icon {
  color: var(--accent, #ff6b8b);
}

.user-message-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.user-message-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-right: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.user-message-wrapper:hover .user-message-actions {
  opacity: 1;
}

.chat-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chat-action-btn:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}
</style>
