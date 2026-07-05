<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  data: {
    url?: string
  }
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', data: any): void
}>()

const currentUrl = ref(props.data.url || '')
const editUrl = ref(props.data.url || '')
const isLoading = ref(true)
const hasError = ref(false)

const handleLoad = () => {
  isLoading.value = false
  hasError.value = false
}

const handleError = () => {
  isLoading.value = false
  hasError.value = true
}

const retry = () => {
  isLoading.value = true
  hasError.value = false
  // Force reload by appending a cache-bust query param if it's not a data URI
  if (currentUrl.value && !currentUrl.value.startsWith('data:')) {
    const sep = currentUrl.value.includes('?') ? '&' : '?'
    currentUrl.value = `${currentUrl.value.split(sep + 'retry=')[0]}${sep}retry=${Date.now()}`
  }
}

watch(() => props.isEditing, (editing) => {
  if (editing) {
    editUrl.value = currentUrl.value
  } else {
    // Save
    const url = editUrl.value.trim()
    currentUrl.value = url
    isLoading.value = true
    hasError.value = false
    emit('save', { ...props.data, url })
  }
})

// Initial load check
onMounted(() => {
  if (!currentUrl.value) {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="pdf-widget">
    <div v-if="isEditing" class="edit-mode">
      <div class="edit-header">
        <LucideFileText :size="16" />
        <span>PDF URL</span>
      </div>
      <input 
        v-model="editUrl" 
        type="text" 
        placeholder="https://example.com/document.pdf"
        class="url-input"
        @keydown.enter.stop
      />
      <div class="edit-hint">Enter a direct link to a PDF file.</div>
    </div>
    
    <div v-else class="pdf-container">
      <!-- Empty State -->
      <div v-if="!currentUrl" class="pdf-empty-state">
        <LucideFileText :size="32" class="empty-icon" />
        <p>No PDF URL provided</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && currentUrl" class="pdf-loader">
        <div class="spinner"></div>
      </div>

      <!-- Error State -->
      <div v-if="hasError && currentUrl" class="pdf-error-state">
        <LucideFileX :size="32" class="error-icon" />
        <p>Failed to load PDF</p>
        <p class="error-hint">The site might be blocking embeds.</p>
        <div class="action-buttons">
          <button class="action-btn retry-btn" @click.stop="retry">
            <LucideRefreshCw :size="14" /> Retry
          </button>
          <a :href="currentUrl" target="_blank" rel="noopener noreferrer" class="action-btn external-btn" @click.stop>
            <LucideExternalLink :size="14" /> Open in New Tab
          </a>
        </div>
      </div>

      <!-- PDF Viewer using native object tag -->
      <object 
        v-show="currentUrl && !hasError"
        :data="currentUrl" 
        type="application/pdf"
        class="pdf-viewer"
        @load="handleLoad"
        @error="handleError"
      >
        <!-- Fallback if the browser doesn't support PDF embedding -->
        <div class="pdf-fallback" @load="handleError">
          <LucideAlertCircle :size="24" class="error-icon" />
          <p>Your browser doesn't support embedded PDFs.</p>
          <a :href="currentUrl" target="_blank" rel="noopener noreferrer" class="fallback-btn" @click.stop>
            <LucideExternalLink :size="14" /> Download / Open PDF
          </a>
        </div>
      </object>
    </div>
  </div>
</template>

<style scoped>
.pdf-widget {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--bg-surface);
  overflow: hidden;
  border-radius: 12px;
}

.edit-mode {
  width: 100%;
  height: 100%;
  padding: 24px;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
}

.edit-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 14px;
}

.url-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-family: monospace;
  outline: none;
  transition: border-color 0.2s ease;
}

.url-input:focus {
  border-color: var(--accent);
}

html.light .url-input {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.edit-hint {
  font-size: 12px;
  color: var(--text-secondary);
}

.pdf-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.pdf-viewer {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 12px;
  /* Ensure object takes up full space */
  display: block;
}

.pdf-loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-surface);
  z-index: 5;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.pdf-error-state, .pdf-empty-state, .pdf-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-surface);
  color: var(--text-secondary);
  z-index: 6;
  gap: 12px;
  text-align: center;
  padding: 24px;
}

.error-icon, .empty-icon {
  opacity: 0.5;
  color: var(--text-secondary);
}

.pdf-error-state p, .pdf-empty-state p, .pdf-fallback p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.error-hint {
  font-size: 13px !important;
  color: var(--text-secondary) !important;
  font-weight: 400 !important;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.action-btn, .fallback-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

html.light .action-btn, html.light .fallback-btn {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.action-btn:hover, .fallback-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

html.light .action-btn:hover, html.light .fallback-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.external-btn {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

.external-btn:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
