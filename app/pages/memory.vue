<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MemoryTree from '~/components/memory/MemoryTree.vue'
import MemoryViewer from '~/components/memory/MemoryViewer.vue'

const memories = ref<any[]>([])
const selectedMemory = ref<any | null>(null)
const isLoading = ref(true)

async function fetchMemories() {
  try {
    const res = await $fetch('/api/memory')
    memories.value = res as any[]
  } catch (err) {
    console.error('Failed to fetch memories:', err)
  } finally {
    isLoading.value = false
  }
}

async function handleSave(updatedMemory: any) {
  try {
    const res = await $fetch('/api/memory', {
      method: 'POST',
      body: updatedMemory
    })
    const index = memories.value.findIndex(m => m.id === updatedMemory.id)
    if (index !== -1) {
      memories.value[index] = res
    } else {
      memories.value.push(res)
    }
    selectedMemory.value = res
  } catch (err) {
    console.error('Failed to save memory:', err)
  }
}

async function handleDelete(id: string) {
  try {
    await $fetch(`/api/memory/${id}`, { method: 'DELETE' })
    memories.value = memories.value.filter(m => m.id !== id)
    if (selectedMemory.value?.id === id) {
      selectedMemory.value = null
    }
  } catch (err) {
    console.error('Failed to delete memory:', err)
  }
}

function handleSelect(memory: any) {
  selectedMemory.value = memory
}

onMounted(() => {
  fetchMemories()
})
</script>

<template>
  <div class="memory-page">
    <template v-if="isLoading">
      <!-- Loading Skeleton Sidebar -->
      <aside class="sidebar skeleton-sidebar">
        <div class="skel-header">
          <div class="skel-line w-24"></div>
        </div>
        <div class="skel-nav">
          <div v-for="i in 8" :key="i" class="skel-folder">
            <div class="skel-line w-32"></div>
          </div>
        </div>
      </aside>

      <!-- Loading Skeleton Main -->
      <div class="memory-main skeleton-main">
        <div class="skel-viewer-top">
          <div class="skel-line w-64 h-title"></div>
          <div class="skel-chips">
            <div class="skel-line w-20 h-chip"></div>
            <div class="skel-line w-16 h-chip"></div>
            <div class="skel-line w-24 h-chip"></div>
          </div>
        </div>
        <div class="skel-meta-strip">
          <div v-for="i in 4" :key="i" class="skel-meta-cell">
            <div class="skel-line w-16 h-tiny"></div>
            <div class="skel-line w-24"></div>
          </div>
        </div>
        <div class="skel-body">
          <div v-for="i in 5" :key="i" class="skel-line w-full" :style="{ width: `${80 + Math.random() * 15}%` }"></div>
        </div>
      </div>
    </template>
    
    <template v-else>
      <!-- Sidebar -->
      <MemoryTree 
        :memories="memories" 
        :selected-id="selectedMemory?.id ?? null"
        @select="handleSelect"
      />

      <!-- Main panel -->
      <div class="memory-main">
        <MemoryViewer 
          :memory="selectedMemory"
          @save="handleSave"
          @delete="handleDelete"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.memory-page {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-sans);
  overflow: hidden;
}

.memory-main {
  flex: 1;
  height: 100%;
  min-width: 0;
  background: var(--bg-soft);
  position: relative;
}

/* ─── Skeleton Loading ──────────────── */
.sidebar {
  width: 256px;
  min-width: 256px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
}

.skeleton-sidebar {
  padding: 20px 16px;
}

.skel-header {
  margin-bottom: 24px;
}

.skel-nav {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skel-folder {
  display: flex;
  align-items: center;
  height: 24px;
}

.skeleton-main {
  display: flex;
  flex-direction: column;
}

.skel-viewer-top {
  padding: 24px 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skel-chips {
  display: flex;
  gap: 8px;
}

.skel-meta-strip {
  display: flex;
  gap: 32px;
  padding: 14px 28px;
  border-bottom: 1px solid var(--border);
}

.skel-meta-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skel-body {
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Base skeleton animation */
@keyframes pulse {
  0% { opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { opacity: 0.3; }
}

.skel-line {
  background: var(--bg-muted);
  border-radius: 4px;
  height: 16px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.w-full { width: 100%; }
.w-64 { width: 256px; }
.w-32 { width: 128px; }
.w-24 { width: 96px; }
.w-20 { width: 80px; }
.w-16 { width: 64px; }

.h-title { height: 24px; }
.h-chip { height: 20px; border-radius: 6px; }
.h-tiny { height: 10px; }
</style>
