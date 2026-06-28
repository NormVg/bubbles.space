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
  
  // Set to 1px to force it to shrink if text was deleted, so scrollHeight is accurate.
  el.style.height = '1px'
  
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
  display: flex;
  align-items: flex-end; /* Align items to bottom so buttons stay fixed at bottom when textarea grows */
  padding: 10px 16px; /* 10px vertical to snugly fit the 36px buttons */
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 2; /* Sit above watermark */
  gap: 12px; /* Space between textarea and actions */
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
  padding: 7px 0; /* Center text vertically with 36px buttons (15px font * 1.5 line height = 22.5px. 36 - 22.5 = 13.5. ~7px top/bottom) */
  line-height: 1.5;
  box-sizing: border-box;
  
  /* Auto-resize constraints */
  min-height: 36px; /* Exactly matches the 36px button height */
  max-height: 140px; /* ~6 lines */
  overflow-y: auto; /* Scroll when max-height is reached */
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
  /* Add safe area right padding so buttons dodge the floating Quick Access Bar */
  padding-right: 32px; 
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
