<template>
  <div class="chat-interface">
    <header class="chat-session-header">
      <button
        class="session-title-control"
        type="button"
        :aria-expanded="showSessions"
        aria-controls="session-browser"
        aria-label="Browse chat sessions"
        @click="toggleSessionsView"
      >
        <span class="session-title">{{ activeConversationTitle }}</span>
        <LucideChevronDown class="session-chevron" :class="{ open: showSessions }" :size="14" stroke-width="1.8" />
      </button>

      <button class="session-icon-btn" type="button" aria-label="Create new chat" @click="createChat">
        <LucidePlus :size="15" stroke-width="2" />
      </button>
    </header>

    <div class="chat-body" :class="{ 'is-browsing-sessions': showSessions }">
      <Transition name="view-swap" mode="out-in">
        <section
          v-if="showSessions"
          id="session-browser"
          key="sessions"
          class="session-browser"
          aria-label="Chat sessions"
        >
          <div class="session-browser-heading">
            <span>All chats</span>
            <span>{{ conversationCount }} total</span>
          </div>

          <ConversationList
            variant="panel"
            :show-header="false"
            @create="showChatView"
            @select="showChatView"
          />
        </section>

        <section v-else key="messages" class="chat-thread" aria-label="Conversation">
          <div class="chat-messages" ref="messagesContainer" @scroll="handleScroll">
            <div v-for="message in agent.data.value.messages" :key="message.id">
              <!-- User Message -->
              <div v-if="message.role === 'user'" class="user-message-wrapper">
                <div class="user-message">
                  <template v-for="(part, i) in message.parts" :key="i">
                    <div v-if="part.type === 'text'" class="user-message-content">
                      <UserMessageQuotes v-if="parseUserMessage(cleanUserText(part.text)).quotes.length > 0" :quotes="parseUserMessage(cleanUserText(part.text)).quotes" />
                      
                      <!-- Attached Widgets -->
                      <div v-if="parseUserMessage(cleanUserText(part.text)).widgets.length > 0" class="user-attachments">
                        <div v-for="(w, idx) in parseUserMessage(cleanUserText(part.text)).widgets" :key="idx" class="user-attachment-pill">
                          <LucidePaperclip :size="12" stroke-width="2" class="attachment-icon" />
                          <span>Widget: {{ w.label }}</span>
                        </div>
                      </div>
                      
                      <div class="user-message-text" v-if="parseUserMessage(cleanUserText(part.text)).text">{{ parseUserMessage(cleanUserText(part.text)).text }}</div>
                    </div>
                  </template>
                </div>
                <div class="user-message-actions">
                  <button class="chat-action-btn" title="Copy" @click="handleCopy(getTextContent(message), true)">
                    <LucideCopy :size="14" stroke-width="2.5" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              <!-- AI Message -->
              <div v-else-if="hasRenderableParts(message)" class="ai-message-wrapper">
                <div class="ai-message">
                  <template v-for="(group, i) in getGroupedParts(message)" :key="i">
                    <MarkdownRenderer v-if="group.type === 'text'" :content="group.text" :isDone="agent.status.value !== 'streaming'" />
                    <ToolCallGroup v-else-if="group.type === 'tool-group'" :tools="group.tools" />
                  </template>
                </div>
                <div class="ai-message-actions">
                  <button class="chat-action-btn" title="Copy" @click="handleCopy(getTextContent(message), false)">
                    <LucideCopy :size="14" stroke-width="2.5" />
                    <span>Copy</span>
                  </button>
                  <button class="chat-action-btn" title="Reply" @click="handleReply(message)">
                    <LucideReply :size="14" stroke-width="2.5" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Status Loader -->
            <div v-if="agent.status.value === 'submitted' || agent.status.value === 'streaming'" class="ai-message-wrapper thinking-loader-wrapper">
              <div class="thinking-content">
                <AILoader :size="16" :color="modeColor" :mode="currentMode" />
                <span class="thinking-text" :style="{ color: modeColor }">{{ statusText }}</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="agent.data.value.messages.length === 0" class="chat-empty-state">
            <div class="avatar-wrapper">
              <BubblesAvatar :size="64" />
            </div>
            <h2 class="welcome-title">Hi, I'm Bubbles.</h2>
            <p class="welcome-subtitle">Ask me anything, I can write code, generate diagrams, and help you build.</p>
          </div>
        </section>
      </Transition>
    </div>

    <Transition name="fade-slide">
      <div v-if="!showSessions" class="chat-input-wrapper">
        <Transition name="fade-slide">
          <div v-if="activeContexts.length > 0 || chatStore.pendingWidgetContexts.length > 0" class="context-bar">
            <TransitionGroup name="context-pill">
              <div v-for="(ctx, index) in activeContexts" :key="ctx.id" class="context-pill">
                <span class="context-label">{{ ctx.type }}</span>
                <span class="context-text">{{ ctx.text }}</span>
                <button class="context-clear" @click="removeContext(index)" title="Remove context">
                  <LucideX :size="12" stroke-width="2" />
                </button>
              </div>
              <div v-for="(wCtx, index) in chatStore.pendingWidgetContexts" :key="'w-'+wCtx.id" class="context-pill">
                <span class="context-label">Widget</span>
                <span class="context-text">{{ wCtx.label }}</span>
                <button class="context-clear" @click="chatStore.removeWidgetContext(wCtx.id)" title="Remove widget context">
                  <LucideX :size="12" stroke-width="2" />
                </button>
              </div>
            </TransitionGroup>
          </div>
        </Transition>
        <ChatInput :isBusy="agent.status.value === 'submitted' || agent.status.value === 'streaming'" @submit="handleSubmit" @stop="agent.stop" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import type { EveMessage } from 'eve/vue'
import BubblesAvatar from '../BubblesAvatar.vue'
import ChatInput from './ChatInput.vue'
import MarkdownRenderer from '../MarkdownRenderer.vue'
import ToolCallGroup from './ToolCallGroup.vue'
import AILoader from '../AILoader.vue'
import UserMessageQuotes from './UserMessageQuotes.vue'
import ConversationList from '../conversations/ConversationList.vue'
import { useChatStore } from '../../stores/chat'
import { useConversationStore } from '../../stores/conversations'
import { useAppStore } from '../../stores/app'
import { useVoiceAgent } from '../../composables/useVoiceAgent'
import { useAppAgent } from '../../composables/useAppAgent'
import { useWidgetStore } from '../../stores/widgets'

const agent = useAppAgent()
const chatStore = useChatStore()
const conversationStore = useConversationStore()
const appStore = useAppStore()
const widgetStore = useWidgetStore()

const showSessions = ref(false)
const activeConversationTitle = computed(() => conversationStore.activeConversation?.title ?? 'New chat')
const conversationCount = computed(() => conversationStore.sortedConversations.length)
const sessionCountLabel = computed(() => `${conversationCount.value} ${conversationCount.value === 1 ? 'session' : 'sessions'}`)
const voiceAgent = useVoiceAgent()

const latestAiMessage = computed(() => {
  const messages = agent.data.value.messages
  if (!messages || messages.length === 0) return null

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    if (message?.role === 'assistant') {
      return message
    }
  }
  return null
})

const currentMode = computed(() => {
  if (voiceAgent.isSpeaking.value) return 'speaking'
  
  if (latestAiMessage.value && agent.status.value === 'streaming') {
    const hasProcessingTool = latestAiMessage.value.parts.some(p => 
      p.type === 'dynamic-tool' && ['input-streaming', 'input-available', 'approval-requested', 'running'].includes(p.state)
    )
    if (hasProcessingTool) return 'tool'
    
    // If it's streaming but not processing tools, it's thinking
    return 'thinking'
  }

  if (agent.status.value === 'submitted' || agent.status.value === 'streaming') return 'thinking'
  
  return 'idle'
})

const modeColor = computed(() => {
  switch(currentMode.value) {
    case 'speaking': return 'var(--color-success, #10b981)' 
    case 'tool': return 'var(--color-purple, #A855F7)'
    case 'thinking': return 'var(--accent, #ff6b8b)' 
    default: return 'var(--text-muted, #a1a1aa)'
  }
})

const statusText = computed(() => {
  switch(currentMode.value) {
    case 'speaking': return 'Typing...'
    case 'tool': return 'Using tools...'
    case 'thinking': return 'Thinking...'
    default: return 'Ready'
  }
})

watch(() => currentMode.value, (mode) => {
  if (mode === 'thinking') chatStore.setEmotion('think')
  else if (mode === 'idle') chatStore.setEmotion('normal')
  else chatStore.setEmotion(mode) // 'tool' or 'speaking'
}, { immediate: true })

async function showChatView() {
  showSessions.value = false
  await nextTick()
  attachMessageObserver()
  scrollToBottom(true)
}

function toggleSessionsView() {
  if (showSessions.value) {
    void showChatView()
    return
  }

  showSessions.value = true
}

async function createChat() {
  await conversationStore.createConversation()
  void showChatView()
}

const messagesContainer = ref<HTMLElement | null>(null)
let scrollRaf: number | null = null
let observerRaf: number | null = null
let observer: MutationObserver | null = null
const isUserScrolledUp = ref(false)

const handleScroll = () => {
  if (!messagesContainer.value) return
  if (scrollRaf !== null) cancelAnimationFrame(scrollRaf)
  
  scrollRaf = requestAnimationFrame(() => {
    const container = messagesContainer.value
    if (container) {
      isUserScrolledUp.value = container.scrollHeight - container.scrollTop - container.clientHeight > 150
    }
    scrollRaf = null
  })
}

const scrollToBottom = (force = false) => {
  if (!messagesContainer.value) return
  
  const container = messagesContainer.value
  if (force || !isUserScrolledUp.value) {
    container.scrollTop = container.scrollHeight
  }
}

function disconnectMessageObserver() {
  if (observerRaf !== null) {
    cancelAnimationFrame(observerRaf)
    observerRaf = null
  }

  observer?.disconnect()
  observer = null
}

function attachMessageObserver() {
  disconnectMessageObserver()
  if (messagesContainer.value) {
    observer = new MutationObserver(() => {
      // Debounce the observer to 60fps to prevent layout thrashing on every token
      if (observerRaf !== null) cancelAnimationFrame(observerRaf)
      observerRaf = requestAnimationFrame(() => {
        scrollToBottom(false)
        observerRaf = null
      })
    })
    // Watch for text streaming (characterData) and new nodes (childList)
    observer.observe(messagesContainer.value, { childList: true, subtree: true, characterData: true })
  }
}

watch(showSessions, async (isShowingSessions) => {
  if (isShowingSessions) {
    disconnectMessageObserver()
    return
  }

  await nextTick()
  attachMessageObserver()
  scrollToBottom(true)
})

const processedToolCalls = new Set<string>()
const toolWatcherReady = ref(false)

/** Build a stable dedup key for a tool call part */
const getToolKey = (msgId: string, part: any, partIndex: number): string => {
  return part.toolCallId || `${msgId}__${part.toolName}__${partIndex}`
}

/** Try to extract a widget action from a tool output */
const tryApplyWidgetAction = (output: any) => {
  if (!output || typeof output !== 'object') return
  const res = output
  if (res.action === 'add_widget') {
    widgetStore.addWidget(res.payload)
  } else if (res.action === 'update_widget') {
    widgetStore.updateWidget(res.payload.id, res.payload)
  } else if (res.action === 'remove_widget') {
    widgetStore.removeWidget(res.payload.id)
  }
}

onMounted(() => {
  appStore.fetchLocation()
  attachMessageObserver()
  // Initial scroll
  setTimeout(() => scrollToBottom(true), 100)

  // Pre-fill processed tool calls so we don't re-trigger actions on refresh
  // DO NOT apply widget actions here, because local storage handles persistence!
  const messages = agent.data.value.messages || []
  for (const msg of messages) {
    if (msg.role !== 'assistant') continue
    for (let i = 0; i < msg.parts.length; i++) {
      const part = msg.parts[i] as any
      if (part.type === 'dynamic-tool') {
        const key = getToolKey(msg.id, part, i)
        processedToolCalls.add(key)
      }
    }
  }
  
  // Now that all existing tool calls are registered, enable the watcher
  toolWatcherReady.value = true
})

// Watch for new tool executions (only after onMounted pre-fill is complete)
watch(() => agent.data.value.messages, (messages) => {
  if (!toolWatcherReady.value || !messages) return
  for (const msg of messages) {
    if (msg.role !== 'assistant') continue
    for (let i = 0; i < msg.parts.length; i++) {
      const part = msg.parts[i] as any
      if (part.type === 'dynamic-tool' && (part.state === 'output-available' || part.state === 'approval-responded') && part.output) {
        const key = getToolKey(msg.id, part, i)
        if (!processedToolCalls.has(key)) {
          processedToolCalls.add(key)
          tryApplyWidgetAction(part.output)
        }
      }
    }
  }
}, { deep: true })

onBeforeUnmount(() => {
  disconnectMessageObserver()
  if (scrollRaf !== null) cancelAnimationFrame(scrollRaf)
})

const activeContexts = ref<Array<{ type: string; text: string; id: string }>>([])

const handleReply = (message: EveMessage) => {
  // Prevent duplicate contexts
  if (activeContexts.value.some(c => c.id === message.id)) return
  
  activeContexts.value.push({
    type: 'context',
    text: getTextContent(message),
    id: message.id
  })
}

const removeContext = (index: number) => {
  activeContexts.value.splice(index, 1)
}

const handleSubmit = async (text: string) => {
  let finalMessage = text
  
  // Format hidden system context
  const timeContext = `Local Time: ${new Date().toLocaleString()}`
  const locContext = appStore.location 
    ? `Location: ${appStore.location.city || 'Unknown City'}, ${appStore.location.region || 'Unknown Region'} (Lat: ${appStore.location.latitude}, Lon: ${appStore.location.longitude})` 
    : 'Location: Unknown'
  
  const widgetsCtx = widgetStore.widgets.length > 0 
    ? `Canvas Widgets:\n${JSON.stringify(widgetStore.widgets.map(w => ({ id: w.id, type: w.type, x: Math.round(w.x), y: Math.round(w.y), title: w.title })))}` 
    : 'Canvas Widgets: None'
    
  const systemBlock = `<system_context>\n${timeContext}\n${locContext}\n${widgetsCtx}\n</system_context>`
  
  const consumedWidgets = chatStore.consumeWidgetContexts()
  
  if (activeContexts.value.length > 0 || consumedWidgets.length > 0) {
    // Format message contexts
    const msgContextPrefix = activeContexts.value.map(ctx => {
      return `> ${ctx.text.split('\n').join('\n> ')}`
    }).join('\n\n')
    
    // Format widget contexts
    const widgetContextPrefix = consumedWidgets.map(wCtx => {
      return `[Widget: ${wCtx.label}]\n${wCtx.text}\n[/Widget]`
    }).join('\n\n')
    
    const allContexts = [msgContextPrefix, widgetContextPrefix].filter(Boolean).join('\n\n')
    
    finalMessage = `${systemBlock}\n\n${allContexts}\n\n${text}`
    activeContexts.value = [] // clear after sending
  } else {
    finalMessage = `${systemBlock}\n\n${text}`
  }
  
  setTimeout(() => scrollToBottom(true), 50)
  await agent.send({ message: finalMessage })
}

const getTextContent = (message: EveMessage) => {
  return message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('')
}

const cleanUserText = (text: string) => {
  return text.replace(/<system_context>[\s\S]*?<\/system_context>\n*/g, '').trim()
}

const hasRenderableParts = (message: EveMessage) => {
  return message.parts.some(p => (p.type === 'text' && p.text.length > 0) || p.type === 'dynamic-tool')
}

type GroupedPart = 
  | { type: 'text', text: string }
  | { type: 'tool-group', tools: import('eve/vue').EveDynamicToolPart[] }

const getGroupedParts = (message: EveMessage) => {
  const groups: GroupedPart[] = []
  let currentToolGroup: import('eve/vue').EveDynamicToolPart[] | null = null

  for (const part of message.parts) {
    if (part.type === 'dynamic-tool') {
      if (!currentToolGroup) {
        currentToolGroup = []
        groups.push({ type: 'tool-group', tools: currentToolGroup })
      }
      currentToolGroup.push(part as import('eve/vue').EveDynamicToolPart)
    } else if (part.type === 'text') {
      currentToolGroup = null
      groups.push({ type: 'text', text: part.text })
    }
  }
  return groups
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
      continue // Skip widget body lines
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

const userMessageCopied = ref(false)
const aiMessageCopied = ref(false)

const playCopySound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    
    // Quick pop sound
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.error("Audio play failed:", e);
  }
}

const handleCopy = async (text: string, isUser: boolean) => {
  let textToCopy = text
  if (isUser) {
    const cleaned = cleanUserText(text)
    textToCopy = parseUserMessage(cleaned).text
  }
  
  if (!textToCopy) return
  
  try {
    await navigator.clipboard.writeText(textToCopy);
    playCopySound();
    
    if (isUser) {
      userMessageCopied.value = true;
      setTimeout(() => { userMessageCopied.value = false }, 2000);
    } else {
      aiMessageCopied.value = true;
      setTimeout(() => { aiMessageCopied.value = false }, 2000);
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}
</script>

<style scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  min-width: 0;
  position: relative;
  gap: 8px;
}

/* ─── Session Header ─────────────────────────────────────────── */
.chat-session-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 40px;
  padding: 0 32px 0 0;
}

.session-title-control,
.session-icon-btn {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--text-secondary);
  transition:
    background-color 150ms cubic-bezier(0.19, 1, 0.22, 1),
    border-color 150ms cubic-bezier(0.19, 1, 0.22, 1),
    color 150ms cubic-bezier(0.19, 1, 0.22, 1),
    transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.session-title-control {
  flex: 0 1 auto;
  min-width: 0;
  max-width: min(360px, 72%);
  gap: 8px;
  padding: 0 8px;
  text-align: left;
  color: var(--text-muted);
}

.session-title-control:hover,
.session-icon-btn:hover {
  background: var(--hover-bg);
  border-color: var(--glass-border);
  color: var(--text-primary);
}

.session-title-control:active,
.session-icon-btn:active {
  transform: scale(0.96);
}

.session-title {
  min-width: 0;
  overflow: hidden;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 450;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-count {
  flex: 0 0 auto;
  color: var(--text-muted);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  line-height: 1.4;
}

.session-chevron {
  flex: 0 0 auto;
  transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.session-chevron.open {
  transform: rotate(180deg);
}

.session-icon-btn {
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--text-muted);
}

/* ─── Main View Switcher ─────────────────────────────────────── */
.chat-body {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
}

.chat-thread,
.session-browser {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.chat-thread {
  position: relative;
  flex-direction: column;
}

.session-browser {
  flex-direction: column;
  gap: 12px;
  padding: 8px 32px 24px 24px;
}

.session-browser-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.session-browser-heading span {
  color: var(--text-muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  line-height: 1.4;
}

.session-browser-heading span:first-child {
  color: var(--text-secondary);
  font-weight: 500;
}

.view-swap-enter-active {
  transition:
    opacity 220ms cubic-bezier(0.19, 1, 0.22, 1),
    transform 220ms cubic-bezier(0.19, 1, 0.22, 1);
}

.view-swap-leave-active {
  transition:
    opacity 140ms cubic-bezier(0.55, 0.05, 0.68, 0.19),
    transform 140ms cubic-bezier(0.55, 0.05, 0.68, 0.19);
}

.view-swap-enter-from,
.view-swap-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* ─── Empty State ────────────────────────────────────────────── */
.chat-empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%); /* Visually centered slightly above true center */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 40px;
  width: 100%;
  pointer-events: none; /* Make sure it doesn't block clicks */
}

.avatar-wrapper {
  transform: scale(1.2);
  margin-bottom: 32px;
}

.welcome-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
  letter-spacing: 0;
}

.welcome-subtitle {
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.5;
  max-width: 320px;
}

/* ─── Chat Input Area ────────────────────────────────────────── */
.chat-input-wrapper {
  padding: 0 32px 0 0; /* Add 32px right padding to ensure the box physically clears the Quick Access Bar */
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px; /* Space between context bar and input */
}

.context-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(10, 10, 12, 0.3); /* Add depth with slightly darker bg */
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 6px;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Outer Context Bar Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Hide scrollbar for context bar but allow horizontal scroll if many tabs */
.context-bar::-webkit-scrollbar {
  display: none;
}
.context-bar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.context-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  padding: 6px 10px;
  box-sizing: border-box;
  max-width: 250px; /* Prevent single context from taking up the whole bar */
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* TransitionGroup Animations for Pills */
.context-pill-enter-active,
.context-pill-leave-active,
.context-pill-move {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.context-pill-enter-from,
.context-pill-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(4px);
}

.context-pill-leave-active {
  position: absolute;
}

.context-label {
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 500;
  user-select: none;
}

.context-text {
  color: var(--text-primary);
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.context-clear {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  margin-left: 4px;
}

.context-clear:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.chat-messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  z-index: 5;
}

.ai-message-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 32px;
}

.thinking-loader-wrapper {
  padding-left: 2px;
  margin-bottom: 16px;
}

.thinking-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.thinking-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.ai-message {
  width: 100%;
  max-width: calc(100% - 24px); /* Increased width for better reading while leaving a small safe zone */
  align-self: flex-start;
  margin-bottom: 8px;
}

.ai-message-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 4px; /* Slight inset to align with text visually */
  opacity: 0;
  transition: opacity 0.2s ease;
}

.ai-message-wrapper:hover .ai-message-actions {
  opacity: 1;
}

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
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
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
  justify-content: flex-end; /* Align right to match user message */
  gap: 8px;
  padding-right: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.user-message-wrapper:hover .user-message-actions {
  opacity: 1;
}

/* Unified clean action button for both AI and User messages */
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
.chat-action-btn.copied {
  color: var(--success);
  background: rgba(138, 179, 140, 0.15); /* Soft green tint based on success variable */
  border-color: rgba(138, 179, 140, 0.3);
}

.icon-success {
  color: var(--success);
}

@media (max-width: 760px) {
  .chat-session-header {
    align-items: stretch;
    flex-direction: column;
    padding-right: 0;
  }

  .session-title-control {
    max-width: none;
  }

  .session-header-actions {
    justify-content: flex-end;
  }

  .session-browser {
    padding: 16px 0 16px 0;
  }

  .chat-input-wrapper {
    padding-right: 0;
  }
}
</style>
