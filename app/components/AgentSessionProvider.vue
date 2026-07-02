<script setup lang="ts">
import { onBeforeUnmount, watch, computed } from 'vue'
import { useEveAgent } from 'eve/vue'
import { setActiveAppAgent } from '../composables/useAppAgent'
import { useConversationStore } from '../stores/conversations'
import { useWidgetStore } from '../stores/widgets'

const conversationStore = useConversationStore()
const conversationId = computed(() => conversationStore.activeConversationId)
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
    }
  },
  onSessionChange(session) {
    if (conversationId.value) {
      void conversationStore.updateSession(conversationId.value, session)
    }
  }
})

const unregister = setActiveAppAgent(agent)

watch(
  [() => agent.events.value.length, () => agent.data.value.messages.length, agent.session],
  () => {
    if (!conversationId.value) return

    void conversationStore.updateFromAgentSnapshot(conversationId.value, {
      events: agent.events.value,
      messages: agent.data.value.messages,
      session: agent.session.value
    })
  },
  { deep: true }
)

onBeforeUnmount(unregister)
</script>

<template>
  <span class="agent-session-provider" aria-hidden="true" />
</template>

<style scoped>
.agent-session-provider {
  display: none;
}
</style>
