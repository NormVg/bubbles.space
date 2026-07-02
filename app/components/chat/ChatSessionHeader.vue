<template>
  <header class="chat-session-header">
    <button
      class="session-title-control"
      type="button"
      :aria-expanded="showSessions"
      aria-controls="session-browser"
      aria-label="Browse chat sessions"
      @click="emit('toggle-sessions')"
    >
      <span class="session-title">{{ activeConversationTitle }}</span>
      <LucideChevronDown class="session-chevron" :class="{ open: showSessions }" :size="14" stroke-width="1.8" />
    </button>

    <button class="session-icon-btn" type="button" aria-label="Create new chat" @click="emit('create-chat')">
      <LucidePlus :size="15" stroke-width="2" />
    </button>
  </header>
</template>

<script setup lang="ts">


defineProps<{
  showSessions: boolean
  activeConversationTitle: string
}>()

const emit = defineEmits<{
  (e: 'toggle-sessions'): void
  (e: 'create-chat'): void
}>()
</script>

<style scoped>
.chat-session-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 40px;
  padding: 0 32px 0 0;
}

.session-title-control,
.session-icon-btn {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--text-secondary);
  transition:
    background-color 150ms cubic-bezier(0.19, 1, 0.22, 1),
    border-color 150ms cubic-bezier(0.19, 1, 0.22, 1),
    color 150ms cubic-bezier(0.19, 1, 0.22, 1),
    transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.session-title-control {
  flex: 0 1 auto;
  min-width: 0;
  max-width: min(360px, 72%);
  gap: 8px;
  padding: 0 8px;
  text-align: left;
  color: var(--text-muted);
}

.session-title-control:hover,
.session-icon-btn:hover {
  background: var(--hover-bg);
  border-color: var(--glass-border);
  color: var(--text-primary);
}

.session-title-control:active,
.session-icon-btn:active {
  transform: scale(0.96);
}

.session-title {
  min-width: 0;
  overflow: hidden;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 450;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-chevron {
  flex: 0 0 auto;
  transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.session-chevron.open {
  transform: rotate(180deg);
}

.session-icon-btn {
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--text-muted);
  background: transparent;
  padding: 0;
  cursor: pointer;
}

@media (max-width: 760px) {
  .chat-session-header {
    align-items: stretch;
    flex-direction: column;
    padding-right: 0;
  }

  .session-title-control {
    max-width: none;
  }
}
</style>
