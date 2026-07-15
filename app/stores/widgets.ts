import { defineStore } from 'pinia'
import { shallowRef, computed, ref } from 'vue'
import * as Y from 'yjs'
import { authClient } from '../utils/auth-client'
import { yWorkspaces, yWidgets, initLocalSync } from '../utils/yjs'

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
  // Added properties since we flattened it
  workspaceId?: string
  isArchived?: boolean
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
  const isInitializing = ref(true)
  
  // Handled by Worker now, but keep state for UI
  const syncStatus = ref<'saved' | 'syncing' | 'offline' | 'error'>('saved')
  const isSyncPending = ref(false)

  // Backwards compatible computed refs
  const activeWorkspace = computed(() => workspaces.value.find(w => w.id === activeWorkspaceId.value))
  
  // UI State (Not synced to CRDT)
  const expandedWidgets = ref<Set<string>>(new Set())

  const toggleWidgetExpanded = (widgetId: string) => {
    if (expandedWidgets.value.has(widgetId)) {
      expandedWidgets.value.delete(widgetId)
    } else {
      expandedWidgets.value.add(widgetId)
    }
  }

  const widgets = computed(() => activeWorkspace.value?.widgets || [])
  const archivedWidgets = computed(() => activeWorkspace.value?.archivedWidgets || [])

  // Rebuild the deeply nested workspaces array from the flat Yjs maps
  const buildNestedWorkspaces = () => {
    const wsMap = yWorkspaces.toJSON() as Record<string, Omit<Workspace, 'widgets' | 'archivedWidgets'>>
    const wMap = yWidgets.toJSON() as Record<string, Widget>
    
    // Group widgets by workspace
    const wsWidgets: Record<string, Widget[]> = {}
    const wsArchived: Record<string, Widget[]> = {}
    
    Object.values(wMap).forEach(w => {
      const wId = w.workspaceId
      if (!wId) return
      if (w.isArchived) {
        if (!wsArchived[wId]) wsArchived[wId] = []
        wsArchived[wId].push(w)
      } else {
        if (!wsWidgets[wId]) wsWidgets[wId] = []
        wsWidgets[wId].push(w)
      }
    })

    const newWorkspaces: Workspace[] = Object.values(wsMap).map(ws => {
      return {
        ...ws,
        widgets: wsWidgets[ws.id] || [],
        archivedWidgets: wsArchived[ws.id] || []
      }
    })
    
    newWorkspaces.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    workspaces.value = newWorkspaces
    
    // Validate active workspace
    if (!workspaces.value.some(w => w.id === activeWorkspaceId.value) && workspaces.value.length > 0) {
      const first = workspaces.value[0]
      if (first) {
        activeWorkspaceId.value = first.id
      }
    }
  }

  // Bind Yjs observers
  yWorkspaces.observe(() => buildNestedWorkspaces())
  yWidgets.observe(() => buildNestedWorkspaces())

  const createWorkspace = (label: string) => {
    const id = crypto.randomUUID()
    yWorkspaces.set(id, {
      id,
      label,
      canvasState: { x: 0, y: 0, scale: 1 },
      sortOrder: yWorkspaces.size
    })
    activeWorkspaceId.value = id
    return id
  }

  const deleteWorkspace = (id: string) => {
    if (id === 'main') return 
    if (yWorkspaces.size <= 1) return 

    yWorkspaces.delete(id)
    if (activeWorkspaceId.value === id) {
      activeWorkspaceId.value = 'main'
    }
    yWidgets.forEach((w, wId) => {
      if (w.workspaceId === id) {
        cleanupWidgetResources(w)
        yWidgets.delete(wId)
      }
    })
  }

  const renameWorkspace = (id: string, newLabel: string) => {
    if (!newLabel.trim()) return
    const ws = yWorkspaces.get(id)
    if (ws) {
      yWorkspaces.set(id, { ...ws, label: newLabel.trim() })
    }
  }

  const switchWorkspace = (id: string) => {
    if (yWorkspaces.has(id)) {
      activeWorkspaceId.value = id
    }
  }

  const saveCanvasState = (x: number, y: number, scale: number, id?: string) => {
    const targetId = id || activeWorkspaceId.value
    const ws = yWorkspaces.get(targetId)
    if (ws) {
      yWorkspaces.set(targetId, { ...ws, canvasState: { x, y, scale } })
    }
  }

  const init = async () => {
    try {
      isInitializing.value = true
      
      const { data: session } = await authClient.getSession()
      const currentUserId = session?.user?.id
      if (!currentUserId) return
      
      // Load IndexedDB state locally into Yjs
      await initLocalSync(currentUserId)
      
      // If empty (new user), bootstrap Main
      if (yWorkspaces.size === 0) {
        yWorkspaces.set('main', {
          id: 'main',
          label: 'Main',
          canvasState: { x: 0, y: 0, scale: 1 },
          sortOrder: 0
        })
      }
      
      buildNestedWorkspaces()

      // Dynamically import base64 utility (it's safe here since we are in async method)
      const { bytesToBase64, base64ToBytes } = await import('../utils/base64')
      
      const stateVector = bytesToBase64(Y.encodeStateVector(ydoc))
      const update = bytesToBase64(Y.encodeStateAsUpdate(ydoc))
      
      try {
        const responseData = await $fetch<{ update: string }>('/api/crdt/sync', { 
          method: 'POST', 
          body: { stateVector, update } 
        })
        
        if (responseData && responseData.update) {
            const serverUpdate = base64ToBytes(responseData.update)
            Y.applyUpdate(ydoc, serverUpdate, 'server')
        }
      } catch (err) {
        console.error('CRDT Sync endpoint failed. Working offline-first.', err)
      }
      
    } catch (e) {
      console.error('Failed to load workspaces', e)
    } finally {
      isInitializing.value = false
    }
  }

  const findSafePosition = (startX: number, startY: number, width: number, height: number, ignoreId?: string) => {
    const padding = 24
    const canvasWidth = 2560
    const canvasHeight = 1440
    
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
          currentY = w.y + w.height + padding
          break
        }
      }
      
      if (currentY + height > canvasHeight) {
        currentY = 0
        currentX += width + padding
      }
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
    if (yWidgets.has(id)) return
    
    const { x, y } = findSafePosition(widget.x, widget.y, widget.width, widget.height)
    
    yWidgets.set(id, {
      ...widget,
      id,
      x, y,
      workspaceId: activeWorkspaceId.value,
      isArchived: false,
      zIndex: getTopZIndex() + 1,
      updatedAt: Date.now()
    })
  }

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    const widget = yWidgets.get(id)
    if (widget) {
      let newX = updates.x ?? widget.x
      let newY = updates.y ?? widget.y
      
      const w = updates.width || widget.width
      const h = updates.height || widget.height
      newX = Math.max(0, Math.min(newX, 2560 - w))
      newY = Math.max(0, Math.min(newY, 1440 - h))
      
      if (updates.x !== undefined || updates.y !== undefined || updates.width !== undefined || updates.height !== undefined) {
         const safePos = findSafePosition(newX, newY, w, h, id)
         newX = safePos.x
         newY = safePos.y
      }

      yWidgets.set(id, { ...widget, ...updates, x: newX, y: newY, updatedAt: Date.now() })
    }
  }

  const cleanupWidgetResources = (w: Widget) => {
    const fileIds: Set<string> = new Set()
    
    const extractIdFromUrl = (url?: string) => {
      if (!url) return null
      const match = url.match(/\/files\/([a-zA-Z0-9_-]+)\/view/)
      return match ? match[1] : null
    }

    if (w.data.images && Array.isArray(w.data.images)) {
      w.data.images.forEach((img: any) => {
        if (img.appwriteFileId) fileIds.add(img.appwriteFileId)
        else {
          const id = extractIdFromUrl(img.url || (typeof img === 'string' ? img : undefined))
          if (id) fileIds.add(id)
        }
      })
    }
    
    if (w.data.appwriteFileId) {
      fileIds.add(w.data.appwriteFileId)
    } else if (w.data.url) {
      const id = extractIdFromUrl(w.data.url)
      if (id) fileIds.add(id)
    } else if (w.data.content && w.type === 'markdown') {
      const match = w.data.content.match(/\/files\/([a-zA-Z0-9_-]+)\/view/)
      if (match) fileIds.add(match[1])
    }

    if (w.data.files && Array.isArray(w.data.files)) {
      w.data.files.forEach((f: any) => {
        if (f.appwriteFileId) fileIds.add(f.appwriteFileId)
        else {
          const id = extractIdFromUrl(f.url)
          if (id) fileIds.add(id)
        }
      })
    }
    
    if (fileIds.size > 0) {
      $fetch('/api/delete-file', {
        method: 'POST',
        body: { fileIds: Array.from(fileIds) }
      }).catch(err => console.error('Failed to cleanup widget files:', err))
    }

    if (w.data.memoryId) {
      $fetch(`/api/memory/${w.data.memoryId}`, {
        method: 'DELETE'
      }).catch(err => console.error('Failed to cleanup widget memory:', err))
    }
  }

  const removeWidget = (id: string) => {
    const w = yWidgets.get(id)
    if (w) cleanupWidgetResources(w)
    yWidgets.delete(id)
  }

  const archiveWidget = (id: string) => {
    const w = yWidgets.get(id)
    if (w) yWidgets.set(id, { ...w, isArchived: true, updatedAt: Date.now() })
  }

  const restoreWidget = (id: string) => {
    const w = yWidgets.get(id)
    if (w) yWidgets.set(id, { ...w, isArchived: false, updatedAt: Date.now() })
  }

  const permanentlyDeleteArchivedWidget = (id: string) => {
    const w = yWidgets.get(id)
    if (w) cleanupWidgetResources(w)
    yWidgets.delete(id)
  }

  const moveWidgetToWorkspace = (widgetId: string, targetWorkspaceId: string) => {
    const w = yWidgets.get(widgetId)
    if (w && yWorkspaces.has(targetWorkspaceId)) {
      yWidgets.set(widgetId, { ...w, workspaceId: targetWorkspaceId, updatedAt: Date.now() })
    }
  }

  const autoArrangeWidgets = () => {
    if (widgets.value.length === 0) return
    const sortedWidgets = [...widgets.value].sort((a, b) => {
      if (Math.abs(a.y - b.y) < 100) return a.x - b.x
      return a.y - b.y
    })
    
    const padding = 40
    const maxGridWidth = 1800
    let currentX = 0, currentY = 0, rowMaxHeight = 0
    const layout = new Map<string, { x: number, y: number }>()
    let boundingWidth = 0, boundingHeight = 0
    
    for (const widget of sortedWidgets) {
      if (currentX > 0 && currentX + widget.width > maxGridWidth) {
        currentX = 0
        currentY += rowMaxHeight + padding
        rowMaxHeight = 0
      }
      layout.set(widget.id, { x: currentX, y: currentY })
      currentX += widget.width + padding
      rowMaxHeight = Math.max(rowMaxHeight, widget.height)
      boundingWidth = Math.max(boundingWidth, currentX - padding)
      boundingHeight = Math.max(boundingHeight, currentY + widget.height)
    }
    
    const canvasW = 2560, canvasH = 1440
    const offsetX = Math.max(0, (canvasW - boundingWidth) / 2)
    const offsetY = Math.max(0, (canvasH - boundingHeight) / 2)
    
    for (const w of sortedWidgets) {
      const pos = layout.get(w.id)
      if (pos) {
        const ew = yWidgets.get(w.id)
        if (ew) {
          yWidgets.set(w.id, { ...ew, x: pos.x + offsetX, y: pos.y + offsetY, updatedAt: Date.now() })
        }
      }
    }
  }

  const reorderWorkspaces = (oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex) return
    const newWorkspaces = [...workspaces.value]
    const [movedItem] = newWorkspaces.splice(oldIndex, 1)
    if (!movedItem) return
    newWorkspaces.splice(newIndex, 0, movedItem)
    
    newWorkspaces.forEach((ws, idx) => {
      const yws = yWorkspaces.get(ws.id)
      if (yws) yWorkspaces.set(ws.id, { ...yws, sortOrder: idx })
    })
  }

  const getTopZIndex = () => widgets.value.reduce((max, w) => Math.max(max, w.zIndex || 0), 0)
  const bringToFront = (id: string) => updateWidget(id, { zIndex: getTopZIndex() + 1 })

  const reloadFromServer = async () => { }

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
    autoArrangeWidgets,
    bringToFront,
    reloadFromServer,
    isInitializing,
    isSyncPending,
    expandedWidgets,
    toggleWidgetExpanded
  }
})
