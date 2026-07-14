<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'

const props = defineProps<{
  data: {
    files?: Array<{ url: string, filename?: string, mimeType?: string }>
    // legacy support for single file
    url?: string
    filename?: string
    mimeType?: string
  }
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', data: any): void
}>()

const editFiles = ref<Array<{ url: string, filename: string, mimeType?: string }>>([])

watch(() => props.isEditing, (editing) => {
  if (editing) {
    editFiles.value = JSON.parse(JSON.stringify(filesList.value))
    if (editFiles.value.length === 0) {
      editFiles.value.push({ url: '', filename: '' })
    }
  } else {
    emit('save', { 
      ...props.data, 
      files: editFiles.value.filter(f => f.url && f.url.trim()),
      url: undefined,
      filename: undefined,
      mimeType: undefined
    })
  }
})

function addFile() {
  editFiles.value.push({ url: '', filename: '' })
}

function removeFile(index: number) {
  editFiles.value.splice(index, 1)
}

const filesList = computed(() => {
  if (props.data.files && props.data.files.length > 0) {
    return props.data.files
  }
  if (props.data.url) {
    return [{ url: props.data.url, filename: props.data.filename, mimeType: props.data.mimeType }]
  }
  return []
})

function getExtension(name: string = '') {
  const parts = name.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE'
}
</script>

<template>
  <div class="file-widget">
    <div v-if="isEditing" class="edit-mode">
      <div class="edit-header">
        <LucideFile :size="16" />
        <span>File Details</span>
        <button class="add-btn" @click="addFile" title="Add File">
          <LucidePlus :size="16" />
        </button>
      </div>
      
      <div class="edit-files-list">
        <div v-for="(file, idx) in editFiles" :key="idx" class="edit-file-item">
          <div class="edit-file-inputs">
            <input 
              v-model="file.url" 
              type="text" 
              placeholder="URL (https://...)"
              class="url-input"
              @keydown.enter.stop
            />
            <input 
              v-model="file.filename" 
              type="text" 
              placeholder="Filename (document.pdf)"
              class="url-input"
              @keydown.enter.stop
            />
          </div>
          <button class="remove-btn" @click="removeFile(idx)" title="Remove File">
            <LucideX :size="16" />
          </button>
        </div>
      </div>
    </div>
    
    <div v-else class="file-container">
      <div v-if="filesList.length === 0" class="empty-state">
        <LucideFileQuestion :size="32" class="empty-icon" />
        <p>No Files Attached</p>
      </div>

      <div v-else class="file-list">
        <div v-for="(file, idx) in filesList" :key="idx" class="file-card">
          <div class="file-icon-box">
            <span class="file-ext">{{ getExtension(file.filename || file.url) }}</span>
          </div>
          
          <div class="file-info">
            <h3 class="filename" :title="file.filename || 'Unknown File'">
              {{ file.filename || 'Unknown File' }}
            </h3>
            <p class="file-meta">{{ getExtension(file.filename || file.url) }} Document</p>
          </div>
          
          <a :href="file.url" download target="_blank" rel="noopener noreferrer" class="download-btn" @click.stop title="Download">
            <LucideDownload :size="18" />
          </a>
        </div>
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

.add-btn {
  margin-left: auto;
  background: transparent;
  border: none;
  color: var(--accent);
  cursor: pointer;
  border-radius: 4px;
  padding: 4px;
  display: flex;
}
.add-btn:hover { background: rgba(59, 130, 246, 0.1); }

.edit-files-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edit-file-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  background: var(--bg-base);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.edit-file-inputs {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.remove-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
}
.remove-btn:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

.url-input {
  background: var(--bg-overlay);
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
  flex-direction: column;
  padding: 8px;
  overflow-y: auto;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-muted);
  height: 100%;
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
