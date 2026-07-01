<template>
  <div class="tool-call-group" :class="{ 'is-single': tools.length === 1 }">
    <!-- Group Summary Row -->
    <button v-if="tools.length > 1" class="group-summary-row" @click="expanded = !expanded" type="button" aria-label="Toggle tool calls">
      <div class="group-icon">
        <LucideWrench :size="14" stroke-width="2.5" />
      </div>
      
      <div class="group-text-container">
        <span class="group-text">
          <template v-if="isProcessing">
            Using {{ tools.length }} tools...
          </template>
          <template v-else>
            Used {{ tools.length }} tools
          </template>
        </span>
      </div>
      
      <LucideChevronDown class="group-chevron" :class="{ open: expanded }" :size="14" stroke-width="2" />
    </button>

    <!-- Group Timeline -->
    <div v-if="expanded || tools.length === 1" class="group-timeline" :class="{ 'single-timeline': tools.length === 1 }">
      <div v-if="tools.length > 1" class="timeline-main-line"></div>
      <div class="timeline-items">
        <ToolCallViewer v-for="(tool, i) in tools" :key="i" :part="tool" :class="{ 'grouped-tool': tools.length > 1 }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { EveDynamicToolPart } from 'eve/vue'
import ToolCallViewer from './ToolCallViewer.vue'

const props = defineProps<{
  tools: EveDynamicToolPart[]
}>()

// Auto-expand if there are processing tools
const isProcessing = computed(() => {
  return props.tools.some(t => ['input-streaming', 'input-available', 'approval-requested'].includes(t.state))
})

const expanded = ref(isProcessing.value)

// If a new tool starts processing in this group, ensure it expands
watch(isProcessing, (newVal) => {
  if (newVal) {
    expanded.value = true
  }
})
</script>

<style scoped>
.tool-call-group {
  display: flex;
  flex-direction: column;
  margin: 8px 0;
  width: 100%;
}

.tool-call-group.is-single {
  margin: 0;
}

.group-summary-row {
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

.group-summary-row:hover {
  color: var(--text-secondary);
}

.group-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.8;
  color: var(--text-muted);
}

.group-text-container {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.group-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.group-chevron {
  opacity: 0.5;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}

.group-chevron.open {
  transform: rotate(180deg);
}

.group-timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 4px;
}

.group-timeline.single-timeline {
  margin-top: 0;
}

.timeline-main-line {
  position: absolute;
  top: 8px; /* Start slightly below the first icon */
  bottom: 8px; /* End slightly above the last icon */
  left: 7.5px; /* Center with the 16px icons */
  width: 1px;
  background: var(--glass-border);
  z-index: 0;
}

.timeline-items {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 1;
}

/* ToolCallViewer overrides when inside a group */
:deep(.grouped-tool) {
  margin: 0 !important;
}

/* Ensure the tool icons mask the background line */
:deep(.grouped-tool .tool-icon) {
  background: var(--bg-primary, #09090b); /* Match app background */
  border-radius: 50%;
}
</style>
