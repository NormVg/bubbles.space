<template>
  <div class="chat-interface">
    <div class="chat-messages" ref="messagesContainer" @scroll="handleScroll">
      <div v-for="message in agent.data.value.messages" :key="message.id">
        <!-- User Message -->
        <div v-if="message.role === 'user'" class="user-message-wrapper">
          <div class="user-message">
            <template v-for="(part, i) in message.parts" :key="i">
              <div v-if="part.type === 'text'" class="user-message-content">
                <div v-if="parseUserMessage(part.text).quotes" class="user-message-quote">
                  <div class="quote-icon"><LucideReply :size="12" /></div>
                  <div class="quote-text">{{ parseUserMessage(part.text).quotes }}</div>
                </div>
                <div class="user-message-text">{{ parseUserMessage(part.text).text }}</div>
              </div>
            </template>
          </div>
          <div class="user-message-actions">
            <!-- Simplified copy action for user message -->
            <button class="chat-action-btn" title="Copy" @click="handleCopy(getTextContent(message), true)">
              <LucideCopy :size="14" stroke-width="2.5" />
              <span>Copy</span>
            </button>
          </div>
        </div>
        
        <!-- AI Message -->
        <div v-else class="ai-message-wrapper">
          <div class="ai-message">
            <template v-for="(part, i) in message.parts" :key="i">
              <MarkdownRenderer v-if="part.type === 'text'" :content="part.text" :isDone="agent.status.value !== 'streaming'" />
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
      
      <!-- Thinking Loader -->
      <div v-if="isBusy" class="ai-message-wrapper thinking-loader-wrapper">
        <div class="thinking-content">
          <AILoader :size="16" color="var(--accent)" />
          <span class="thinking-text">{{ agent.status.value === 'submitted' ? 'Thinking...' : 'Replying...' }}</span>
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

    <!-- Bottom Input Area -->
    <div class="chat-input-wrapper">
      <TransitionGroup name="context-pill" tag="div" v-if="activeContexts.length > 0" class="context-bar">
        <div v-for="(ctx, index) in activeContexts" :key="ctx.id" class="context-pill">
          <span class="context-label">{{ ctx.type }}</span>
          <span class="context-text">{{ ctx.text }}</span>
          <button class="context-clear" @click="removeContext(index)" title="Remove context">
            <LucideX :size="12" stroke-width="2" />
          </button>
        </div>
      </TransitionGroup>
      <ChatInput :isBusy="isBusy" @submit="handleSubmit" @stop="agent.stop" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useEveAgent } from 'eve/vue'
import BubblesAvatar from '../BubblesAvatar.vue'
import ChatInput from './ChatInput.vue'
import MarkdownRenderer from '../MarkdownRenderer.vue'
import AILoader from '../AILoader.vue'
import { useChatStore } from '../../stores/chat'
import { watch } from 'vue'

const agent = useEveAgent()
const chatStore = useChatStore()
const isBusy = computed(() => agent.status.value === 'submitted' || agent.status.value === 'streaming')

watch(() => agent.status.value, (newStatus) => {
  if (newStatus === 'submitted') {
    chatStore.setEmotion('think')
  } else if (newStatus === 'streaming') {
    chatStore.setEmotion('speaking')
  } else {
    chatStore.setEmotion('normal')
  }
})

const messagesContainer = ref<HTMLElement | null>(null)
let observer: MutationObserver | null = null
const isUserScrolledUp = ref(false)

const handleScroll = () => {
  if (!messagesContainer.value) return
  const container = messagesContainer.value
  // Consider user scrolled up if they are more than 150px away from the bottom
  isUserScrolledUp.value = container.scrollHeight - container.scrollTop - container.clientHeight > 150
}

const scrollToBottom = (force = false) => {
  if (!messagesContainer.value) return
  
  const container = messagesContainer.value
  
  if (force || !isUserScrolledUp.value) {
    container.scrollTop = container.scrollHeight
  }
}

onMounted(() => {
  if (messagesContainer.value) {
    observer = new MutationObserver(() => {
      scrollToBottom(false)
    })
    // Watch for text streaming (characterData) and new nodes (childList)
    observer.observe(messagesContainer.value, { childList: true, subtree: true, characterData: true })
  }
  // Initial scroll
  setTimeout(() => scrollToBottom(true), 100)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})

const activeContexts = ref<Array<{ type: string; text: string; id: string }>>([])

const handleReply = (message: any) => {
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
  if (activeContexts.value.length > 0) {
    // Format all contexts
    const contextPrefix = activeContexts.value.map(ctx => {
      return `> ${ctx.text.split('\n').join('\n> ')}`
    }).join('\n\n')
    
    finalMessage = `${contextPrefix}\n\n${text}`
    activeContexts.value = [] // clear after sending
  }
  
  setTimeout(() => scrollToBottom(true), 50)
  await agent.send({ message: finalMessage })
}

const getTextContent = (message: any) => {
  return message.parts
    .filter((p: any) => p.type === 'text')
    .map((p: any) => p.text)
    .join('')
}

const parseUserMessage = (text: string) => {
  const lines = text.split('\n')
  const quotes: string[] = []
  const message: string[] = []
  
  let inQuotes = true
  for (const line of lines) {
    if (inQuotes && line.startsWith('> ')) {
      quotes.push(line.substring(2))
    } else if (inQuotes && line.trim() === '') {
      // skip empty lines between quotes and message
    } else {
      inQuotes = false
      message.push(line)
    }
  }
  
  return {
    quotes: quotes.length > 0 ? quotes.join(' ').trim() : null,
    text: message.join('\n').trim()
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
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
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
  letter-spacing: -0.5px;
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
  margin-top: auto; /* Push input to the bottom */
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
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  width: 100%;
  box-sizing: border-box;
  animation: slideUpFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  overflow-x: auto;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1);
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

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
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
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 14px;
  padding: 10px 14px;
  margin-bottom: 4px; /* Reduced to bring buttons closer */
  max-width: 80%;
  align-self: flex-end;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.user-message-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.user-message-quote {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.quote-icon {
  margin-top: 2px;
  opacity: 0.6;
}

.quote-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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
</style>
