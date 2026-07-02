<script setup lang="ts">
import { ref, watch } from 'vue'
import MarkdownRenderer from '../../MarkdownRenderer.vue'

const props = defineProps<{
  data: Record<string, any>
  isEditing: boolean
}>()

const emit = defineEmits<{
  save: [data: Record<string, any>]
}>()

const editContent = ref(props.data.content || '')

watch(() => props.isEditing, (editing) => {
  if (editing) {
    editContent.value = props.data.content || ''
  } else if (editContent.value !== props.data.content) {
    emit('save', { content: editContent.value })
  }
})
</script>

<template>
  <div class="markdown-widget-content">
    <!-- Edit Mode -->
    <textarea
      v-if="isEditing"
      v-model="editContent"
      class="widget-editor"
      placeholder="Write markdown here..."
      spellcheck="false"
    ></textarea>
    
    <!-- View Mode -->
    <MarkdownRenderer v-else :content="data.content || '*No content provided*'" :is-done="true" />
  </div>
</template>

<style scoped>
.markdown-widget-content {
  padding: 16px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  color: var(--text-primary);
}

.widget-editor {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  color: var(--text-primary);
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 13px;
  line-height: 1.6;
  padding: 0;
}

.widget-editor::placeholder {
  color: var(--text-muted, rgba(255, 255, 255, 0.3));
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
