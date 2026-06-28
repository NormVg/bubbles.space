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
  padding: 12px 16px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 2; /* Sit above watermark */
  min-height: 120px; /* Make it tall by default */
  /* Remove flex-direction: column so it behaves as a normal block container with absolute children */
}

.chat-textarea {
  display: block;
  width: 100%; /* Take full width of the box */
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 15px;
  font-family: inherit;
  resize: none;
  outline: none;
  padding: 0;
  /* Add padding at the bottom so text doesn't overlap the absolute buttons */
  padding-bottom: 48px; 
  line-height: 1.5;
  box-sizing: border-box;
  
  /* Auto-resize constraints */
  min-height: 96px; /* 120px container - 24px vertical padding = 96px */
  max-height: 300px; /* Allow it to grow quite tall before scrolling */
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
  position: absolute;
  bottom: 12px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  
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
  padding: 8px;
  border-radius: 10px;
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
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.4);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-left: 2px;
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
