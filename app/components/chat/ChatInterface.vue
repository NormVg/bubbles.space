<template>
  <div class="chat-interface">
    <div class="chat-messages">
      <!-- Mock User Message -->
      <div class="user-message-wrapper">
        <div class="user-message">
          Hey Bubbles, can you show me the markdown renderer with a code block and a mermaid diagram?
        </div>
        <div class="user-message-actions">
          <button class="chat-action-btn" :class="{ 'copied': userMessageCopied }" @click="handleCopy('Hey Bubbles, can you show me the markdown renderer with a code block and a mermaid diagram?', true)" title="Copy">
            <LucideCheck v-if="userMessageCopied" :size="14" stroke-width="2.5" class="icon-success" />
            <LucideCopy v-else :size="14" stroke-width="2.5" />
            <span>{{ userMessageCopied ? 'Copied' : 'Copy' }}</span>
          </button>
        </div>
      </div>
      
      <!-- Mock AI Message -->
      <div class="ai-message-wrapper">
        <div class="ai-message">
          <MarkdownRenderer :content="testMarkdown" :isDone="true" />
        </div>
        <div class="ai-message-actions">
          <button class="chat-action-btn" :class="{ 'copied': aiMessageCopied }" @click="handleCopy(testMarkdown, false)" title="Copy">
            <LucideCheck v-if="aiMessageCopied" :size="14" stroke-width="2.5" class="icon-success" />
            <LucideCopy v-else :size="14" stroke-width="2.5" />
            <span>{{ aiMessageCopied ? 'Copied' : 'Copy' }}</span>
          </button>
          <button class="chat-action-btn" title="Reply">
            <LucideReply :size="14" stroke-width="2.5" />
            <span>Reply</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state removed for testing -->

    <!-- Bottom Input Area -->
    <div class="chat-input-wrapper">
      <ChatInput />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BubblesAvatar from '../BubblesAvatar.vue'
import ChatInput from './ChatInput.vue'
import MarkdownRenderer from '../MarkdownRenderer.vue'

const testMarkdown = `
# Markdown Test
This is a test of the **MarkdownRenderer**.

\`\`\`javascript
function helloWorld() {
  console.log("Hello, Bubbles!");
}
\`\`\`

Here is a mermaid diagram:
\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\`
`

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

.ai-message {
  width: 100%;
  max-width: calc(100% - 130px); /* Leave space on right for dropdown menus to prevent clipping */
  align-self: flex-start;
  margin-bottom: 8px; /* Reduced from 32px to bring buttons closer */
  /* Removed padding, background, and border as requested for AI messages */
}

.ai-message-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 4px; /* Slight inset to align with text visually */
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
