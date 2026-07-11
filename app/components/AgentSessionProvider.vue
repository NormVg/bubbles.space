<script setup lang="ts">
import { onBeforeUnmount, watch, computed } from 'vue'
import { useEveAgent } from 'eve/vue'
import { setActiveAppAgent } from '../composables/useAppAgent'
import { useConversationStore } from '../stores/conversations'
import { useWidgetStore } from '../stores/widgets'
import { authClient } from '~/utils/auth-client'

const conversationStore = useConversationStore()
const conversationId = conversationStore.activeConversationId
const widgetStore = useWidgetStore()

const agent = useEveAgent({
  initialEvents: conversationStore.activeConversationEvents as any,
  initialSession: conversationStore.activeDetail?.session as any,
  toolHandlers: {
    canvas_read_widget: async ({ id }: { id: string }) => {
      const widget = widgetStore.widgets.find(w => w.id === id)
      if (!widget) return `Widget with ID ${id} not found on canvas.`
      
      let textContent = ''
      if (widget.type === 'markdown') {
        textContent = widget.data.content || ''
      } else if (widget.type === 'mermaid') {
        textContent = `\`\`\`mermaid\n${widget.data.chart || ''}\n\`\`\``
      } else if (widget.type === 'image') {
        textContent = `[Image: ${widget.data.url}]`
      } else if (widget.type === 'video') {
        textContent = `[Video: ${widget.data.url}]`
      } else if (widget.type === 'pdf') {
        textContent = `[PDF: ${widget.data.url}]`
      } else if (widget.type === 'website') {
        textContent = `[Website Embed: ${widget.data.url}]`
      } else if (widget.type === 'code') {
        textContent = `\`\`\`${widget.data.language}\n${widget.data.code}\n\`\`\``
      } else {
         textContent = JSON.stringify(widget.data)
      }
      
      return `Widget "${widget.title || widget.type}" (${widget.id}):\n${textContent}`
    },
    canvas_add_widget: async (args: any) => {
      const widgetId = crypto.randomUUID()
      // Center the new widget by default unless coordinates are given
      const defaultWidth = 300
      const defaultHeight = 200
      const startX = 2560 / 2 - defaultWidth / 2
      const startY = 1440 / 2 - defaultHeight / 2
      
      const newWidget = {
        id: widgetId,
        type: args.type,
        title: args.title || `New ${args.type} widget`,
        x: args.x ?? startX,
        y: args.y ?? startY,
        width: args.width ?? defaultWidth,
        height: args.height ?? defaultHeight,
        zIndex: widgetStore.widgets.length + 1,
        data: args.data || {},
      }
      
      widgetStore.addWidget(newWidget as any)
      return `Successfully created ${args.type} widget "${newWidget.title}" with ID ${widgetId}.`
    },
    canvas_update_widget: async (args: any) => {
      const { id, ...updates } = args
      const widget = widgetStore.widgets.find(w => w.id === id)
      if (!widget) return `Widget with ID ${id} not found.`
      
      widgetStore.updateWidget(id, updates)
      return `Successfully updated widget "${widget.title || widget.type}" (${id}).`
    },
    canvas_delete_widget: async ({ id }: { id: string }) => {
      widgetStore.removeWidget(id)
      return `Successfully removed widget ${id}.`
    },
    canvas_list_widgets: async () => {
      if (widgetStore.widgets.length === 0) {
        return "The canvas is currently empty."
      }
      
      const summary = widgetStore.widgets.map(w => 
        `- ${w.title || 'Untitled'} (${w.type}) [ID: ${w.id}] at x:${Math.round(w.x)}, y:${Math.round(w.y)}`
      ).join('\n')
      
      return `Current widgets on canvas:\n${summary}`
    },
    system_read_knowledge: async ({ topic }: { topic: string }) => {
       const { data } = await useFetch<{ data: any[] }>('/api/memory/search', {
          query: { query: topic, limit: 3 }
       })
       if (!data.value || data.value.data.length === 0) {
          return `No knowledge found for topic: ${topic}`
       }
       return data.value.data.map(m => `Source: ${m.title || m.path}\nContent: ${m.content}`).join('\n\n')
    },
    system_read_all_knowledge: async () => {
      return `To read all knowledge, use the search tool with specific queries, or the user can view the memory tree directly.`
    },
    system_store_knowledge: async (args: any) => {
      const { data } = await useFetch('/api/memory', {
         method: 'POST',
         body: {
            title: args.title,
            path: args.path,
            content: args.content,
            type: args.type || 'semantic',
            metadata: args.metadata || {}
         }
      })
      if (!data.value) return `Failed to store knowledge.`
      return `Successfully stored knowledge at ${args.path}`
    },
    update_user_settings: async ({ systemPrompt, aboutMe, name }: { systemPrompt?: string; aboutMe?: string; name?: string }) => {
      try {
        const payload: Record<string, string> = {}
        if (systemPrompt !== undefined) payload.systemPrompt = systemPrompt
        if (aboutMe !== undefined) payload.aboutMe = aboutMe
        if (name !== undefined) payload.name = name
        
        await $fetch('/api/user/settings', {
          method: 'POST',
          body: payload
        })
        
        // Refresh the session so the UI picks up new values
        await authClient.getSession({ fetchOptions: { query: { disableCookieCache: true } } })
        
        const updated: string[] = []
        if (systemPrompt !== undefined) updated.push('Soul (System Prompt)')
        if (aboutMe !== undefined) updated.push('About Me')
        if (name !== undefined) updated.push('Name')
        return `Successfully updated: ${updated.join(', ')}. The changes are saved and will take effect immediately.`
      } catch (error) {
        return `Failed to update user settings. Please try again.`
      }
    }
  } as any,
  onSessionChange(session: any) {
    if (conversationId) {
      void conversationStore.updateSession(conversationId, session)
    }
  }
} as any)

const unregister = setActiveAppAgent(agent)

let throttleTimeout: any = null
let lastRun = 0

const runSnapshotUpdate = () => {
  if (!conversationId) return
  void conversationStore.updateFromAgentSnapshot(conversationId, {
    events: agent.events.value,
    messages: agent.data.value.messages,
    session: agent.session.value
  })
}

watch(
  [() => agent.events.value.length, () => agent.data.value.messages.length, agent.session],
  () => {
    const now = Date.now()
    if (now - lastRun > 500) {
      lastRun = now
      runSnapshotUpdate()
    } else {
      if (throttleTimeout) clearTimeout(throttleTimeout)
      throttleTimeout = setTimeout(() => {
        lastRun = Date.now()
        runSnapshotUpdate()
      }, 500)
    }
  },
  { deep: true }
)

onBeforeUnmount(() => {
  if (throttleTimeout) clearTimeout(throttleTimeout)
  runSnapshotUpdate()
  if (conversationId) {
    conversationStore.flushSync(conversationId)
  }
  unregister()
})
</script>

<template>
  <span class="agent-session-provider" aria-hidden="true" />
</template>

<style scoped>
.agent-session-provider {
  display: none;
}
</style>
