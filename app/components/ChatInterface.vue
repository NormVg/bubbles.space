<template>
  <div class="chat-interface">
    <!-- Empty State Center -->
    <div class="chat-empty-state">
      <div class="avatar-wrapper">
        <BubblesAvatar />
      </div>
      <h2 class="welcome-title">Hi there! I'm Bubbles.</h2>
      <p class="welcome-subtitle">
        I can help you write code, plan projects, or just chat. How can I help you today?
      </p>
    </div>

    <!-- Bottom Input Area -->
    <div class="chat-input-wrapper">
      <div class="chat-input-outer">
        <!-- Watermark Avatar -->
        <div class="watermark-container">
          <BubblesAvatar class="watermark-avatar" />
        </div>

        <div class="chat-input-inner">
          <textarea 
            class="chat-textarea" 
            placeholder="Ask Bubbles or drag files..."
            rows="1"
          ></textarea>
          
          <div class="chat-actions">
            <button class="action-btn">
              <LucidePaperclip :size="18" />
            </button>
            <button class="action-btn">
              <LucideMic :size="18" />
            </button>
            <button class="send-btn">
              <LucideArrowRight :size="18" stroke-width="2.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BubblesAvatar from './BubblesAvatar.vue'
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
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 40px;
  /* Push slightly up to balance the bottom input */
  transform: translateY(-40px);
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
  padding: 0 0 24px 0;
  /* Add extra right padding if QuickAccessBar overlaps */
  padding-right: 80px; 
}

.chat-input-outer {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 10px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* Watermark */
.watermark-container {
  position: absolute;
  right: -20px;
  bottom: -30px;
  opacity: 0.04;
  pointer-events: none;
  transform: scale(2);
  filter: grayscale(100%) brightness(200%);
}

.chat-input-inner {
  position: relative;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 16px;
  min-height: 80px;
  display: flex;
  align-items: flex-start;
  padding: 16px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 2; /* Sit above watermark */
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
  min-height: 48px;
}

.chat-textarea::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.chat-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 16px;
  align-self: flex-end;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 4px;
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
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.send-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}
</style>
