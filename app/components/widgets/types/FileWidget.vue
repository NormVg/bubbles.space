<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'

const props = defineProps<{
  data: {
    url?: string
    filename?: string
    mimeType?: string
  }
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', data: any): void
}>()

const editUrl = ref(props.data.url || '')
const editFilename = ref(props.data.filename || '')

watch(() => props.isEditing, (editing) => {
  if (editing) {
    editUrl.value = props.data.url || ''
    editFilename.value = props.data.filename || ''
  } else {
    emit('save', { 
      ...props.data, 
      url: editUrl.value.trim(), 
      filename: editFilename.value.trim() 
    })
  }
})

// Extract extension to show in UI
const extension = computed(() => {
  const name = props.data.filename || props.data.url || ''
  const parts = name.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE'
})

</script>

<template>
  <div class="file-widget">
    <div v-if="isEditing" class="edit-mode">
      <div class="edit-header">
        <LucideFile :size="16" />
        <span>File Details</span>
      </div>
      <label>URL</label>
      <input 
        v-model="editUrl" 
        type="text" 
        placeholder="https://example.com/file.zip"
        class="url-input"
        @keydown.enter.stop
      />
      <label>Filename (Optional)</label>
      <input 
        v-model="editFilename" 
        type="text" 
        placeholder="document.pdf"
        class="url-input"
        @keydown.enter.stop
      />
    </div>
    
    <div v-else class="file-container">
      <div v-if="!data.url" class="empty-state">
        <LucideFileQuestion :size="32" class="empty-icon" />
        <p>No File Attached</p>
      </div>

      <div v-else class="file-card">
        <div class="file-icon-box">
          <span class="file-ext">{{ extension }}</span>
        </div>
        
        <div class="file-info">
          <h3 class="filename" :title="data.filename || 'Unknown File'">
            {{ data.filename || 'Unknown File' }}
          </h3>
          <p class="file-meta">{{ extension }} Document</p>
        </div>
        
        <a :href="data.url" download target="_blank" rel="noopener noreferrer" class="download-btn" @click.stop title="Download">
          <LucideDownload :size="18" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-widget {
  width: 100%;
  height: 100%;
  background: var(--bg-overlay);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.edit-mode {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  overflow-y: auto;
}

.edit-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 8px;
}

label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.url-input {
  background: var(--bg-base);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  width: 100%;
}
.url-input:focus {
  border-color: var(--accent);
}

.file-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
}
.empty-icon {
  opacity: 0.5;
}

.file-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  width: 100%;
  height: 100%;
  background: var(--bg-base);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.file-icon-box {
  width: 40px;
  height: 48px;
  background: linear-gradient(135deg, var(--accent) 0%, rgba(59, 130, 246, 0.7) 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.file-icon-box::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-bottom-left-radius: 4px;
}

.file-ext {
  font-size: 10px;
  font-weight: 800;
  color: white;
  letter-spacing: 0.5px;
  margin-top: 8px;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.filename {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-meta {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
}

.download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--text-secondary);
  background: transparent;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.download-btn:hover {
  background: var(--bg-overlay);
  color: var(--text-primary);
}
</style>
