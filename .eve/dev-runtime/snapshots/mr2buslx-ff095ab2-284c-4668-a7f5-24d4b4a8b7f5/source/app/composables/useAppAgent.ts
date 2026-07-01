import { computed, shallowRef, type ComputedRef } from 'vue'
import type { EveMessageData, UseEveAgentReturn, UseEveAgentStatus } from 'eve/vue'
import type { HandleMessageStreamEvent, SendTurnPayload, SessionState } from 'eve/client'

type AppAgent = UseEveAgentReturn<EveMessageData>

const emptyData: EveMessageData = Object.freeze({
  messages: Object.freeze([])
})

const emptyEvents: readonly HandleMessageStreamEvent[] = Object.freeze([])
const emptySession: SessionState = Object.freeze({ streamIndex: 0 })
const activeAgent = shallowRef<AppAgent | null>(null)

function getActiveAgent() {
  return activeAgent.value
}

export function setActiveAppAgent(agent: AppAgent) {
  activeAgent.value = agent

  return () => {
    if (activeAgent.value === agent) {
      activeAgent.value = null
    }
  }
}

export function useAppAgent() {
  const data: ComputedRef<EveMessageData> = computed(() => getActiveAgent()?.data.value ?? emptyData)
  const status: ComputedRef<UseEveAgentStatus> = computed(() => getActiveAgent()?.status.value ?? 'ready')
  const error: ComputedRef<Error | undefined> = computed(() => getActiveAgent()?.error.value)
  const events: ComputedRef<readonly HandleMessageStreamEvent[]> = computed(() => getActiveAgent()?.events.value ?? emptyEvents)
  const session: ComputedRef<SessionState> = computed(() => getActiveAgent()?.session.value ?? emptySession)

  async function send<TOutput = unknown>(input: SendTurnPayload<TOutput>) {
    const agent = getActiveAgent()
    if (!agent) {
      throw new Error('Agent session is not ready.')
    }

    await agent.send(input)
  }

  function stop() {
    getActiveAgent()?.stop()
  }

  function reset() {
    getActiveAgent()?.reset()
  }

  return {
    data,
    error,
    events,
    reset,
    send,
    session,
    status,
    stop
  }
}
