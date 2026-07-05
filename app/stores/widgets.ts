import { defineStore } from 'pinia'
import { shallowRef, computed, watch, ref } from 'vue'

export interface Widget {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  title?: string
  data: Record<string, any>
  zIndex?: number
  updatedAt?: number
}

export interface Workspace {
  id: string
  label: string
  widgets: Widget[]
  archivedWidgets: Widget[]
  canvasState: {
    x: number
    y: number
    scale: number
  }
  sortOrder?: number
}

export const useWidgetStore = defineStore('widgets', () => {
  const workspaces = shallowRef<Workspace[]>([])
  const activeWorkspaceId = ref<string>('main')
  
  // 'saved': All data pushed to DB
  // 'syncing': Currently pushing to DB
  // 'offline': Push failed, waiting for connection
  // 'error': Unrecoverable error
  const syncStatus = ref<'saved' | 'syncing' | 'offline' | 'error'>('saved')

  const { publish } = useRealtimeSync()

  // Backwards compatible computed refs
  const activeWorkspace = computed(() => workspaces.value.find(w => w.id === activeWorkspaceId.value))

  const widgets = computed({
    get: () => activeWorkspace.value?.widgets || [],
    set: (newWidgets) => {
      const idx = workspaces.value.findIndex(w => w.id === activeWorkspaceId.value)
      if (idx !== -1) {
        const newWorkspaces = [...workspaces.value]
        newWorkspaces[idx] = { ...newWorkspaces[idx], widgets: newWidgets }
        workspaces.value = newWorkspaces
      }
    }
  })

  const archivedWidgets = computed({
    get: () => activeWorkspace.value?.archivedWidgets || [],
    set: (newArchived) => {
      const idx = workspaces.value.findIndex(w => w.id === activeWorkspaceId.value)
      if (idx !== -1) {
        const newWorkspaces = [...workspaces.value]
        newWorkspaces[idx] = { ...newWorkspaces[idx], archivedWidgets: newArchived }
        workspaces.value = newWorkspaces
      }
    }
  })

  const createWorkspace = (label: string) => {
    const id = crypto.randomUUID()
    workspaces.value = [...workspaces.value, {
      id,
      label,
      widgets: [],
      archivedWidgets: [],
      canvasState: { x: 0, y: 0, scale: 1 },
      sortOrder: workspaces.value.length
    }]
    activeWorkspaceId.value = id
    return id
  }

  const deleteWorkspace = (id: string) => {
    if (id === 'main') return // Cannot delete the default main workspace
    if (workspaces.value.length <= 1) return // Prevent deleting last workspace
    workspaces.value = workspaces.value.filter(w => w.id !== id)
    if (activeWorkspaceId.value === id) {
      activeWorkspaceId.value = workspaces.value[0].id
    }
  }

  const renameWorkspace = (id: string, newLabel: string) => {
    if (!newLabel.trim()) return
    const idx = workspaces.value.findIndex(w => w.id === id)
    if (idx !== -1) {
      const newWorkspaces = [...workspaces.value]
      newWorkspaces[idx] = { ...newWorkspaces[idx], label: newLabel.trim() }
      workspaces.value = newWorkspaces
    }
  }

  const switchWorkspace = (id: string) => {
    if (workspaces.value.some(w => w.id === id)) {
      activeWorkspaceId.value = id
    }
  }

  const saveCanvasState = (x: number, y: number, scale: number, id?: string) => {
    const targetId = id || activeWorkspaceId.value
    const idx = workspaces.value.findIndex(w => w.id === targetId)
    if (idx !== -1) {
      const newWorkspaces = [...workspaces.value]
      newWorkspaces[idx] = { ...newWorkspaces[idx], canvasState: { x, y, scale } }
      workspaces.value = newWorkspaces
    }
  }

  // Load from LocalStorage instantly, then reconcile with DB
  const init = async () => {
    try {
      // 1. Instant Local Load
      const savedWorkspaces = localStorage.getItem('bubbles_workspaces')
      const savedActiveId = localStorage.getItem('bubbles_active_workspace')
      
      let hasLocalData = false
      if (savedWorkspaces) {
        const parsed = JSON.parse(savedWorkspaces)
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          workspaces.value = parsed
          if (savedActiveId && workspaces.value.some(w => w.id === savedActiveId)) {
            activeWorkspaceId.value = savedActiveId
          } else {
            activeWorkspaceId.value = workspaces.value[0].id
          }
          hasLocalData = true
        }
      }
      
      if (!hasLocalData) {
        // Fallback for brand new users or legacy migration
        const legacyWidgets = localStorage.getItem('bubbles_canvas_widgets')
        const legacyArchived = localStorage.getItem('bubbles_archived_widgets')
        
        const mainWorkspace: Workspace = {
          id: 'main',
          label: 'Main',
          widgets: legacyWidgets ? JSON.parse(legacyWidgets) : [],
          archivedWidgets: legacyArchived ? JSON.parse(legacyArchived) : [],
          canvasState: { x: 0, y: 0, scale: 1 },
          sortOrder: 0
        }
        
        if (!legacyWidgets) {
          mainWorkspace.widgets.push({
            id: crypto.randomUUID(),
            type: 'markdown',
            x: 1000,
            y: 720,
            width: 320,
            height: 240,
            zIndex: 0,
            title: 'Welcome to Canvas',
            data: { content: '### Hello!\nThis is a spatial workspace. You can drag widgets around, and Bubbles can create new ones for you!' }
          })
        }
        
        workspaces.value = [mainWorkspace]
        activeWorkspaceId.value = 'main'
      }

      // 2. Background DB Sync
      try {
        const serverWorkspaces = await $fetch<Workspace[]>('/api/sync')
        
        if (serverWorkspaces && serverWorkspaces.length > 0) {
          // DB has data, it becomes the source of truth
          workspaces.value = serverWorkspaces
          if (!serverWorkspaces.some(w => w.id === activeWorkspaceId.value)) {
            activeWorkspaceId.value = serverWorkspaces[0].id
          }
          // Update local storage immediately to match DB
          localStorage.setItem('bubbles_workspaces', JSON.stringify(workspaces.value))
          localStorage.setItem('bubbles_active_workspace', activeWorkspaceId.value)
        } else if (hasLocalData || workspaces.value.length > 0) {
          // DB is empty, but we have local/legacy data. Push it to DB.
          await syncToDB(true)
        }
      } catch (dbErr) {
        console.error('Failed to sync with DB, staying in offline mode:', dbErr)
      }
    } catch (e) {
      console.error('Failed to load workspaces', e)
    }
  }

  let isReloadingFromServer = false

  const reloadFromServer = async () => {
    try {
      const serverWorkspaces = await $fetch<Workspace[]>('/api/sync')
      if (serverWorkspaces && serverWorkspaces.length > 0) {
        isReloadingFromServer = true
        workspaces.value = serverWorkspaces
        if (!serverWorkspaces.some(w => w.id === activeWorkspaceId.value)) {
          activeWorkspaceId.value = serverWorkspaces[0].id
        }
        localStorage.setItem('bubbles_workspaces', JSON.stringify(workspaces.value))
        localStorage.setItem('bubbles_active_workspace', activeWorkspaceId.value)
        
        // Use setTimeout to absolutely guarantee the Vue deep watcher 
        // (which runs asynchronously) finishes before we reset the flag.
        setTimeout(() => {
          isReloadingFromServer = false
        }, 150)
      }
    } catch (e) {
      console.error('Failed to reload from server:', e)
    }
  }

  // Debounce state
  let syncTimeout: any = null
  let retryInterval: any = null

  let localSyncTimeout: any = null

  // Save to LocalStorage non-blocking, debounce save to DB
  const syncToDB = async (force = false) => {
    // 1. Non-blocking Local Save (prevents UI hitching on deep watch triggers)
    if (localSyncTimeout) clearTimeout(localSyncTimeout)
    localSyncTimeout = setTimeout(() => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        requestIdleCallback(() => {
          localStorage.setItem('bubbles_workspaces', JSON.stringify(workspaces.value))
          localStorage.setItem('bubbles_active_workspace', activeWorkspaceId.value)
        })
      } else {
        localStorage.setItem('bubbles_workspaces', JSON.stringify(workspaces.value))
        localStorage.setItem('bubbles_active_workspace', activeWorkspaceId.value)
      }
    }, 100)

    // 2. Debounced DB Save
    if (syncTimeout) clearTimeout(syncTimeout)
    
    const pushToDB = async () => {
      syncStatus.value = 'syncing'
      try {
        await $fetch('/api/sync', {
          method: 'POST',
          body: workspaces.value
        })
        syncStatus.value = 'saved'
        console.log('Synced to DB successfully.')
        publish('sync:widgets', { ts: Date.now() })
        if (retryInterval) {
          clearInterval(retryInterval)
          retryInterval = null
        }
      } catch (e) {
        console.error('Failed to push to DB (offline):', e)
        syncStatus.value = 'offline'
        
        // Exponential backoff or simple polling for retry
        if (!retryInterval) {
          retryInterval = setInterval(() => {
            if (navigator.onLine) {
              pushToDB()
            }
          }, 5000)
        }
      }
    }

    if (force) {
      await pushToDB()
    } else {
      syncTimeout = setTimeout(pushToDB, 2000)
    }
  }

  // Watch for changes to auto-sync
  watch([workspaces, activeWorkspaceId], () => {
    if (isReloadingFromServer) return
    syncToDB()
  }, { deep: true })

  // Auto-layout / Collision detection
  const findSafePosition = (startX: number, startY: number, width: number, height: number, ignoreId?: string) => {
    const padding = 24
    const canvasWidth = 2560
    const canvasHeight = 1440
    
    // Initial clamping to boundaries
    let currentX = Math.max(0, Math.min(startX, canvasWidth - width))
    let currentY = Math.max(0, Math.min(startY, canvasHeight - height))
    
    let hasCollision = true
    let attempts = 0

    while (hasCollision && attempts < 50) {
      hasCollision = false
      for (const w of widgets.value) {
        if (w.id === ignoreId) continue
        
        const overlapX = currentX < w.x + w.width + padding && currentX + width + padding > w.x
        const overlapY = currentY < w.y + w.height + padding && currentY + height + padding > w.y
        
        if (overlapX && overlapY) {
          hasCollision = true
          // Push down to avoid overlap
          currentY = w.y + w.height + padding
          break
        }
      }
      
      // If pushing down pushed it off canvas, try wrapping to next column
      if (currentY + height > canvasHeight) {
        currentY = 0
        currentX += width + padding
      }
      // If pushing right pushed it off canvas, just clamp it back (it will overlap but stay in bounds)
      if (currentX + width > canvasWidth) {
         currentX = canvasWidth - width
         currentY = Math.max(0, Math.min(currentY, canvasHeight - height))
         break
      }
      
      attempts++
    }
    return { x: currentX, y: currentY }
  }

  const addWidget = (widget: Omit<Widget, 'id'> & { id?: string }) => {
    const id = widget.id || crypto.randomUUID()
    
    // Idempotency guard: skip if this widget ID already exists in ANY workspace
    const existsAnywhere = workspaces.value.some(ws => ws.widgets.some(w => w.id === id))
    if (existsAnywhere) return
    
    const { x, y } = findSafePosition(widget.x, widget.y, widget.width, widget.height)
    
    widgets.value = [...widgets.value, {
      ...widget,
      id,
      x,
      y,
      zIndex: getTopZIndex() + 1,
      updatedAt: Date.now()
    }]
  }

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    const idx = widgets.value.findIndex(w => w.id === id)
    if (idx !== -1) {
      const widget = widgets.value[idx]
      
      let newX = updates.x ?? widget.x
      let newY = updates.y ?? widget.y
      
      // Clamp basic movement coordinates immediately
      const w = updates.width || widget.width
      const h = updates.height || widget.height
      newX = Math.max(0, Math.min(newX, 2560 - w))
      newY = Math.max(0, Math.min(newY, 1440 - h))
      
      // If position or size changed, ensure it's placed safely (on drop)
      if (updates.x !== undefined || updates.y !== undefined || updates.width !== undefined || updates.height !== undefined) {
         const safePos = findSafePosition(newX, newY, w, h, id)
         newX = safePos.x
         newY = safePos.y
      }

      const newWidgets = [...widgets.value]
      newWidgets[idx] = { ...widget, ...updates, x: newX, y: newY, updatedAt: Date.now() }
      widgets.value = newWidgets
    }
  }

  const removeWidget = (id: string) => {
    widgets.value = widgets.value.filter(w => w.id !== id)
  }

  const archiveWidget = (id: string) => {
    const idx = widgets.value.findIndex(w => w.id === id)
    if (idx !== -1) {
      const widgetToArchive = widgets.value[idx]
      // Add to archived list
      archivedWidgets.value = [...archivedWidgets.value, widgetToArchive]
      // Remove from canvas
      removeWidget(id)
    }
  }

  const restoreWidget = (id: string) => {
    const idx = archivedWidgets.value.findIndex(w => w.id === id)
    if (idx !== -1) {
      const widgetToRestore = archivedWidgets.value[idx]
      
      // Remove from archive
      archivedWidgets.value = archivedWidgets.value.filter(w => w.id !== id)
      
      // Re-add to canvas (this will automatically find a safe position if needed)
      addWidget(widgetToRestore)
    }
  }

  const permanentlyDeleteArchivedWidget = (id: string) => {
    archivedWidgets.value = archivedWidgets.value.filter(w => w.id !== id)
  }

  const moveWidgetToWorkspace = (widgetId: string, targetWorkspaceId: string) => {
    const sourceWs = activeWorkspace.value
    if (!sourceWs) return
    
    const widgetIndex = sourceWs.widgets.findIndex(w => w.id === widgetId)
    if (widgetIndex === -1) return
    
    const newWorkspaces = [...workspaces.value]
    
    const sourceIdx = newWorkspaces.findIndex(w => w.id === sourceWs.id)
    const targetIdx = newWorkspaces.findIndex(w => w.id === targetWorkspaceId)
    if (sourceIdx === -1 || targetIdx === -1) return
    
    const widgetToMove = newWorkspaces[sourceIdx].widgets[widgetIndex]
    
    const newSourceWidgets = [...newWorkspaces[sourceIdx].widgets]
    newSourceWidgets.splice(widgetIndex, 1)
    newWorkspaces[sourceIdx] = { ...newWorkspaces[sourceIdx], widgets: newSourceWidgets }
    
    const newTargetWidgets = [...newWorkspaces[targetIdx].widgets, widgetToMove]
    newWorkspaces[targetIdx] = { ...newWorkspaces[targetIdx], widgets: newTargetWidgets }
    
    workspaces.value = newWorkspaces
  }

  const reorderWorkspaces = (oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex) return
    const newWorkspaces = [...workspaces.value]
    const [movedItem] = newWorkspaces.splice(oldIndex, 1)
    newWorkspaces.splice(newIndex, 0, movedItem)
    
    // Update sortOrder for all to ensure sequence is maintained
    newWorkspaces.forEach((ws, idx) => {
      ws.sortOrder = idx
    })
    
    workspaces.value = newWorkspaces
  }

  const getTopZIndex = () => {
    return widgets.value.reduce((max, w) => Math.max(max, w.zIndex || 0), 0)
  }

  const bringToFront = (id: string) => {
    const topZ = getTopZIndex()
    updateWidget(id, { zIndex: topZ + 1 })
  }

  return {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    widgets,
    archivedWidgets,
    init,
    createWorkspace,
    deleteWorkspace,
    renameWorkspace,
    switchWorkspace,
    saveCanvasState,
    addWidget,
    updateWidget,
    removeWidget,
    archiveWidget,
    restoreWidget,
    permanentlyDeleteArchivedWidget,
    moveWidgetToWorkspace,
    findSafePosition,
    syncStatus,
    reorderWorkspaces,
    bringToFront,
    reloadFromServer
  }
})
