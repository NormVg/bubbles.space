<template>
  <div class="chat-interface">
    <div class="chat-messages">
      <!-- Mock User Message -->
      <div class="user-message-wrapper">
        <div class="user-message">
          Hey Bubbles, can you show me the markdown renderer with a code block and a mermaid diagram?
        </div>
        <div class="user-message-actions">
          <button class="user-action-btn" title="Copy">
            <LucideCopy :size="14" stroke-width="2.5" />
            <span>Copy</span>
          </button>
        </div>
      </div>
      
      <!-- Mock AI Message -->
      <div class="ai-message-wrapper">
        <div class="ai-message">
          <MarkdownRenderer :content="testMarkdown" :isDone="true" />
        </div>
        <div class="ai-message-actions">
          <button class="ai-action-btn" title="Copy">
            <LucideCopy :size="14" stroke-width="2.5" />
            <span>Copy</span>
          </button>
          <button class="ai-action-btn" title="Reply">
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

.ai-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.5);
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}

.ai-action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.15);
}

.user-message-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 32px;
}

.user-message {
  background: rgba(32, 32, 40, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px 24px;
  margin-bottom: 8px; /* Reduced from 24px to bring buttons closer */
  max-width: 85%;
  align-self: flex-end;
  backdrop-filter: blur(12px);
}

.user-message-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Align right to match user message */
  gap: 8px;
  padding-right: 4px;
}

.user-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-action-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
}
</style>
