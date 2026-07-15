<script setup lang="ts">
import { LucideFileText, LucideVideo, LucideFile, LucideExternalLink, LucideTrash2 } from 'lucide-vue-next'

const props = defineProps<{
  file: any
}>()

const emit = defineEmits(['delete'])

function deleteFile() {
  if (confirm('Are you sure you want to delete this file?')) {
    emit('delete', props.file.appwriteFileId)
  }
}
</script>

<template>
  <div class="file-preview-container">
    <div class="preview-header">
      <div class="file-info">
        <h2>{{ file.originalName }}</h2>
        <span class="mime-type">{{ file.mimeType }}</span>
      </div>
      <div class="actions">
        <a :href="file.url" target="_blank" class="btn secondary">
          <LucideExternalLink :size="16" />
          Open Original
        </a>
        <button class="btn danger" @click="deleteFile">
          <LucideTrash2 :size="16" />
          Delete
        </button>
      </div>
    </div>
    
    <div class="preview-content">
      <img v-if="file.mimeType?.startsWith('image/')" :src="file.url" :alt="file.originalName" class="image-preview" />
      <video v-else-if="file.mimeType?.startsWith('video/')" :src="file.url" controls class="video-preview"></video>
      <iframe v-else-if="file.mimeType === 'application/pdf'" :src="file.url" class="pdf-preview"></iframe>
      
      <div v-else class="generic-preview">
        <LucideFileText v-if="file.mimeType?.includes('text')" :size="64" />
        <LucideFile v-else :size="64" />
        <p>Preview not available for this file type.</p>
        <a :href="file.url" target="_blank">Download File</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-preview-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
  gap: 24px;
}

.file-info {
  min-width: 0;
  flex: 1;
}

.file-info h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mime-type {
  font-size: 14px;
  color: var(--text-muted);
}

.actions {
  display: flex;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
  text-decoration: none;
}

.btn.secondary {
  background: var(--bg-modifier-hover);
  color: var(--text-primary);
  border-color: var(--border);
}
.btn.secondary:hover {
  background: var(--bg-modifier-active);
}

.btn.danger {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-danger, #ef4444);
  border-color: rgba(239, 68, 68, 0.2);
}
.btn.danger:hover {
  background: rgba(239, 68, 68, 0.2);
}

.preview-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.image-preview,
.video-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.pdf-preview {
  width: 100%;
  height: 100%;
  border: none;
}

.generic-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--text-muted);
}
.generic-preview a {
  color: var(--accent);
  text-decoration: none;
}
.generic-preview a:hover {
  text-decoration: underline;
}
</style>
