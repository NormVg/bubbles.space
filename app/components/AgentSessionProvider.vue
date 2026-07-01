<script setup lang="ts">
import { onBeforeUnmount, watch, computed } from 'vue'
import { useEveAgent } from 'eve/vue'
import { setActiveAppAgent } from '../composables/useAppAgent'
import { useConversationStore } from '../stores/conversations'

const conversationStore = useConversationStore()
const conversationId = computed(() => conversationStore.activeConversationId)

const agent = useEveAgent({
  initialEvents: conversationStore.activeConversationEvents as any,
  initialSession: conversationStore.activeDetail?.session as any,
  onSessionChange(session) {
    if (conversationId.value) {
      void conversationStore.updateSession(conversationId.value, session)
    }
  }
})

const unregister = setActiveAppAgent(agent)

watch(
  [agent.events, agent.session, () => agent.data.value.messages],
  () => {
    if (!conversationId.value) return

    void conversationStore.updateFromAgentSnapshot(conversationId.value, {
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
