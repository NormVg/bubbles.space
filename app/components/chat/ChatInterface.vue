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
      <ChatInput />
    </div>
  </div>
</template>

<script setup lang="ts">
import BubblesAvatar from '../BubblesAvatar.vue'
import ChatInput from './ChatInput.vue'
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
</style>
