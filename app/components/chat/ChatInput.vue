<template>
  <div class="chat-input-outer">
    <!-- Watermark positioned behind the action buttons, avoiding the text area -->
    <div class="watermark-container">
      <BubblesAvatar class="watermark-avatar" />
    </div>

    <div class="chat-input-inner">
      <textarea 
        ref="textareaRef"
        v-model="text"
        class="chat-textarea" 
        placeholder="Ask Bubbles or drag files..."
        rows="1"
        @input="autoResize"
      ></textarea>
      
      <div class="chat-actions">
        <button class="action-btn">
          <LucidePaperclip :size="18" />
        </button>
        <button class="action-btn">
          <LucideMic :size="18" />
        </button>
        <button class="send-btn" :class="{ 'has-text': text.length > 0 }">
          <LucideArrowRight :size="18" stroke-width="2.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import BubblesAvatar from '../BubblesAvatar.vue'

const text = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const autoResize = () => {
  const el = textareaRef.value
  if (!el) return
  
  // Reset height to auto to correctly measure scrollHeight down when deleting text
  el.style.height = 'auto'
  
  // Set the new height based on content
  const newHeight = el.scrollHeight
  el.style.height = `${newHeight}px`
}

watch(text, () => {
  nextTick(autoResize)
})

onMounted(() => {
  nextTick(autoResize)
})
</script>

<style scoped>
.chat-input-outer {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: none;
  border-radius: 24px;
  padding: 10px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 100%;
}

/* Watermark positioned precisely behind the action buttons on the right */
.watermark-container {
  position: absolute;
  right: -20px;
  bottom: -30px;
  opacity: 0.04;
  pointer-events: none;
  transform: scale(1.5);
  filter: grayscale(100%) brightness(200%);
  z-index: 1; /* Behind the inner content */
}

.chat-input-inner {
  position: relative;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 16px;
  min-height: 56px; 
  display: flex;
  align-items: flex-end; /* Align items to bottom so buttons stay fixed at bottom when textarea grows */
  padding: 14px 16px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 2; /* Sit above watermark */
  gap: 16px; /* Space between textarea and actions */
}

.chat-textarea {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 15px;
  font-family: inherit;
  resize: none;
  outline: none;
  padding: 0;
  line-height: 1.5;
  
  /* Auto-resize constraints */
  min-height: 24px; /* one line */
  max-height: 120px; /* ~5 lines */
  overflow-y: auto; /* Scroll when max-height is reached */
  
  /* Remove transition to prevent jitter during active typing resize */
}

/* Custom scrollbar for textarea */
.chat-textarea::-webkit-scrollbar {
  width: 4px;
}
.chat-textarea::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.chat-textarea::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.chat-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  /* Prevent shrinking */
  flex-shrink: 0;
  /* Push slightly up to vertically center with a single line of text */
  margin-bottom: -4px; 
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
}

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-left: 4px;
}

.send-btn.has-text {
  background: rgba(255, 255, 255, 0.25);
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.2);
}

.send-btn:hover.has-text {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
}
</style>
