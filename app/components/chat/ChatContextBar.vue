<template>
  <div class="context-bar">
    <TransitionGroup name="context-pill">
      <div v-for="(ctx, index) in activeContexts" :key="ctx.id" class="context-pill">
        <span class="context-label">{{ ctx.type }}</span>
        <span class="context-text">{{ ctx.text }}</span>
        <button class="context-clear" @click="emit('remove-context', index)" title="Remove context">
          <LucideX :size="12" stroke-width="2" />
        </button>
      </div>
      <div v-for="wCtx in pendingWidgetContexts" :key="'w-'+wCtx.id" class="context-pill">
        <span class="context-label">Widget</span>
        <span class="context-text">{{ wCtx.label }}</span>
        <button class="context-clear" @click="emit('remove-widget-context', wCtx.id)" title="Remove widget context">
          <LucideX :size="12" stroke-width="2" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">


defineProps<{
  activeContexts: Array<{ type: string; text: string; id: string }>
  pendingWidgetContexts: Array<{ id: string; label: string; text: string }>
}>()

const emit = defineEmits<{
  (e: 'remove-context', index: number): void
  (e: 'remove-widget-context', id: string): void
}>()
</script>

<style scoped>
.context-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(10, 10, 12, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 6px;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1);
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.context-bar::-webkit-scrollbar {
  display: none;
}

.context-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  padding: 6px 10px;
  box-sizing: border-box;
  max-width: 250px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.context-pill-enter-active,
.context-pill-leave-active,
.context-pill-move {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.context-pill-enter-from,
.context-pill-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(4px);
}

.context-pill-leave-active {
  position: absolute;
}

.context-label {
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 500;
  user-select: none;
}

.context-text {
  color: var(--text-primary);
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.context-clear {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  margin-left: 4px;
}

.context-clear:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}
</style>
