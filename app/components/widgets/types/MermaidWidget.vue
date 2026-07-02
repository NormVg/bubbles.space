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
  overflow: hidden; /* Hide scrollbars, let it scale */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Make sure the wrapper takes full height */
.mermaid-widget-content :deep(> div) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Force the mermaid SVG to scale and fill the container perfectly */
.mermaid-widget-content :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  object-fit: contain; /* Keeps aspect ratio while scaling */
}

/* Remove constraints from any intermediate mermaid wrappers */
.mermaid-widget-content :deep(.mermaid) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 !important;
}

/* Hide scrollbars since we are scaling to fit */
.mermaid-widget-content::-webkit-scrollbar {
  display: none;
}
</style>
