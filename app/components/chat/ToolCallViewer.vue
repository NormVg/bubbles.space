<template>
  <div class="tool-call-viewer" :class="{ expanded }">
    <button class="tool-call-header" @click="toggleExpand" type="button" aria-label="Toggle tool call details">
      <div class="tool-icon-wrapper" :class="statusClass">
        <LucideLoader2 v-if="isProcessing" class="spin-icon" :size="16" stroke-width="2.5" />
        <LucideCheckCircle2 v-else-if="isSuccess" class="success-icon" :size="16" stroke-width="2.5" />
        <LucideXCircle v-else class="error-icon" :size="16" stroke-width="2.5" />
      </div>
      
      <div class="tool-info">
        <span class="tool-name">{{ displayName }}</span>
        <span class="tool-status">{{ statusText }}</span>
      </div>

      <div class="tool-chevron" :class="{ open: expanded }">
        <LucideChevronDown :size="16" stroke-width="2" />
      </div>
    </button>

    <Transition name="expand-pane">
      <div v-if="expanded" class="tool-details-pane">
        <div class="code-block" v-if="hasInput">
          <div class="code-block-header">Input Arguments</div>
          <pre><code>{{ formattedInput }}</code></pre>
        </div>
        
        <div class="code-block" v-if="hasOutput">
          <div class="code-block-header">Tool Result</div>
          <pre><code>{{ formattedOutput }}</code></pre>
        </div>

        <div class="code-block error-block" v-if="hasError">
          <div class="code-block-header">Error</div>
          <pre><code>{{ part.errorText }}</code></pre>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { EveDynamicToolPart } from 'eve/vue'

const props = defineProps<{
  part: EveDynamicToolPart
}>()

const expanded = ref(false)

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

const statusClass = computed(() => {
  if (isProcessing.value) return 'status-processing'
  if (isSuccess.value) return 'status-success'
  return 'status-error'
})

const statusText = computed(() => {
  switch (props.part.state) {
    case 'input-streaming': return 'Receiving arguments...'
    case 'input-available': return 'Processing...'
    case 'approval-requested': return 'Waiting for approval...'
    case 'output-available': return 'Completed'
    case 'output-error': return 'Failed'
    case 'output-denied': return 'Denied'
    case 'approval-responded': return 'Approval responded'
    default: return 'Unknown state'
  }
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
</script>

<style scoped>
.tool-call-viewer {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  margin: 12px 0;
  max-width: 90%;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1);
}

.tool-call-viewer:hover {
  border-color: rgba(255, 255, 255, 0.15);
}

.tool-call-header {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: 12px;
}

.tool-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  flex-shrink: 0;
}

.status-processing {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.status-success {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.status-error {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.spin-icon {
  animation: spin 1.2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.tool-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 2px;
}

.tool-name {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tool-status {
  color: var(--text-muted);
  font-size: 11px;
}

.tool-chevron {
  color: var(--text-muted);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
}

.tool-chevron.open {
  transform: rotate(180deg);
}

.expand-pane-enter-active,
.expand-pane-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  opacity: 1;
}

.expand-pane-enter-from,
.expand-pane-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin: 0;
}

.tool-details-pane {
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.code-block {
  background: rgba(10, 10, 12, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.error-block {
  border-color: rgba(231, 76, 60, 0.2);
  background: rgba(231, 76, 60, 0.05);
}

.code-block-header {
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.2);
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

pre {
  margin: 0;
  padding: 12px;
  overflow-x: auto;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
