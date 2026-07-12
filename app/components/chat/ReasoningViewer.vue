<template>
  <div class="minimal-tool-call">
    <button class="tool-summary-row" @click="toggleExpand" type="button" aria-label="Toggle thought process">
      <div class="tool-icon">
        <LucideLoader2 v-if="isProcessing" class="spin-icon" :size="14" stroke-width="2.5" />
        <LucideBrain v-else class="success-icon" :size="14" stroke-width="2.5" />
      </div>
      
      <div class="tool-text-container">
        <span class="tool-name">Thought Process</span>
        <span class="tool-preview" v-if="!expanded && isProcessing">Thinking...</span>
      </div>
      
      <LucideChevronDown class="tool-chevron" :class="{ open: expanded }" :size="14" stroke-width="2" />
    </button>

    <div v-show="expanded" class="tool-details-container">
      <div class="tool-timeline-line"></div>
      <div class="tool-details-content">
        
        <div class="detail-section">
          <div class="code-wrapper" ref="scrollContainer">
             <pre><code>{{ content || 'Thinking...' }}</code></pre>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  content: string
  isProcessing: boolean
}>()

const expanded = ref(props.isProcessing)
const scrollContainer = ref<HTMLElement | null>(null)

const toggleExpand = () => {
  expanded.value = !expanded.value
}

// Auto-expand/collapse based on processing state
watch(() => props.isProcessing, (newVal) => {
  expanded.value = newVal
})

// Auto-scroll when content changes
watch(() => props.content, async () => {
  if (expanded.value && props.isProcessing) {
    await nextTick()
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
  }
})
</script>

<style scoped>
.minimal-tool-call {
  display: flex;
  flex-direction: column;
  margin: 4px 0 16px 0;
  width: 100%;
}

.tool-summary-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px 0;
  color: var(--text-muted);
  width: fit-content;
  max-width: 100%;
  transition: color 0.2s ease;
  user-select: none;
  text-align: left;
}

.tool-summary-row:hover {
  color: var(--text-secondary);
}

.tool-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.8;
}

.spin-icon {
  animation: spin 1.2s linear infinite;
  color: var(--text-muted);
}

.success-icon {
  color: var(--text-muted);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.tool-text-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.tool-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.tool-preview {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-muted);
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tool-chevron {
  opacity: 0.5;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.tool-chevron.open {
  transform: rotate(-180deg);
}

.tool-summary-row:hover .tool-chevron {
  opacity: 1;
}

.tool-details-container {
  display: flex;
  margin-top: 4px;
}

.tool-timeline-line {
  width: 1px;
  background: var(--glass-border);
  margin-left: 7.5px;
  margin-right: 15.5px;
  flex-shrink: 0;
}

.tool-details-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 4px;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.code-wrapper {
  background: var(--bg-soft);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 10px;
  max-height: 400px;
  overflow-y: auto;
  position: relative;
}

.code-wrapper pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.code-wrapper code {
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.5;
  color: var(--text-secondary);
}

/* Custom Scrollbar for code blocks */
.code-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.code-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.code-wrapper::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.code-wrapper::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}
</style>
