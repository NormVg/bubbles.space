<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { useEveAgent } from 'eve/vue'
import { setActiveAppAgent } from '../composables/useAppAgent'
import { useConversationStore } from '../stores/conversations'

const conversationStore = useConversationStore()
const conversation = conversationStore.ensureConversation()
const conversationId = conversation?.id ?? ''

const agent = useEveAgent({
  initialEvents: conversation?.events ?? [],
  initialSession: conversation?.session,
  onSessionChange(session) {
    if (conversationId) {
      conversationStore.updateSession(conversationId, session)
    }
  }
})

const unregister = setActiveAppAgent(agent)

watch(
  [agent.events, agent.session, () => agent.data.value.messages],
  () => {
    if (!conversationId) return

    conversationStore.updateFromAgentSnapshot(conversationId, {
      events: agent.events.value,
      messages: agent.data.value.messages,
      session: agent.session.value
    })
  },
  { deep: true, immediate: true }
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
