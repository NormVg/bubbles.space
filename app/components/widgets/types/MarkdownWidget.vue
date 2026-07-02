<script setup lang="ts">
import MarkdownRenderer from '../../MarkdownRenderer.vue'

defineProps<{
  data: Record<string, any>
}>()
</script>

<template>
  <div class="markdown-widget-content">
    <MarkdownRenderer :content="data.content || '*No content provided*'" :is-done="true" />
  </div>
</template>

<style scoped>
.markdown-widget-content {
  padding: 16px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  color: var(--text-primary);
  /* Custom scrollbar for aesthetic */
}
.markdown-widget-content::-webkit-scrollbar {
  width: 6px;
}
.markdown-widget-content::-webkit-scrollbar-track {
  background: transparent;
}
.markdown-widget-content::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}
</style>
