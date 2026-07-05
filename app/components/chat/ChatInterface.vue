<template>
  <div class="chat-interface">
    <ChatSessionHeader
      :showSessions="showSessions"
      :activeConversationTitle="activeConversationTitle"
      @toggle-sessions="toggleSessionsView"
      @create-chat="createChat"
    />

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
            <div class="chat-messages-inner" ref="messagesInner">
              <div v-for="message in agent.data.value.messages" :key="message.id">
                <!-- User Message -->
                <ChatMessageUser v-if="message.role === 'user'" :message="message" @copy="handleCopy(getTextContent(message), true)" />

                <!-- AI Message -->
                <ChatMessageAI v-else-if="hasRenderableParts(message)" :message="message" :isDone="agent.status.value !== 'streaming'" @copy="handleCopy(getTextContent(message), false)" @reply="handleReply(message)" />
              </div>
              
              <!-- Optimistic User Message while fetching memory -->
              <div v-if="mockOptimisticMessage">
                <ChatMessageUser :message="mockOptimisticMessage" @copy="handleCopy(getTextContent(mockOptimisticMessage), true)" />
              </div>
            </div>
            
            <!-- Memory Fetching Loader -->
            <div v-if="isFetchingMemory" class="ai-message-wrapper thinking-loader-wrapper">
              <div class="thinking-content">
                <AILoader :size="16" :color="modeColor" :mode="currentMode" />
                <span class="thinking-text" :style="{ color: modeColor }">Exploring...</span>
              </div>
            </div>

            <!-- Status Loader -->
            <div v-if="!isFetchingMemory && (agent.status.value === 'submitted' || agent.status.value === 'streaming')" class="ai-message-wrapper thinking-loader-wrapper">
              <div class="thinking-content">
                <AILoader :size="16" :color="modeColor" :mode="currentMode" />
                <span class="thinking-text" :style="{ color: modeColor }">{{ statusText }}</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="agent.data.value.messages.length === 0 && !mockOptimisticMessage" class="chat-empty-state">
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
          <ChatContextBar
            v-if="activeContexts.length > 0 || chatStore.pendingWidgetContexts.length > 0"
            :activeContexts="activeContexts"
            :pendingWidgetContexts="chatStore.pendingWidgetContexts"
            @remove-context="removeContext"
            @remove-widget-context="chatStore.removeWidgetContext"
          />
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
import AILoader from '../AILoader.vue'
import ChatSessionHeader from './ChatSessionHeader.vue'
import ChatContextBar from './ChatContextBar.vue'
import ChatMessageUser from './ChatMessageUser.vue'
import ChatMessageAI from './ChatMessageAI.vue'
import ConversationList from '../conversations/ConversationList.vue'
import { useChatStore } from '../../stores/chat'
import { useConversationStore } from '../../stores/conversations'
import { useAppStore } from '../../stores/app'
import { useVoiceAgent } from '../../composables/useVoiceAgent'
import { useAppAgent } from '../../composables/useAppAgent'
import { useWidgetStore } from '../../stores/widgets'
import { authClient } from '~/utils/auth-client'
import { useChatSubmit } from '~/composables/useChatSubmit'

const agent = useAppAgent()
const chatStore = useChatStore()
const conversationStore = useConversationStore()
const appStore = useAppStore()
const widgetStore = useWidgetStore()
const session = authClient.useSession()

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

const messagesInner = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

function disconnectMessageObserver() {
  if (observerRaf !== null) {
    cancelAnimationFrame(observerRaf)
    observerRaf = null
  }
  resizeObserver?.disconnect()
  resizeObserver = null
}

function attachMessageObserver() {
  disconnectMessageObserver()
  if (messagesInner.value) {
    resizeObserver = new ResizeObserver(() => {
      if (observerRaf !== null) cancelAnimationFrame(observerRaf)
      observerRaf = requestAnimationFrame(() => {
        scrollToBottom(false)
        observerRaf = null
      })
    })
    resizeObserver.observe(messagesInner.value)
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
  appStore.fetchLocation(true)
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
const isFetchingMemory = ref(false)
const optimisticUserMessage = ref('')

const mockOptimisticMessage = computed<EveMessage | null>(() => {
  if (!optimisticUserMessage.value) return null
  return {
    id: 'optimistic_user_msg',
    role: 'user',
    createdAt: new Date(),
    parts: [{ type: 'text', text: optimisticUserMessage.value }]
  }
})

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

const { handleSubmit } = useChatSubmit(
  agent,
  optimisticUserMessage,
  isFetchingMemory,
  activeContexts,
  scrollToBottom
)

const getTextContent = (message: EveMessage) => {
  const rawText = message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('')
  
  if (message.role === 'user') {
    return rawText.replace(/<system_context>[\s\S]*?<\/system_context>\n*/g, '').trim()
  }
  
  return rawText
}

const hasRenderableParts = (message: EveMessage) => {
  return message.parts.some(p => (p.type === 'text' && p.text.length > 0) || p.type === 'dynamic-tool')
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
  if (!text) return
  
  try {
    await navigator.clipboard.writeText(text);
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
/* ─── Layout ─────────────────────────────────────────────────── */
.chat-interface {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  width: 100%;
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
  padding: 0 32px 0 0; /* Clear the Quick Access Bar */
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px; /* Space between context bar and input */
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

.chat-messages-inner > div {
  content-visibility: auto;
  contain-intrinsic-size: auto 150px;
}

/* ─── Thinking Loader ────────────────────────────────────────── */
.thinking-loader-wrapper {
  display: flex;
  justify-content: flex-start;
  padding: 12px 16px;
  margin-top: 8px;
  margin-bottom: 24px;
}

.thinking-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.thinking-text {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.2px;
}

/* ─── Transitions ─────────────────────────────────────────────── */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 760px) {
  .session-browser {
    padding: 16px 0 16px 0;
  }

  .chat-input-wrapper {
    padding-right: 0;
  }
}
</style>
