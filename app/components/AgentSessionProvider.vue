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
      } else {
        textContent = JSON.stringify(widget.data)
      }
      
      return `Content of ${widget.title || widget.type} (ID: ${id}):\n\n${textContent}`
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
  },
  onSessionChange(session) {
    if (conversationId) {
      void conversationStore.updateSession(conversationId, session)
    }
  }
})

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
