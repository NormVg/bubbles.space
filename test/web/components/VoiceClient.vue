<script setup lang="ts">
import { ref, onUnmounted, nextTick } from 'vue'
import { PipecatClient, RTVIEvent } from '@pipecat-ai/client-js'
import { SmallWebRTCTransport } from '@pipecat-ai/small-webrtc-transport'

interface ChatMessage {
  role: 'user' | 'bot'
  text: string
}

const isConnected = ref(false)
const isBotSpeaking = ref(false)
const isUserSpeaking = ref(false)
const error = ref('')
const micEnabled = ref(true)
const messages = ref<ChatMessage[]>([])
const currentBotText = ref('')
let client: PipecatClient | null = null
let audioElement: HTMLAudioElement | null = null

function scrollToBottom() {
  nextTick(() => {
    const el = document.getElementById('chat-log')
    if (el) el.scrollTop = el.scrollHeight
  })
}

async function connect() {
  error.value = ''
  messages.value = []
  currentBotText.value = ''
  
  try {
    const transport = new SmallWebRTCTransport()
    
    client = new PipecatClient({
      transport,
      enableMic: true,
      enableCam: false,
      enableSpeaker: true,
      callbacks: {
        onConnected: () => {
          isConnected.value = true
          micEnabled.value = true
        },
        onDisconnected: () => {
          isConnected.value = false
          micEnabled.value = false
          isBotSpeaking.value = false
          isUserSpeaking.value = false
        },
        onError: (e: any) => {
          error.value = typeof e === 'string' ? e : e?.message || 'Unknown error'
        },
        onTrackStarted: (track: MediaStreamTrack, participant: any) => {
          if (!participant?.local && track.kind === 'audio') {
            if (audioElement) {
              audioElement.pause()
              audioElement.srcObject = null
              audioElement.remove()
            }
            audioElement = document.createElement('audio')
            audioElement.autoplay = true
            audioElement.playsInline = true
            audioElement.srcObject = new MediaStream([track])
            document.body.appendChild(audioElement)
            audioElement.play().catch(() => {})
          }
        },
        onBotStartedSpeaking: () => {
          isBotSpeaking.value = true
        },
        onBotStoppedSpeaking: () => {
          isBotSpeaking.value = false
        },
        onUserStartedSpeaking: () => {
          isUserSpeaking.value = true
        },
        onUserStoppedSpeaking: () => {
          isUserSpeaking.value = false
        },

        // ---- Text events via callbacks (NOT .on()) ----
        onUserTranscript: (data: any) => {
          if (data?.text) {
            messages.value.push({ role: 'user', text: data.text })
            scrollToBottom()
          }
        },
        onBotLlmText: (data: any) => {
          if (data?.text) {
            currentBotText.value += data.text
            scrollToBottom()
          }
        },
        onBotLlmStarted: () => {
          currentBotText.value = ''
        },
        onBotLlmStopped: () => {
          if (currentBotText.value.trim()) {
            messages.value.push({ role: 'bot', text: currentBotText.value.trim() })
            currentBotText.value = ''
            scrollToBottom()
          }
        },
      }
    })

    await client.startBotAndConnect({
      endpoint: 'http://localhost:7860/start',
      requestData: {
        createDailyRoom: false,
        enableDefaultIceServers: true,
        transport: "webrtc"
      }
    })
  } catch (err: any) {
    error.value = err.message || 'Failed to connect to agent'
  }
}

async function disconnect() {
  if (audioElement) {
    audioElement.pause()
    audioElement.srcObject = null
    audioElement.remove()
    audioElement = null
  }
  if (client) {
    await client.disconnect()
    client = null
  }
}

function toggleMic() {
  if (client) {
    const newState = !micEnabled.value
    client.enableMic(newState)
    micEnabled.value = newState
  }
}

onUnmounted(() => {
  disconnect()
})
</script>

<template>
  <div class="voice-client">
    <!-- Pre-connect -->
    <div v-if="!isConnected" class="connect-screen">
      <button @click="connect" class="connect-btn">
        Connect to Pipecat Agent
      </button>
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
    
    <!-- Connected -->
    <div v-else class="session">
      <!-- Status bar -->
      <div class="status-bar">
        <div class="status-dot" :class="{ speaking: isBotSpeaking, listening: isUserSpeaking }"></div>
        <span class="status-text">
          {{ isBotSpeaking ? 'Bot is speaking...' : isUserSpeaking ? 'Listening to you...' : 'Ready' }}
        </span>
        <div class="controls">
          <button @click="toggleMic" class="mic-btn" :class="{ off: !micEnabled }">
            {{ micEnabled ? '🎤' : '🔇' }}
          </button>
          <button @click="disconnect" class="disconnect-btn">✕</button>
        </div>
      </div>

      <!-- Chat log -->
      <div id="chat-log" class="chat-log">
        <div v-if="messages.length === 0 && !currentBotText" class="empty-state">
          Say something to start the conversation...
        </div>
        
        <div 
          v-for="(msg, i) in messages" 
          :key="i" 
          class="message" 
          :class="msg.role"
        >
          <span class="message-label">{{ msg.role === 'user' ? 'You' : 'Bot' }}</span>
          <p class="message-text">{{ msg.text }}</p>
        </div>

        <!-- Streaming bot text -->
        <div v-if="currentBotText" class="message bot streaming">
          <span class="message-label">Bot <span class="streaming-badge">streaming</span></span>
          <p class="message-text">{{ currentBotText }}<span class="cursor">▍</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.voice-client {
  margin-top: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 560px;
}

.connect-screen {
  text-align: center;
  padding: 40px;
}

.connect-btn {
  padding: 14px 32px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.15s;
}
.connect-btn:hover { background: #2563eb; }

.error-text {
  color: #ef4444;
  margin-top: 12px;
  font-size: 14px;
}

.session {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 480px;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
}

.status-dot {
  width: 10px;
  height: 10px;
  background: #10b981;
  border-radius: 50%;
  transition: all 0.2s;
  flex-shrink: 0;
}
.status-dot.speaking {
  background: #f59e0b;
  box-shadow: 0 0 8px #f59e0b88;
  animation: pulse 1s ease-in-out infinite;
}
.status-dot.listening {
  background: #3b82f6;
  box-shadow: 0 0 8px #3b82f688;
  animation: pulse 0.6s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

.status-text {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  flex: 1;
}

.controls {
  display: flex;
  gap: 6px;
}

.mic-btn, .disconnect-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.mic-btn { background: #ecfdf5; }
.mic-btn.off { background: #f3f4f6; }
.mic-btn:hover { background: #d1fae5; }
.disconnect-btn { background: #fef2f2; color: #ef4444; font-weight: 600; }
.disconnect-btn:hover { background: #fee2e2; }

.chat-log {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  color: #9ca3af;
  font-size: 14px;
  text-align: center;
  margin-top: 40px;
}

.message { max-width: 85%; }
.message.user { align-self: flex-end; }
.message.bot { align-self: flex-start; }

.message-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
  display: block;
}
.message.user .message-label { color: #3b82f6; text-align: right; }
.message.bot .message-label { color: #10b981; }

.streaming-badge {
  display: inline-block;
  font-size: 9px;
  background: #d1fae5;
  color: #059669;
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  vertical-align: middle;
}

.message-text {
  margin: 0;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #1f2937;
}
.message.user .message-text {
  background: #eff6ff;
  border-bottom-right-radius: 4px;
}
.message.bot .message-text {
  background: #f0fdf4;
  border-bottom-left-radius: 4px;
}

.cursor {
  animation: blink 0.7s step-end infinite;
  color: #10b981;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
