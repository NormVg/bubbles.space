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
  <Transition name="slide-left">
    <div v-if="uiStore.isArchiveOpen" class="archive-panel">
      
      <div v-if="store.archivedWidgets.length === 0" class="empty-state">
        <LucideArchive :size="24" class="empty-icon" />
        <p>Archive is empty</p>
      </div>

      <div class="archive-list" v-else>
        <div v-for="(widget, index) in store.archivedWidgets" :key="widget.id" class="archive-item group" :style="{ animationDelay: `${index * 0.04 + 0.05}s` }">
          <div class="item-info">
            <h4 class="item-title">{{ widget.title || 'Untitled Widget' }}</h4>
            <span class="item-type">{{ widget.type }}</span>
          </div>
          <div class="item-actions">
            <button class="action-btn restore" @click="restore(widget.id)" title="Restore">
              <LucideRotateCcw :size="14" stroke-width="2" />
            </button>
            <button class="action-btn delete" @click="remove(widget.id)" title="Permanently Delete">
              <LucideTrash2 :size="14" stroke-width="2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.archive-panel {
  position: absolute;
  /* Placed to the LEFT of the Quick Access Bar */
  bottom: 16px;
  right: 70px;
  width: 260px;
  max-height: 400px;
  background: rgba(20, 20, 22, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow: hidden;
}

html.light .archive-panel {
  background: rgba(255, 255, 255, 0.90);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  color: var(--text-muted, rgba(255, 255, 255, 0.35));
}

.empty-icon {
  margin-bottom: 8px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
}

.archive-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 8px;
  gap: 4px;
}

/* Custom scrollbar */
.archive-list::-webkit-scrollbar {
  width: 4px;
}
.archive-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
html.light .archive-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}

.archive-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 10px;
  background: transparent;
  transition: background 0.2s ease-out;
  animation: item-cascade 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

@keyframes item-cascade {
  0% {
    opacity: 0;
    transform: translateX(12px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

.archive-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

html.light .archive-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
  flex: 1;
}

.item-title {
  margin: 0;
  font-size: 13px;
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
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--accent);
  opacity: 0.8;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0;
  transform: translateX(10px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.archive-item:hover .item-actions {
  opacity: 1;
  transform: translateX(0);
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  color: var(--text-secondary, rgba(255, 255, 255, 0.55));
  cursor: pointer;
  transition: all 0.15s ease;
}

html.light .action-btn {
  background: rgba(0, 0, 0, 0.03);
  color: var(--text-secondary, rgba(0, 0, 0, 0.55));
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary, #EFEFEF);
  transform: scale(1.05);
}

html.light .action-btn:hover {
  background: rgba(0, 0, 0, 0.06);
  color: var(--text-primary, #111110);
}

.action-btn.delete:hover {
  background: rgba(226, 75, 74, 0.15); /* Danger muted bg */
  color: #E24B4A; /* Danger text */
}

/* Slide transition - broken into segments completing at different rates */
.slide-left-enter-active {
  transition: 
    opacity 0.3s cubic-bezier(0.2, 0, 0, 1), 
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    backdrop-filter 0.4s ease;
}

.slide-left-leave-active {
  transition: 
    opacity 0.2s ease-in, 
    transform 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.slide-left-enter-from,
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.97);
  backdrop-filter: blur(0px);
}
</style>
