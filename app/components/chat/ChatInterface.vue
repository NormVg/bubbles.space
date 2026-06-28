<template>
  <div class="chat-interface">
    <div class="chat-messages">
      <!-- Mock User Message -->
      <div class="user-message">
        Hey Bubbles, can you show me the markdown renderer with a code block and a mermaid diagram?
      </div>
      
      <!-- Mock AI Message -->
      <div class="ai-message">
        <MarkdownRenderer :content="testMarkdown" :isDone="true" />
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

.ai-message {
  width: 100%;
  max-width: 100%;
  align-self: flex-start;
  margin-bottom: 32px;
  /* Removed padding, background, and border as requested for AI messages */
}

.user-message {
  background: rgba(32, 32, 40, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px 24px;
  margin-bottom: 24px;
  max-width: 85%;
  align-self: flex-end;
  backdrop-filter: blur(12px);
}
</style>
