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
