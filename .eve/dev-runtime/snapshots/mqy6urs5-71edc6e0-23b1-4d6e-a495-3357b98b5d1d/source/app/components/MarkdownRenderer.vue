<script setup lang="ts">
import { onMounted } from 'vue'
import MarkdownRender, { enableMermaid, enableKatex } from 'markstream-vue'
import 'markstream-vue/index.css'
import 'katex/dist/katex.min.css'

// Enable optional heavy integrations only on client side to prevent SSR issues
if (import.meta.client) {
  enableMermaid()
  enableKatex()
}

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  isDone: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div class="markdown-wrapper">
    <MarkdownRender 
      class="custom-md-renderer"
      :content="content"
      :final="isDone"
      :is-dark="true"
      mode="chat"
      :fade="false"
      :render-code-blocks-as-pre="true"
      :code-block-props="{ theme: { light: 'vitesse-light', dark: 'vitesse-dark' } }"
    />
  </div>
</template>

<style scoped>
.markdown-wrapper {
  color: var(--text-primary);
  font-family: inherit;
  font-size: 15px;
  line-height: 1.6;
}

/* Custom overrides to match our UI design */
.custom-md-renderer :deep(.markstream-vue) {
  --ms-bg-code: rgba(0, 0, 0, 0.4);
  --ms-border-radius: 12px;
  --ms-color-link: #8a2be2; /* Example accent color, adjust to theme if needed */
}

.custom-md-renderer :deep(pre) {
  background: rgba(0, 0, 0, 0.4) !important;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 16px;
  overflow-x: auto;
}

.custom-md-renderer :deep(code) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.custom-md-renderer :deep(pre code) {
  background: transparent;
  padding: 0;
}

.custom-md-renderer :deep(p) {
  margin-bottom: 1rem;
}

.custom-md-renderer :deep(.markstream-vue p:last-child) {
  margin-bottom: 0;
}
</style>
