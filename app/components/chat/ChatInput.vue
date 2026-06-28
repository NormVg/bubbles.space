<template>
  <div class="chat-input-outer">
    <!-- Watermark positioned behind the action buttons, avoiding the text area -->
    <div class="watermark-container">
      <BubblesAvatar class="watermark-avatar" :invert="false" :animate="false" />
    </div>

    <div class="chat-input-inner">
      <textarea 
        ref="textareaRef"
        v-model="text"
        class="chat-textarea" 
        placeholder="Ask Bubbles or drag files..."
        :disabled="isBusy"
        @keydown.enter.exact.prevent="handleSubmit"
      ></textarea>
      
      <div class="chat-actions">
        <button class="action-btn">
          <LucidePaperclip :size="18" />
        </button>
        <button class="action-btn">
          <LucideMic :size="18" />
        </button>
        <button v-if="!isBusy" class="send-btn" :class="{ 'has-text': text.length > 0 }" @click="handleSubmit">
          <LucideArrowRight :size="16" stroke-width="2.5" />
        </button>
        <button v-else class="send-btn stop-btn" @click="$emit('stop')">
          <LucideSquare :size="14" fill="currentColor" stroke="none" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import BubblesAvatar from '../BubblesAvatar.vue'

const props = defineProps<{
  isBusy: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', text: string): void
  (e: 'stop'): void
}>()

const text = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const handleSubmit = () => {
  if (props.isBusy) return
  const trimmed = text.value.trim()
  if (!trimmed) return
  
  emit('submit', trimmed)
  text.value = ''
}

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
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  padding: 6px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
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
html.light .watermark-container {
  filter: grayscale(100%) brightness(0%);
  opacity: 0.02;
}

.chat-input-inner {
  position: relative;
  background: var(--input-bg);
  border-radius: 18px;
  /* 8px top, 12px sides, 48px bottom to reserve space for absolute buttons */
  padding: 8px 12px 48px 12px; 
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 2; /* Sit above watermark */
  min-height: 100px; /* Make it tall by default */
  box-sizing: border-box;
}

.chat-textarea {
  display: block;
  width: 100%; /* Take full width of the box */
  height: 100%;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 15px;
  font-family: inherit;
  resize: none;
  outline: none;
  padding: 0;
  line-height: 1.5;
  box-sizing: border-box;
  
  /* Auto-resize constraints */
  min-height: 24px; /* Just 1 line minimum. The container handles the 120px minimum height. */
  max-height: 300px; /* Allow it to grow quite tall before scrolling */
  overflow-y: auto; /* Scroll when max-height is reached */
}

/* Custom scrollbar for textarea */
.chat-textarea::-webkit-scrollbar {
  width: 4px;
}
.chat-textarea::-webkit-scrollbar-thumb {
  background: var(--glass-border);
  border-radius: 4px;
}

.chat-textarea::placeholder {
  color: var(--text-muted);
}

.chat-actions {
  position: absolute;
  bottom: 8px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  color: var(--text-primary);
  background: var(--hover-bg);
}

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--hover-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-left: 2px;
}

.send-btn.has-text {
  background: var(--accent);
  color: var(--accent-foreground);
  border-color: var(--accent);
}

.send-btn:hover.has-text {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.send-btn.stop-btn {
  background: var(--glass-bg);
  color: var(--text-primary);
  border-color: var(--glass-border);
}

.send-btn.stop-btn:hover {
  background: var(--hover-bg);
  transform: scale(0.95);
}
</style>
