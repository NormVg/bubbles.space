import { readonly, ref, watch } from 'vue'
import { useAppAgent } from './useAppAgent'

interface VoiceStartOptions {
  autoSend?: boolean
}

interface TranscribeResponse {
  transcript: string
  languageCode?: string
}

interface SpeakResponse {
  audio: string
  contentType: string
}

interface PreparedAudio {
  audio: HTMLAudioElement
  url: string
}

const MAX_RECORDING_MS = 29_000
const MAX_TTS_CHUNK_CHARS = 2200

const isListening = ref(false)
const isProcessingVoice = ref(false)
const isSpeaking = ref(false)
const transcript = ref('')
const agentResponse = ref('')
const isAutoSendMode = ref(false)
const voiceSessionActive = ref(false)

let mediaRecorder: MediaRecorder | null = null
let mediaStream: MediaStream | null = null
let activeAudio: HTMLAudioElement | null = null
let recordingChunks: Blob[] = []
let pendingSpeechText = ''
let recordingLimitTimer: ReturnType<typeof setTimeout> | null = null
let playbackGeneration = 0
let responseBridgeStarted = false
let currentSpokenMessageId = ''
let lastSpokenLength = 0
let voiceFlushInProgress = false

function getSupportedMimeType() {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus'
  ]

  return candidates.find(type => MediaRecorder.isTypeSupported(type)) ?? ''
}

function stopPlayback() {
  playbackGeneration += 1

  if (activeAudio) {
    activeAudio.pause()
    activeAudio.src = ''
    activeAudio = null
  }

  isSpeaking.value = false
}

function stopCaptureTracks() {
  mediaStream?.getTracks().forEach(track => track.stop())
  mediaStream = null
}

function resetRecording() {
  if (recordingLimitTimer) {
    clearTimeout(recordingLimitTimer)
    recordingLimitTimer = null
  }

  recordingChunks = []
  mediaRecorder = null
}

function resetSpokenProgress() {
  currentSpokenMessageId = ''
  lastSpokenLength = 0
}

async function transcribeRecording(audioBlob: Blob) {
  const formData = new FormData()
  const extension = audioBlob.type.includes('mp4') ? 'mp4' : audioBlob.type.includes('ogg') ? 'ogg' : 'webm'
  formData.append('audio', audioBlob, `voice.${extension}`)
  formData.append('languageCode', 'en-IN')
  formData.append('mode', 'transcribe')

  return await $fetch<TranscribeResponse>('/api/voice/transcribe', {
    method: 'POST',
    body: formData
  })
}

function splitSpeechText(text: string) {
  const normalizedText = text.replace(/\s+/g, ' ').trim()
  if (!normalizedText) return []

  const chunks: string[] = []
  let currentChunk = ''

  for (const word of normalizedText.split(' ')) {
    if (!currentChunk) {
      currentChunk = word
      continue
    }

    const nextChunk = `${currentChunk} ${word}`
    if (nextChunk.length <= MAX_TTS_CHUNK_CHARS) {
      currentChunk = nextChunk
      continue
    }

    chunks.push(currentChunk)
    currentChunk = word
  }

  if (currentChunk) {
    chunks.push(currentChunk)
  }

  return chunks
}

function base64ToBlob(base64Audio: string, contentType: string) {
  const binary = atob(base64Audio)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new Blob([bytes], { type: contentType })
}

async function requestSpeech(text: string) {
  return await $fetch<SpeakResponse>('/api/voice/speak', {
    method: 'POST',
    body: { text, languageCode: 'en-IN' }
  })
}

async function createLoadedAudio(response: SpeakResponse): Promise<PreparedAudio> {
  const blob = base64ToBlob(response.audio, response.contentType)
  const url = URL.createObjectURL(blob)
  const audio = new Audio(url)
  audio.preload = 'auto'

  try {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup()
        resolve()
      }, 2500)
      const cleanup = () => {
        clearTimeout(timeout)
        audio.removeEventListener('canplaythrough', handleCanPlay)
        audio.removeEventListener('canplay', handleCanPlay)
        audio.removeEventListener('loadeddata', handleCanPlay)
        audio.removeEventListener('error', handleError)
      }
      const handleCanPlay = () => {
        cleanup()
        resolve()
      }
      const handleError = () => {
        cleanup()
        reject(new Error('Unable to load TTS audio.'))
      }

      audio.addEventListener('canplaythrough', handleCanPlay, { once: true })
      audio.addEventListener('canplay', handleCanPlay, { once: true })
      audio.addEventListener('loadeddata', handleCanPlay, { once: true })
      audio.addEventListener('error', handleError, { once: true })
      audio.load()
    })
  } catch (error) {
    URL.revokeObjectURL(url)
    throw error
  }

  return { audio, url }
}

async function playAudioElement(preparedAudio: PreparedAudio, generation: number) {
  if (generation !== playbackGeneration) return

  const { audio, url } = preparedAudio
  activeAudio = audio
  isSpeaking.value = true

  try {
    await new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('error', handleError)
      }
      const handleEnded = () => {
        cleanup()
        resolve()
      }
      const handleError = () => {
        cleanup()
        reject(new Error('TTS audio playback failed.'))
      }

      audio.addEventListener('ended', handleEnded, { once: true })
      audio.addEventListener('error', handleError, { once: true })
      void audio.play().catch((error: unknown) => {
        cleanup()
        reject(error instanceof Error ? error : new Error('TTS audio playback failed.'))
      })
    })
  } finally {
    URL.revokeObjectURL(url)
  }

  if (activeAudio === audio) {
    activeAudio = null
  }
}

async function playSpeechChunks(chunks: string[]) {
  stopPlayback()

  if (chunks.length === 0) return

  const generation = playbackGeneration
  let nextAudioPromise = requestSpeech(chunks[0] ?? '').then(createLoadedAudio)

  try {
    for (let index = 0; index < chunks.length; index += 1) {
      const preparedAudio = await nextAudioPromise
      if (generation !== playbackGeneration) {
        URL.revokeObjectURL(preparedAudio.url)
        return
      }

      const nextChunk = chunks[index + 1]
      if (nextChunk) {
        nextAudioPromise = requestSpeech(nextChunk).then(createLoadedAudio)
      }

      await playAudioElement(preparedAudio, generation)
    }
  } catch (error) {
    console.error('Failed to play TTS audio', error)
  } finally {
    if (generation === playbackGeneration) {
      activeAudio = null
    }
    isSpeaking.value = false
  }
}

function getTextContent(message: { parts: Array<{ type: string, text?: string }> }) {
  return message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text ?? '')
    .join('')
}

export function useVoiceAgent() {
  const eveAgent = useAppAgent()

  function setupVoiceResponseBridge() {
    if (responseBridgeStarted) return
    responseBridgeStarted = true

    watch(() => eveAgent.data.value.messages, (messages) => {
      if (!voiceSessionActive.value || !messages || messages.length === 0) return

      const lastMessage = messages.at(-1)
      if (!lastMessage || lastMessage.role !== 'assistant') return

      if (lastMessage.id !== currentSpokenMessageId) {
        currentSpokenMessageId = lastMessage.id
        lastSpokenLength = 0
      }

      const text = getTextContent(lastMessage)
      if (text.length <= lastSpokenLength) return

      const newText = text.substring(lastSpokenLength)
      lastSpokenLength = text.length
      speak(newText)
    }, { deep: true })

    watch(() => eveAgent.status.value, async (status) => {
      if (status !== 'ready' || !voiceSessionActive.value || voiceFlushInProgress) return

      voiceFlushInProgress = true
      try {
        await flushTTS()
      } finally {
        voiceFlushInProgress = false
        if (voiceSessionActive.value) {
          endVoiceSession()
        }
      }
    })
  }

  setupVoiceResponseBridge()

  async function start(options: VoiceStartOptions = {}) {
    if (isListening.value || isProcessingVoice.value) return

    stopPlayback()
    resetRecording()

    isAutoSendMode.value = !!options.autoSend
    isListening.value = true
    transcript.value = ''
    agentResponse.value = ''
    pendingSpeechText = ''
    resetSpokenProgress()

    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = getSupportedMimeType()
      mediaRecorder = new MediaRecorder(mediaStream, mimeType ? { mimeType } : undefined)

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunks.push(event.data)
        }
      }

      mediaRecorder.start()
      recordingLimitTimer = setTimeout(() => {
        if (isListening.value) {
          void stop()
        }
      }, MAX_RECORDING_MS)
    } catch (error) {
      console.error('Failed to start voice recording', error)
      isListening.value = false
      stopCaptureTracks()
      resetRecording()
      throw error
    }
  }

  async function stop() {
    if (!isListening.value || !mediaRecorder) return

    const recorder = mediaRecorder
    const mimeType = recorder.mimeType || 'audio/webm'

    isListening.value = false
    isProcessingVoice.value = true

    const stopped = new Promise<void>((resolve) => {
      recorder.onstop = () => resolve()
    })

    recorder.stop()
    stopCaptureTracks()
    await stopped

    try {
      const audioBlob = new Blob(recordingChunks, { type: mimeType })
      resetRecording()

      if (audioBlob.size === 0) return

      const result = await transcribeRecording(audioBlob)
      transcript.value = result.transcript.trim()

      if (isAutoSendMode.value && transcript.value) {
        voiceSessionActive.value = true
        await eveAgent.send({ message: transcript.value })
      }
    } catch (error) {
      console.error('Failed to process voice recording', error)
      voiceSessionActive.value = false
      throw error
    } finally {
      isProcessingVoice.value = false
    }
  }

  function speak(text: string) {
    pendingSpeechText += text
    agentResponse.value = pendingSpeechText
  }

  async function flushTTS() {
    const text = pendingSpeechText.trim()
    pendingSpeechText = ''
    agentResponse.value = ''

    if (!text) return

    await playSpeechChunks(splitSpeechText(text))
  }

  function endVoiceSession() {
    voiceSessionActive.value = false
    isAutoSendMode.value = false
    isListening.value = false
    isProcessingVoice.value = false

    if (mediaRecorder?.state === 'recording') {
      mediaRecorder.stop()
    }

    stopCaptureTracks()
    resetRecording()
    stopPlayback()
    pendingSpeechText = ''
    agentResponse.value = ''
    resetSpokenProgress()
  }

  return {
    agentResponse: readonly(agentResponse),
    endVoiceSession,
    flushTTS,
    isAutoSendMode: readonly(isAutoSendMode),
    isListening: readonly(isListening),
    isProcessingVoice: readonly(isProcessingVoice),
    isSpeaking: readonly(isSpeaking),
    speak,
    start,
    stop,
    stopPlayback,
    transcript: readonly(transcript),
    voiceSessionActive: readonly(voiceSessionActive)
  }
}
