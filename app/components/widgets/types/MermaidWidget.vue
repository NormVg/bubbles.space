<script setup lang="ts">
import MarkdownRenderer from '../../MarkdownRenderer.vue'

defineProps<{
  data: Record<string, any>
}>()
</script>

<template>
  <div class="mermaid-widget-content">
    <MarkdownRenderer :content="`\`\`\`mermaid\n${data.chart || 'graph TD; A-->B;'}\n\`\`\``" :is-done="true" />
  </div>
</template>

<style scoped>
.mermaid-widget-content {
  padding: 16px;
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mermaid-widget-content::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.mermaid-widget-content::-webkit-scrollbar-track {
  background: transparent;
}
.mermaid-widget-content::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}
</style>
