import { type Ref } from 'vue'
import { authClient } from '~/utils/auth-client'

export const useChatSubmit = (
  agent: any,
  optimisticUserMessage: Ref<string>,
  isFetchingMemory: Ref<boolean>,
  activeContexts: Ref<any[]>,
  scrollToBottom: (force?: boolean) => void
) => {
  const appStore = useAppStore()
  const widgetStore = useWidgetStore()
  const chatStore = useChatStore()

  const handleSubmit = async (text: string) => {
    let finalMessage = text
    
    optimisticUserMessage.value = text
    isFetchingMemory.value = true
    setTimeout(() => scrollToBottom(true), 50)
    
    // Format hidden system context
    const timeContext = `Local Time: ${new Date().toLocaleString()}`
    const locContext = appStore.location 
      ? `Location: ${appStore.location.city || 'Unknown City'}, ${appStore.location.region || 'Unknown Region'} (Lat: ${appStore.location.latitude}, Lon: ${appStore.location.longitude})` 
      : 'Location: Unknown'

    // Inject user's Soul and Identity with a fresh fetch to ensure reliability
    const { data: sessionData } = await authClient.getSession()
    
    // Fetch semantic memory (RAG)
    let semanticCtx = '';
    try {
      const memRes = await fetch(`/api/memory/semantic-search?q=${encodeURIComponent(text)}`);
      if (memRes.ok) {
        const memories = await memRes.json();
        if (memories && memories.length > 0) {
          semanticCtx = `Semantic Memory Context (Pre-fetched):\n${memories.map((m: any) => `[${m.path}]\nTitle: ${m.title}\n${m.content}`).join('\n\n')}`;
        }
      }
    } catch (err) {
      console.error('Failed to fetch semantic memory:', err);
    }

    isFetchingMemory.value = false

    // @ts-ignore - better-auth extended fields
    const soulCtx = sessionData?.user?.systemPrompt 
      // @ts-ignore
      ? `User's Custom Instructions (The Soul):\n${sessionData.user.systemPrompt}` 
      : ''
    // @ts-ignore
    const identityCtx = sessionData?.user?.aboutMe 
      // @ts-ignore
      ? `About The User (user.md):\n${sessionData.user.aboutMe}` 
      : ''

    const widgetsCtx = widgetStore.widgets.length > 0 
      ? `Canvas Widgets:\n${JSON.stringify(widgetStore.widgets.map(w => ({ id: w.id, type: w.type, x: Math.round(w.x), y: Math.round(w.y), title: w.title })))}` 
      : 'Canvas Widgets: None'

    const systemParts = [
      timeContext, 
      locContext, 
      widgetsCtx, 
      soulCtx, 
      identityCtx,
      semanticCtx,
      `System Info (Hidden): UserID="${sessionData?.user?.id || ''}"`
    ].filter(Boolean)
      
    const systemBlock = `<system_context>\n${systemParts.join('\n')}\n</system_context>`
    
    const consumedWidgets = chatStore.consumeWidgetContexts()
    
    if (activeContexts.value.length > 0 || consumedWidgets.length > 0) {
      // Format message contexts
      const msgContextPrefix = activeContexts.value.map(ctx => {
        return `> ${ctx.text.split('\n').join('\n> ')}`
      }).join('\n\n')
      
      // Format widget contexts
      const widgetContextPrefix = consumedWidgets.map(wCtx => {
        return `[Widget: ${wCtx.label}]\n${wCtx.text}\n[/Widget]`
      }).join('\n\n')
      
      const allContexts = [msgContextPrefix, widgetContextPrefix].filter(Boolean).join('\n\n')
      
      finalMessage = `${systemBlock}\n\n${allContexts}\n\n${text}`
      activeContexts.value = [] // clear after sending
    } else {
      finalMessage = `${systemBlock}\n\n${text}`
    }
    
    optimisticUserMessage.value = '' // Clear right before sending
    setTimeout(() => scrollToBottom(true), 50)
    
    try {
      await agent.send({ message: finalMessage })
      
      // If agent enters error state immediately (eve framework catches internal errors), restore message
      if (agent.status?.value === 'error') {
        optimisticUserMessage.value = text
      }
    } catch (err: any) {
      console.error('Failed to send message:', err)
      optimisticUserMessage.value = text

      // If the agent framework got permanently stuck from a previous cancelled request, force it to remount
      if (err?.message?.includes('already processing a turn')) {
        conversationStore.forceReloadAgent()
      }
    }
  }

  return { handleSubmit }
}
