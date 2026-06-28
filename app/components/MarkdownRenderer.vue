<script setup lang="ts">
import { onMounted } from 'vue'

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
    <ClientOnly>
      <MarkdownRender 
        class="custom-md-renderer"
        :content="content"
        :final="isDone"
        :is-dark="true"
        mode="chat"
        :fade="false"
        code-renderer="shiki"
        :enable-mermaid="true"
        :enable-katex="true"
        :code-block-props="{ theme: { light: 'vitesse-light', dark: 'vitesse-dark' } }"
      />
    </ClientOnly>
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
.custom-md-renderer :deep(.markdown-renderer),
.custom-md-renderer :deep(.markdown-renderer *) {
  /* Disable content-visibility and contain because they create a paint containment context 
     that clips absolutely positioned dropdown menus (like the code block header menu) */
  content-visibility: visible !important;
  contain: none !important;
}

/* Force overflow visible on any wrapper that might clip the dropdown menu */
.custom-md-renderer :deep([class*="code-block"]),
.custom-md-renderer :deep([class*="code-header"]),
.custom-md-renderer :deep(.code-block-container),
.custom-md-renderer :deep(.markstream-code-block) {
  overflow: visible !important;
}

/* Hide Mermaid expand/action buttons to prevent the full-screen modal */
.custom-md-renderer :deep(.mermaid-header-actions),
.custom-md-renderer :deep(.mermaid-action-btn),
.custom-md-renderer :deep(.code-header-actions button[title*="Expand" i]),
.custom-md-renderer :deep(.code-header-actions button[title*="Fullscreen" i]) {
  display: none !important;
}

.custom-md-renderer :deep(.markstream-vue) {
  --ms-bg-code: rgba(0, 0, 0, 0.4);
  --ms-border-radius: 12px;
  --ms-color-link: #8a2be2;
}

.custom-md-renderer :deep(p) {
  margin-bottom: 1rem;
}

.custom-md-renderer :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
