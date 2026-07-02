<template>
  <div v-if="quotes && quotes.length > 0" class="user-message-quotes">
    <div v-for="(quote, idx) in quotes" :key="idx" class="user-quote-pill">
      <LucideReply :size="10" stroke-width="2.5" class="quote-icon" />
      <span class="quote-text">{{ quote.trim() }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  quotes: string[] | null
}>()
</script>

<style scoped>
.user-message-quotes {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 6px;
}

.user-quote-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  font-size: 11px;
  color: var(--text-muted);
  width: fit-content;
  max-width: 100%;
}

html.light .user-quote-pill {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.quote-icon {
  flex-shrink: 0;
  opacity: 0.7;
}

.quote-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}
</style>
