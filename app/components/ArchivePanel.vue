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
      <div class="archive-header">
        <div class="header-left">
          <LucideArchive :size="18" class="header-icon" />
          <h3>Archive</h3>
        </div>
        <button class="close-btn" @click="uiStore.closeArchive" aria-label="Close archive">
          <LucideX :size="18" />
        </button>
      </div>

      <div class="archive-content">
        <div v-if="store.archivedWidgets.length === 0" class="empty-state">
          <LucideArchive :size="32" class="empty-icon" />
          <p>No archived widgets</p>
          <span>Widgets you archive from the canvas will appear here.</span>
        </div>

        <div class="archived-list" v-else>
          <div v-for="widget in store.archivedWidgets" :key="widget.id" class="archived-item">
            <div class="item-info">
              <span class="item-type">{{ widget.type }}</span>
              <h4 class="item-title">{{ widget.title || 'Untitled Widget' }}</h4>
            </div>
            <div class="item-actions">
              <button class="action-btn restore-btn" @click="restore(widget.id)" title="Restore to Canvas">
                <LucideRotateCcw :size="14" />
                <span>Restore</span>
              </button>
              <button class="action-btn delete-btn" @click="remove(widget.id)" title="Permanently Delete">
                <LucideTrash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.archive-panel {
  position: absolute;
  top: 16px;
  bottom: 80px; /* Leave space for Quick Access Bar */
  right: 16px;
  width: 320px;
  background: rgba(20, 20, 22, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow: hidden;
}

html.light .archive-panel {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
}

.archive-header {
  height: 60px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.2);
}

html.light .archive-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  background: rgba(0, 0, 0, 0.02);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  color: var(--text-secondary);
}

.archive-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 0.2px;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

html.light .close-btn:hover {
  background: rgba(0, 0, 0, 0.06);
}

.archive-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  /* Custom scrollbar */
}

.archive-content::-webkit-scrollbar {
  width: 6px;
}
.archive-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
html.light .archive-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}

.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 32px;
  color: var(--text-secondary);
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0 0 8px 0;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

.empty-state span {
  font-size: 13px;
  line-height: 1.5;
  opacity: 0.7;
}

.archived-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.archived-item {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.2s ease;
}

html.light .archived-item {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.archived-item:hover {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.08);
}

html.light .archived-item:hover {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.08);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-type {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--accent);
}

.item-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.restore-btn {
  flex: 1;
  background: var(--accent);
  color: var(--accent-foreground);
}

.restore-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.delete-btn {
  width: 32px;
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.delete-btn:hover {
  background: rgba(231, 76, 60, 0.2);
  transform: scale(1.05);
}

/* Slide transition for right-side drawer */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-left-enter-from,
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>
