import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

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

export const useWidgetStore = defineStore('widgets', () => {
  const widgets = ref<Widget[]>([])

  // Simulated DB fetch / Load from LocalStorage
  const init = async () => {
    try {
      const saved = localStorage.getItem('bubbles_canvas_widgets')
      if (saved) {
        widgets.value = JSON.parse(saved)
      } else {
        // Initial example widget if canvas is empty
        addWidget({
          type: 'markdown',
          x: 1000,
          y: 720,
          width: 320,
          height: 240,
          title: 'Welcome to Canvas',
          data: { content: '### Hello!\nThis is a spatial workspace. You can drag widgets around, and Bubbles can create new ones for you!' }
        })
      }
    } catch (e) {
      console.error('Failed to load widgets', e)
    }
  }

  // Simulated DB sync / Save to LocalStorage
  const syncToDB = async () => {
    localStorage.setItem('bubbles_canvas_widgets', JSON.stringify(widgets.value))
    // Future: await fetch('/api/widgets/sync', { method: 'POST', body: JSON.stringify(widgets.value) })
  }

  // Watch for changes to auto-sync
  watch(widgets, () => {
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
      const { x, y } = findSafePosition(widget.x, widget.y, widget.width, widget.height)
      
      widgets.value.push({
        ...widget,
        id,
        x,
        y
      })
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

      widgets.value[idx] = { ...widget, ...updates, x: newX, y: newY }
    }
  }

  const removeWidget = (id: string) => {
    widgets.value = widgets.value.filter(w => w.id !== id)
  }

  return {
    widgets,
    init,
    addWidget,
    updateWidget,
    removeWidget,
    findSafePosition
  }
})
