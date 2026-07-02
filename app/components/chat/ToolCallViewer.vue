<template>
  <div class="minimal-tool-call">
    <button class="tool-summary-row" @click="toggleExpand" type="button" aria-label="Toggle tool call details">
      <div class="tool-icon">
        <LucideLoader2 v-if="isProcessing" class="spin-icon" :size="14" stroke-width="2.5" />
        <LucideCheckCircle2 v-else-if="isSuccess" class="success-icon" :size="14" stroke-width="2.5" />
        <LucideXCircle v-else class="error-icon" :size="14" stroke-width="2.5" />
      </div>
      
      <div class="tool-text-container">
        <span class="tool-name">{{ displayName }}</span>
        <span class="tool-preview" v-if="inputPreview && !expanded">{{ inputPreview }}</span>
      </div>
      
      <LucideChevronDown class="tool-chevron" :class="{ open: expanded }" :size="14" stroke-width="2" />
    </button>

    <div v-if="expanded" class="tool-details-container">
      <div class="tool-timeline-line"></div>
      <div class="tool-details-content">
        
        <!-- Input Section -->
        <div v-if="hasInput" class="detail-section">
          <div class="detail-label">Input</div>
          <div class="code-wrapper">
             <pre><code>{{ formattedInput }}</code></pre>
          </div>
        </div>
        
        <!-- Output Section (Nested Accordion) -->
        <div v-if="hasOutput" class="detail-section">
          <button class="detail-accordion-btn" @click.stop="outputExpanded = !outputExpanded">
            <LucideChevronRight class="accordion-chevron" :class="{ open: outputExpanded }" :size="12" stroke-width="2.5" />
            <span class="detail-label">Output</span>
            <span class="output-preview" v-if="!outputExpanded">{{ outputPreview }}</span>
          </button>
          
          <div v-if="outputExpanded" class="code-wrapper" :class="{ 'is-clamped': !showFullOutput && isOutputLarge }">
             <pre><code>{{ formattedOutput }}</code></pre>
             <div v-if="!showFullOutput && isOutputLarge" class="fade-overlay">
               <button class="read-more-btn" @click.stop="showFullOutput = true">Read more</button>
             </div>
          </div>
        </div>

        <!-- Error Section -->
        <div v-if="hasError" class="detail-section">
          <div class="detail-label error-label">Error</div>
          <div class="code-wrapper error-wrapper">
             <pre><code>{{ part.errorText }}</code></pre>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { EveDynamicToolPart } from 'eve/vue'

const props = defineProps<{
  part: EveDynamicToolPart
}>()

const expanded = ref(false)
const outputExpanded = ref(false)
const showFullOutput = ref(false)

const toggleExpand = () => {
  expanded.value = !expanded.value
}

const humanReadableTitles: Record<string, string> = {
  canvas_add_widget: 'Added Widget',
  canvas_update_widget: 'Updated Widget',
  canvas_remove_widget: 'Removed Widget',
  generate_image: 'Generated Image',
  search_web: 'Web Search',
  read_url_content: 'Read Webpage',
  run_command: 'Executed Command',
  view_file: 'Viewed File',
  read_file: 'Read File',
  write_to_file: 'Wrote File',
  replace_file_content: 'Edited File',
  multi_replace_file_content: 'Edited File',
  ask_question: 'Asked Question',
  ask_permission: 'Requested Permission',
}

const displayName = computed(() => {
  const metadataName = props.part.toolMetadata?.eve?.name
  if (metadataName) return metadataName
  
  const rawName = props.part.toolName
  if (rawName && humanReadableTitles[rawName]) {
    return humanReadableTitles[rawName]
  }
  
  return rawName || 'Unknown Tool'
})

const isProcessing = computed(() => {
  return ['input-streaming', 'input-available', 'approval-requested'].includes(props.part.state)
})

const isSuccess = computed(() => {
  return props.part.state === 'output-available' || props.part.state === 'approval-responded'
})

const isError = computed(() => {
  return props.part.state === 'output-error' || props.part.state === 'output-denied'
})

const hasInput = computed(() => props.part.input !== undefined)
const hasOutput = computed(() => 'output' in props.part && props.part.output !== undefined)
const hasError = computed(() => 'errorText' in props.part && props.part.errorText !== undefined)

const inputPreview = computed(() => {
  if (props.part.input === undefined || props.part.input === null) return ''
  
  try {
    const input = props.part.input
    const tool = props.part.toolName
    
    // Custom formatting for known tools
    if (tool === 'canvas_add_widget' || tool === 'canvas_update_widget') {
      return input.title ? `"${input.title}"` : (input.type || '')
    }
    if (tool === 'generate_image') {
      return input.Prompt ? `"${input.Prompt}"` : ''
    }
    if (tool === 'search_web') {
      return input.query ? `"${input.query}"` : ''
    }
    if (tool === 'run_command') {
      return input.CommandLine ? `> ${input.CommandLine}` : ''
    }
    if (['view_file', 'read_file', 'write_to_file', 'replace_file_content', 'multi_replace_file_content'].includes(tool || '')) {
      const path = input.AbsolutePath || input.TargetFile || ''
      return path ? path.split('/').pop() : ''
    }
    
    // Fallback default formatting
    if (typeof input === 'object') {
      const vals = Object.values(input).map(val => {
        if (typeof val === 'string') return val
        if (typeof val === 'object') return '{...}'
        return String(val)
      }).filter(v => v !== '')
      
      const str = vals.join(', ')
      return str.length > 60 ? str.substring(0, 60) + '...' : str
    }
    return String(input)
  } catch (e) {
    return ''
  }
})

const outputPreview = computed(() => {
  // Output is usually massive, just showing "Output" is cleaner than ugly JSON previews
  return ''
})

const formattedInput = computed(() => {
  if (props.part.input === undefined) return ''
  try {
    return JSON.stringify(props.part.input, null, 2)
  } catch (e) {
    return String(props.part.input)
  }
})

const formattedOutput = computed(() => {
  if (!('output' in props.part) || props.part.output === undefined) return ''
  try {
    return JSON.stringify(props.part.output, null, 2)
  } catch (e) {
    return String(props.part.output)
  }
})

const isOutputLarge = computed(() => {
  return formattedOutput.value.split('\n').length > 6 || formattedOutput.value.length > 300
})
</script>

<style scoped>
.minimal-tool-call {
  display: flex;
  flex-direction: column;
  margin: 4px 0;
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

.error-icon {
  color: #e74c3c;
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
  overflow: hidden;
}

.tool-name {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.tool-preview {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  color: var(--text-muted);
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tool-chevron {
  opacity: 0.5;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}

.tool-chevron.open {
  transform: rotate(180deg);
}

.tool-details-container {
  display: flex;
  margin-top: 2px;
}

.tool-timeline-line {
  width: 1px;
  background: var(--glass-border);
  margin-left: 7.5px;
  margin-right: 16px;
  flex-shrink: 0;
}

.tool-details-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 0;
  padding-bottom: 8px;
  padding-top: 4px;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.error-label {
  color: #e74c3c;
}

.detail-accordion-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--text-muted);
  width: fit-content;
  max-width: 100%;
  text-align: left;
}

.detail-accordion-btn:hover {
  color: var(--text-secondary);
}

.accordion-chevron {
  opacity: 0.5;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.accordion-chevron.open {
  transform: rotate(90deg);
}

.output-preview {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  opacity: 0.6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.code-wrapper {
  position: relative;
  background: rgba(10, 10, 12, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.code-wrapper.is-clamped pre {
  max-height: 140px;
  overflow: hidden;
}

.fade-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to bottom, transparent, rgba(14, 14, 16, 0.95) 70%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
  pointer-events: none;
}

.read-more-btn {
  pointer-events: auto;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 12px;
  cursor: pointer;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.read-more-btn:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

pre {
  margin: 0;
  padding: 12px;
  overflow-x: auto;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.error-wrapper {
  border-color: rgba(231, 76, 60, 0.2);
  background: rgba(231, 76, 60, 0.05);
}

pre::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
pre::-webkit-scrollbar-track {
  background: transparent;
}
pre::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
pre::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
