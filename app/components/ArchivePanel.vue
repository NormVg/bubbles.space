<script setup lang="ts">
import { useWidgetStore } from '../stores/widgets'
import { useUIStore } from '../stores/ui'

const store = useWidgetStore()
const uiStore = useUIStore()

const restore = (id: string) => {
  store.restoreWidget(id)
}

const remove = (id: string) => {
  store.permanentlyDeleteArchivedWidget(id)
}
</script>

<template>
  <Transition name="popover-fade">
    <div v-if="uiStore.isArchiveOpen" class="archive-popover">
      <div v-if="store.archivedWidgets.length === 0" class="empty-state">
        <span class="empty-text">No archived widgets</span>
      </div>

      <div class="popover-list" v-else>
        <div v-for="widget in store.archivedWidgets" :key="widget.id" class="popover-item group">
          <div class="item-content">
            <span class="item-title">{{ widget.title || widget.type }}</span>
            <span class="item-type">{{ widget.type }}</span>
          </div>
          <div class="item-actions">
            <button class="icon-btn restore" @click="restore(widget.id)" title="Restore">
              <LucideRotateCcw :size="14" :stroke-width="2" />
            </button>
            <button class="icon-btn delete" @click="remove(widget.id)" title="Delete">
              <LucideTrash2 :size="14" :stroke-width="2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.archive-popover {
  position: absolute;
  bottom: 74px; /* Above the Quick Access Bar */
  right: 16px;
  width: 240px;
  background: var(--bg-surface-1, #141414); /* Solid bg for popover text legibility */
  border: 1px solid var(--border-default, rgba(255, 255, 255, 0.08));
  border-radius: 12px; /* radius-large */
  box-shadow: 0 4px 16px rgba(0,0,0,0.60), 0 20px 64px rgba(0,0,0,0.50); /* Modal elevation */
  padding: 6px 0;
  z-index: 100;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

html.light .archive-popover {
  background: var(--bg-surface-1, #F7F7F6);
  border: 1px solid var(--border-default, rgba(0, 0, 0, 0.08));
  box-shadow: 0 4px 16px rgba(0,0,0,0.12), 0 20px 64px rgba(0,0,0,0.08);
}

.empty-state {
  padding: 16px;
  text-align: center;
}

.empty-text {
  font-size: 13px; /* small */
  color: var(--text-muted, rgba(255, 255, 255, 0.35));
}

html.light .empty-text {
  color: var(--text-muted, rgba(0, 0, 0, 0.38));
}

.popover-list {
  display: flex;
  flex-direction: column;
  max-height: 320px;
  overflow-y: auto;
  padding: 0 6px; /* Give items room for border-radius */
}

/* Custom Scrollbar */
.popover-list::-webkit-scrollbar {
  width: 4px;
}
.popover-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
html.light .popover-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}

.popover-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  height: 44px;
  border-radius: 8px; /* radius-medium */
  transition: background 100ms ease-out;
  cursor: default;
}

.popover-item:hover {
  background: var(--bg-surface-2, #1C1C1C);
}

html.light .popover-item:hover {
  background: var(--bg-surface-2, #F0F0EF);
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
  flex: 1;
}

.item-title {
  font-size: 13px; /* small */
  font-weight: 500;
  color: var(--text-primary, #EFEFEF);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

html.light .item-title {
  color: var(--text-primary, #111110);
}

.item-type {
  font-size: 11px; /* caption */
  font-weight: 400;
  color: var(--text-muted, rgba(255, 255, 255, 0.35));
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

html.light .item-type {
  color: var(--text-muted, rgba(0, 0, 0, 0.38));
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transform: translateX(4px);
  transition: opacity 150ms ease-out, transform 150ms ease-out;
}

.popover-item:hover .item-actions {
  opacity: 1;
  transform: translateX(0);
}

.icon-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary, rgba(255, 255, 255, 0.55));
  transition: all 150ms ease-out;
}

html.light .icon-btn {
  color: var(--text-secondary, rgba(0, 0, 0, 0.55));
}

.icon-btn.restore:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary, #EFEFEF);
}

html.light .icon-btn.restore:hover {
  background: rgba(0, 0, 0, 0.06);
  color: var(--text-primary, #111110);
}

.icon-btn.delete:hover {
  background: hsla(0, 65%, 60%, 0.14); /* Danger muted bg dark */
  color: #E24B4A; /* Danger text */
}

html.light .icon-btn.delete:hover {
  background: hsla(0, 72%, 54%, 0.12); /* Danger muted bg light */
  color: #E24B4A;
}

/* Popover Animation */
.popover-fade-enter-active {
  transition: opacity 150ms ease-out, transform 150ms ease-out;
}

.popover-fade-leave-active {
  transition: opacity 100ms ease-in, transform 100ms ease-in; /* Exit faster */
}

.popover-fade-enter-from {
  opacity: 0;
  transform: scale(0.97) translateY(4px);
}

.popover-fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
