import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

export interface WidgetContext {
  id: string
  label: string
  text: string
}

export const useChatStore = defineStore('chat', () => {
  const emotion = ref('normal')
  const pendingWidgetContexts = shallowRef<WidgetContext[]>([])
  
  function setEmotion(newEmotion: string) {
    emotion.value = newEmotion
  }

  function addWidgetContext(ctx: WidgetContext) {
    // Prevent duplicates
    if (pendingWidgetContexts.value.some(c => c.id === ctx.id)) return
    pendingWidgetContexts.value.push(ctx)
  }

  function removeWidgetContext(id: string) {
    pendingWidgetContexts.value = pendingWidgetContexts.value.filter(c => c.id !== id)
  }

  function consumeWidgetContexts(): WidgetContext[] {
    const contexts = [...pendingWidgetContexts.value]
    pendingWidgetContexts.value = []
    return contexts
  }

  return { 
    emotion, 
    setEmotion, 
    pendingWidgetContexts,
    addWidgetContext,
    removeWidgetContext,
    consumeWidgetContexts
  }
})
