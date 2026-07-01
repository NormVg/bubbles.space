<template>
  <div class="minimal-tool-call">
    <button class="tool-summary-row" @click="toggleExpand" type="button" aria-label="Toggle tool call details">
      <div class="tool-icon">
        <LucideLoader2 v-if="isProcessing" class="spin-icon" :size="14" stroke-width="2.5" />
        <LucideCheckCircle2 v-else-if="isSuccess" class="success-icon" :size="14" stroke-width="2.5" />
        <LucideXCircle v-else class="error-icon" :size="14" stroke-width="2.5" />
      </div>
      
      <span class="tool-text">
        Used tool <span class="tool-name">{{ displayName }}</span>
      </span>
      
      <LucideChevronDown class="tool-chevron" :class="{ open: expanded }" :size="14" stroke-width="2" />
    </button>

    <div v-if="expanded" class="tool-details-container">
      <div class="tool-timeline-line"></div>
      <div class="tool-details-content">
        <!-- Input Block -->
        <div v-if="hasInput" class="code-wrapper" :class="{ 'is-clamped': !showFullInput && isInputLarge }">
          <div class="code-label">Input</div>
          <pre><code>{{ formattedInput }}</code></pre>
          <div v-if="!showFullInput && isInputLarge" class="fade-overlay">
            <button class="read-more-btn" @click.stop="showFullInput = true">Read more</button>
          </div>
        </div>
        
        <!-- Output Block -->
        <div v-if="hasOutput" class="code-wrapper" :class="{ 'is-clamped': !showFullOutput && isOutputLarge }">
          <div class="code-label">Output</div>
          <pre><code>{{ formattedOutput }}</code></pre>
          <div v-if="!showFullOutput && isOutputLarge" class="fade-overlay">
            <button class="read-more-btn" @click.stop="showFullOutput = true">Read more</button>
          </div>
        </div>

        <!-- Error Block -->
        <div v-if="hasError" class="code-wrapper error-wrapper">
          <div class="code-label">Error</div>
          <pre><code>{{ part.errorText }}</code></pre>
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
const showFullInput = ref(false)
const showFullOutput = ref(false)

const toggleExpand = () => {
  expanded.value = !expanded.value
}

const displayName = computed(() => {
  return props.part.toolMetadata?.eve?.name || props.part.toolName || 'Unknown Tool'
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

// Determine if the content is large enough to need clamping
const isInputLarge = computed(() => {
  return formattedInput.value.split('\n').length > 6 || formattedInput.value.length > 300
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
  transition: color 0.2s ease;
  user-select: none;
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
  opacity: 0.8;
}

.spin-icon {
  animation: spin 1.2s linear infinite;
  color: var(--text-muted);
}

.success-icon {
  color: var(--text-muted); /* Keep it understated instead of loud green */
}

.error-icon {
  color: #e74c3c;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.tool-text {
  font-size: 13px;
}

.tool-name {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12.5px;
  color: var(--text-secondary);
}

.tool-chevron {
  opacity: 0.5;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
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
  margin-left: 7.5px; /* Centers under the 16px icon (16/2 - 0.5 = 7.5) */
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
  pointer-events: none; /* Let clicks pass through except on the button */
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

.code-label {
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.15);
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

/* Scrollbar styling for code blocks */
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
