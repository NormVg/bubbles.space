<template>
  <div v-if="quotes" class="user-message-quotes">
    <!-- If only 1 quote, just show it normally -->
    <template v-if="quotes.length === 1">
      <div class="user-message-quote">
        <div class="quote-icon"><LucideReply :size="12" /></div>
        <div class="quote-text">{{ quotes[0] }}</div>
      </div>
    </template>
    
    <!-- If multiple, show a collapsible stack -->
    <template v-else>
      <div 
        class="user-message-quote collapsible-quote" 
        @click="isExpanded = !isExpanded"
        :class="{ expanded: isExpanded }"
      >
        <div class="quote-header">
          <div class="quote-icon"><LucideLayers :size="12" /></div>
          <div class="quote-text summary">{{ quotes.length }} contexts attached</div>
          <div class="quote-chevron"><LucideChevronDown :size="14" /></div>
        </div>
        
        <div class="quote-content-wrapper">
          <div class="quote-content">
            <div class="quote-content-inner">
              <div v-for="(quote, idx) in quotes" :key="idx" class="nested-quote">
                <div class="quote-icon"><LucideReply :size="10" /></div>
                <div class="quote-text">{{ quote }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  quotes: string[] | null
}>()

const isExpanded = ref(false)
</script>

<style scoped>
.user-message-quotes {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-message-quote {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.collapsible-quote {
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.collapsible-quote:hover {
  background: rgba(255, 255, 255, 0.06);
}

.quote-header {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.quote-chevron {
  margin-left: auto;
  opacity: 0.6;
  transition: transform 0.3s ease;
}

.collapsible-quote.expanded .quote-chevron {
  transform: rotate(180deg);
}

.quote-content-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
}

.collapsible-quote.expanded .quote-content-wrapper {
  grid-template-rows: 1fr;
}

.quote-content {
  overflow: hidden;
}

.quote-content-inner {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.nested-quote {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.quote-icon {
  margin-top: 2px;
  opacity: 0.6;
  flex-shrink: 0;
}

.quote-text {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quote-text.summary {
  font-weight: 500;
}
</style>
