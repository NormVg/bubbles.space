<template>
  <div class="chat-interface">
    <div class="chat-messages" ref="messagesContainer" @scroll="handleScroll">
      <div v-for="message in agent.data.value.messages" :key="message.id">
        <!-- User Message -->
        <div v-if="message.role === 'user'" class="user-message-wrapper">
          <div class="user-message">
            <template v-for="(part, i) in message.parts" :key="i">
              <span v-if="part.type === 'text'">{{ part.text }}</span>
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
      <div v-if="replyContext" class="context-bar">
        <span class="context-label">context</span>
        <span class="context-text">{{ replyContext.text }}</span>
        <button class="context-clear" @click="replyContext = null" title="Remove context">
          <LucideX :size="14" stroke-width="2" />
        </button>
      </div>
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

const replyContext = ref<{ type: string; text: string; id: string } | null>(null)

const handleReply = (message: any) => {
  replyContext.value = {
    type: 'reply',
    text: getTextContent(message),
    id: message.id
  }
}

const handleSubmit = async (text: string) => {
  let finalMessage = text
  if (replyContext.value) {
    // Format the context as a markdown quote so the AI knows what we are referencing
    finalMessage = `> ${replyContext.value.text.split('\n').join('\n> ')}\n\n${text}`
    replyContext.value = null
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
  gap: 12px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 14px;
  padding: 10px 16px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  width: 100%;
  box-sizing: border-box;
  animation: slideUpFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.context-label {
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  user-select: none;
}

.context-text {
  color: var(--text-primary);
  font-size: 14px;
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
  margin-left: auto;
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
  border-radius: 16px;
  padding: 16px 24px;
  margin-bottom: 8px; /* Reduced from 24px to bring buttons closer */
  max-width: 85%;
  align-self: flex-end;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--text-primary);
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
