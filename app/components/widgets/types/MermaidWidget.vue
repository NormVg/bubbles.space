<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import mermaid from 'mermaid'
import { useDark } from '@vueuse/core'

const props = defineProps<{
  data: Record<string, any>
  isEditing: boolean
}>()

const emit = defineEmits<{
  save: [data: Record<string, any>]
}>()

const isDark = useDark()
const svgContent = ref('')
const isRendering = ref(false)
const renderError = ref(false)
const editChart = ref(props.data.chart || '')

const retryRender = () => {
  renderChart()
}

const renderChart = async () => {
  if (isRendering.value) return
  isRendering.value = true
  renderError.value = false
  
  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark.value ? 'dark' : 'default',
      securityLevel: 'loose',
      background: 'transparent',
      fontFamily: 'inherit'
    })
    
    // Generate unique ID for this render
    const id = `mermaid-chart-${Math.random().toString(36).substr(2, 9)}`
    const source = props.data.chart || 'graph TD; A-->B;'
    
    const { svg } = await mermaid.render(id, source)
    svgContent.value = svg
  } catch (e) {
    console.error('Mermaid render error', e)
    renderError.value = true
    svgContent.value = ''
  } finally {
    isRendering.value = false
  }
}

onMounted(() => {
  nextTick(() => {
    renderChart()
  })
})

watch(() => isDark.value, renderChart)
watch(() => props.data.chart, renderChart)

watch(() => props.isEditing, (editing) => {
  if (editing) {
    editChart.value = props.data.chart || ''
  } else if (editChart.value !== props.data.chart) {
    emit('save', { chart: editChart.value })
  }
})
</script>

<template>
  <div class="mermaid-widget-content">
    <textarea
      v-if="isEditing"
      v-model="editChart"
      class="widget-editor"
      placeholder="Write mermaid syntax here..."
      spellcheck="false"
    ></textarea>
    <div v-else class="mermaid-display-wrapper">
      <!-- Loading State -->
      <div v-if="isRendering && !svgContent" class="mermaid-loader">
        <div class="spinner"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="renderError" class="mermaid-error-state">
        <LucideAlertTriangle :size="32" class="error-icon" />
        <p>Syntax Error</p>
        <span class="error-sub">Failed to render diagram</span>
        <button class="retry-btn" @click.stop="retryRender">
          <LucideRefreshCw :size="14" /> Retry
        </button>
      </div>

      <div v-else class="mermaid-svg-container" :class="{ 'is-loading': isRendering }" v-html="svgContent"></div>
    </div>
  </div>
</template>

<style scoped>
.mermaid-widget-content {
  padding: 16px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mermaid-display-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mermaid-loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
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

.mermaid-error-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  color: var(--text-secondary);
  z-index: 6;
  gap: 8px;
}

.error-icon {
  opacity: 0.5;
  color: var(--danger, #ef4444);
}

.mermaid-error-state p {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.error-sub {
  font-size: 11px;
  opacity: 0.7;
  margin-bottom: 8px;
}

.retry-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.mermaid-svg-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.mermaid-svg-container.is-loading {
  opacity: 0.5;
}

/* Force the natively rendered mermaid SVG to scale perfectly */
.mermaid-svg-container :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  object-fit: contain;
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
</style>
