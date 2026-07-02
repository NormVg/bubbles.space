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
}

export const useWidgetStore = defineStore('widgets', () => {
  const workspaces = shallowRef<Workspace[]>([])
  const activeWorkspaceId = ref<string>('main')

  // Backwards compatible computed refs
  const activeWorkspace = computed(() => workspaces.value.find(w => w.id === activeWorkspaceId.value))

  const widgets = computed({
    get: () => activeWorkspace.value?.widgets || [],
    set: (newWidgets) => {
      const current = activeWorkspace.value
      if (current) {
        current.widgets = newWidgets
        workspaces.value = [...workspaces.value]
      }
    }
  })

  const archivedWidgets = computed({
    get: () => activeWorkspace.value?.archivedWidgets || [],
    set: (newArchived) => {
      const current = activeWorkspace.value
      if (current) {
        current.archivedWidgets = newArchived
        workspaces.value = [...workspaces.value]
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
      canvasState: { x: 0, y: 0, scale: 1 }
    }]
    activeWorkspaceId.value = id
    return id
  }

  const deleteWorkspace = (id: string) => {
    if (workspaces.value.length <= 1) return // Prevent deleting last workspace
    workspaces.value = workspaces.value.filter(w => w.id !== id)
    if (activeWorkspaceId.value === id) {
      activeWorkspaceId.value = workspaces.value[0].id
    }
  }

  const switchWorkspace = (id: string) => {
    if (workspaces.value.some(w => w.id === id)) {
      activeWorkspaceId.value = id
    }
  }

  const saveCanvasState = (x: number, y: number, scale: number, id?: string) => {
    const current = id ? workspaces.value.find(w => w.id === id) : activeWorkspace.value
    if (current) {
      current.canvasState = { x, y, scale }
      workspaces.value = [...workspaces.value]
    }
  }

  // Simulated DB fetch / Load from LocalStorage
  const init = async () => {
    try {
      const savedWorkspaces = localStorage.getItem('bubbles_workspaces')
      const savedActiveId = localStorage.getItem('bubbles_active_workspace')
      
      if (savedWorkspaces) {
        const parsed = JSON.parse(savedWorkspaces)
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          workspaces.value = parsed
          if (savedActiveId && workspaces.value.some(w => w.id === savedActiveId)) {
            activeWorkspaceId.value = savedActiveId
          } else {
            activeWorkspaceId.value = workspaces.value[0].id
          }
          return
        }
      }
      
      // Migration from old single-workspace structure OR failsafe if empty
      const legacyWidgets = localStorage.getItem('bubbles_canvas_widgets')
      const legacyArchived = localStorage.getItem('bubbles_archived_widgets')
        
        const mainWorkspace: Workspace = {
          id: 'main',
          label: 'Main',
          widgets: legacyWidgets ? JSON.parse(legacyWidgets) : [],
          archivedWidgets: legacyArchived ? JSON.parse(legacyArchived) : [],
          canvasState: { x: 0, y: 0, scale: 1 }
        }
        
        if (!legacyWidgets) {
          mainWorkspace.widgets.push({
            id: crypto.randomUUID(),
            type: 'markdown',
            x: 1000,
            y: 720,
            width: 320,
            height: 240,
            title: 'Welcome to Canvas',
            data: { content: '### Hello!\nThis is a spatial workspace. You can drag widgets around, and Bubbles can create new ones for you!' }
          })
        }
        
        workspaces.value = [mainWorkspace]
        activeWorkspaceId.value = 'main'
    } catch (e) {
      console.error('Failed to load workspaces', e)
    }
  }

  // Simulated DB sync / Save to LocalStorage
  const syncToDB = async () => {
    localStorage.setItem('bubbles_workspaces', JSON.stringify(workspaces.value))
    localStorage.setItem('bubbles_active_workspace', activeWorkspaceId.value)
  }

  // Watch for changes to auto-sync
  watch([workspaces, activeWorkspaceId], () => {
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
    
    // Idempotency guard: skip if this widget ID already exists
    if (widgets.value.some(w => w.id === id)) return
    
    const { x, y } = findSafePosition(widget.x, widget.y, widget.width, widget.height)
    
    widgets.value = [...widgets.value, {
      ...widget,
      id,
      x,
      y
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
      newWidgets[idx] = { ...widget, ...updates, x: newX, y: newY }
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

  return {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    widgets,
    archivedWidgets,
    init,
    createWorkspace,
    deleteWorkspace,
    switchWorkspace,
    saveCanvasState,
    addWidget,
    updateWidget,
    removeWidget,
    archiveWidget,
    restoreWidget,
    permanentlyDeleteArchivedWidget,
    findSafePosition
  }
})
