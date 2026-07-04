<script setup lang="ts">
import { computed, ref } from 'vue'

interface MemoryItem {
  id: string
  path: string
  title: string
  type: string | null
  state: string
  version: number
  validFrom: string
  validTo: string | null
  effectiveConfidence: number
}

const props = defineProps<{
  memories: MemoryItem[]
  selectedId: string | null
}>()

const emit = defineEmits(['select'])

const DIRS = [
  { path: 'working',    label: 'Working' },
  { path: 'episodic',   label: 'Episodic' },
  { path: 'semantic',   label: 'Semantic' },
  { path: 'procedural', label: 'Procedural' },
  { path: 'identity',   label: 'Identity' },
  { path: 'hot',        label: 'Hot' },
  { path: 'archive',    label: 'Archive' },
  { path: 'system',     label: 'System' },
] as const

/** Which folders are expanded */
const expandedFolders = ref<Set<string>>(new Set(DIRS.map(d => d.path)))

function toggleFolder(folder: string) {
  if (expandedFolders.value.has(folder)) {
    expandedFolders.value.delete(folder)
  } else {
    expandedFolders.value.add(folder)
  }
}

const groupedMemories = computed(() => {
  const groups: Record<string, MemoryItem[]> = {}
  for (const dir of DIRS) groups[dir.path] = []
  groups['_root'] = []

  for (const mem of props.memories) {
    if (mem.type === 'directory') continue
    const parts = mem.path.split('/')
    const folder = parts.length > 1 ? parts[0] : '_root'
    if (!groups[folder]) groups[folder] = []
    groups[folder].push(mem)
  }
  return groups
})

const sortedFolders = computed(() => {
  const order = DIRS.map(d => d.path)
  const all = Object.keys(groupedMemories.value)
  const predefined = all.filter(k => order.includes(k)).sort((a, b) => order.indexOf(a) - order.indexOf(b))
  const dynamic = all.filter(k => k !== '_root' && !order.includes(k)).sort()
  const root = all.includes('_root') && groupedMemories.value['_root'].length > 0 ? ['_root'] : []
  return [...predefined, ...dynamic, ...root]
})

function getDirLabel(folder: string) {
  return DIRS.find(d => d.path === folder)?.label || (folder === '_root' ? 'Ungrouped' : folder)
}

function getFileName(path: string, folder: string) {
  if (folder !== '_root' && path.startsWith(folder + '/')) {
    return path.substring(folder.length + 1)
  }
  return path
}

const totalCount = computed(() => props.memories.filter(m => m.type !== 'directory').length)
</script>

<template>
  <aside class="sidebar">
    <!-- Header -->
    <div class="sidebar-header">
      <div class="sidebar-title-row">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" opacity="0.3" />
          <path d="M12 6v6l4 2" />
        </svg>
        <span class="sidebar-title">Memory</span>
        <span class="sidebar-count" v-if="totalCount > 0">{{ totalCount }}</span>
      </div>
    </div>

    <!-- Folder list -->
    <nav class="sidebar-nav" role="tree">
      <div
        v-for="folder in sortedFolders"
        :key="folder"
        class="folder"
        role="treeitem"
      >
        <!-- Folder row -->
        <button
          class="folder-row"
          :class="{ 'is-empty': groupedMemories[folder].length === 0 }"
          @click="toggleFolder(folder)"
          :aria-expanded="expandedFolders.has(folder)"
        >
          <svg
            class="chevron"
            :class="{ rotated: expandedFolders.has(folder) }"
            width="10" height="10" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span class="folder-name">{{ getDirLabel(folder) }}</span>
          <span
            class="folder-badge"
            v-if="groupedMemories[folder].length > 0"
          >{{ groupedMemories[folder].length }}</span>
        </button>

        <!-- Files -->
        <Transition name="expand">
          <div
            v-if="expandedFolders.has(folder) && groupedMemories[folder].length > 0"
            class="file-list"
          >
            <button
              v-for="file in groupedMemories[folder]"
              :key="file.id"
              class="file-row"
              :class="{
                selected: selectedId === file.id,
                superseded: file.state === 'superseded'
              }"
              @click="emit('select', file)"
            >
              <span class="file-dot" />
              <span class="file-label">{{ getFileName(file.path, folder) }}</span>
              <span v-if="file.version > 1" class="file-version">v{{ file.version }}</span>
            </button>
          </div>
        </Transition>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 256px;
  min-width: 256px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-base);
  border-right: 1px solid var(--border);
  -webkit-font-smoothing: antialiased;
  user-select: none;
}

/* ─── Header ─────────────────────── */
.sidebar-header {
  padding: 20px 16px 14px;
}

.sidebar-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-icon {
  color: var(--accent);
  opacity: 0.7;
}

.sidebar-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: var(--text-primary);
}

.sidebar-count {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-muted);
  padding: 1px 6px;
  border-radius: 9999px;
  margin-left: auto;
}

/* ─── Nav ────────────────────────── */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px 16px;
}

.sidebar-nav::-webkit-scrollbar { width: 3px; }
.sidebar-nav::-webkit-scrollbar-track { background: transparent; }
.sidebar-nav::-webkit-scrollbar-thumb { background: var(--border); border-radius: 9999px; }

/* ─── Folder ─────────────────────── */
.folder {
  margin-bottom: 1px;
}

.folder-row {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--transition-fast);
  min-height: 30px;
}

.folder-row:hover {
  background: var(--hover-bg);
}

.folder-row.is-empty {
  opacity: 0.35;
}

.chevron {
  color: var(--text-muted);
  flex-shrink: 0;
  transition: transform 200ms cubic-bezier(0.19, 1, 0.22, 1);
}

.chevron.rotated {
  transform: rotate(90deg);
}

.folder-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  flex: 1;
}

.folder-badge {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

/* ─── File items ─────────────────── */
.file-list {
  padding-left: 14px;
  overflow: hidden;
}

.file-row {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--transition-fast);
  min-height: 28px;
}

.file-row:hover {
  background: var(--hover-bg);
}

.file-row:active {
  transform: scale(0.98);
}

.file-row.selected {
  background: var(--accent-glow);
}

.file-row.selected .file-label {
  color: var(--text-primary);
}

.file-row.selected .file-dot {
  background: var(--accent);
  box-shadow: 0 0 6px var(--accent-glow);
}

.file-row.superseded {
  opacity: 0.35;
}

.file-row.superseded .file-label {
  text-decoration: line-through;
}

.file-dot {
  width: 5px;
  height: 5px;
  border-radius: 9999px;
  background: var(--text-muted);
  flex-shrink: 0;
  transition: background 200ms cubic-bezier(0.19, 1, 0.22, 1), box-shadow 200ms cubic-bezier(0.19, 1, 0.22, 1);
}

.file-label {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  line-height: 1.4;
  transition: color var(--transition-fast);
}

.file-version {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: var(--accent);
  opacity: 0.7;
  background: var(--accent-glow);
  padding: 1px 5px;
  border-radius: 4px;
  flex-shrink: 0;
}

/* ─── Expand transition ──────────── */
.expand-enter-active {
  transition: max-height 200ms cubic-bezier(0.19, 1, 0.22, 1), opacity 200ms cubic-bezier(0.19, 1, 0.22, 1);
  max-height: 600px;
}
.expand-leave-active {
  transition: max-height 150ms cubic-bezier(0.55, 0.05, 0.68, 0.19), opacity 150ms cubic-bezier(0.55, 0.05, 0.68, 0.19);
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
