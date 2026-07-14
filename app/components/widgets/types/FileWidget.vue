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
        <div class="file-icon-wrapper">
          <LucideFile :size="48" class="file-icon" />
          <span class="file-ext">{{ extension }}</span>
        </div>
        
        <div class="file-info">
          <h3 class="filename" :title="data.filename || 'Unknown File'">
            {{ data.filename || 'Unknown File' }}
          </h3>
          <p class="mime" v-if="data.mimeType">{{ data.mimeType }}</p>
        </div>
        
        <a :href="data.url" download target="_blank" rel="noopener noreferrer" class="download-btn" @click.stop>
          <LucideDownload :size="16" />
          <span>Download</span>
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
  padding: 16px;
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  width: 100%;
  height: 100%;
}

.file-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}

.file-ext {
  position: absolute;
  bottom: 8px;
  font-size: 10px;
  font-weight: 800;
  background: var(--bg-base);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--text-primary);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.filename {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 16px;
}

.mime {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--accent);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-top: 8px;
}
.download-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0, 0.3);
  filter: brightness(1.1);
}
.download-btn:active {
  transform: translateY(0);
}
</style>
