import { ref, readonly } from 'vue'

const isListening = ref(false)
const isSpeaking = ref(false)
const transcript = ref('')
const agentResponse = ref('')

let sttSocket: WebSocket | null = null
let ttsSocket: WebSocket | null = null

let audioCtx: AudioContext | null = null
let mediaStream: MediaStream | null = null
let micNode: MediaStreamAudioSourceNode | null = null
let workletNode: AudioWorkletNode | null = null

let nextPlayTime = 0

export function useVoiceAgent() {

  async function start() {
    if (isListening.value) return
    isListening.value = true
    transcript.value = ''
    agentResponse.value = ''

    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 })
    nextPlayTime = audioCtx.currentTime
    
    // Connect to STT proxy
    const sttUrl = new URL('/ws/stt?lang=en-IN&mode=transcribe', window.location.origin)
    sttUrl.protocol = sttUrl.protocol === 'https:' ? 'wss:' : 'ws:'
    sttSocket = new WebSocket(sttUrl.toString())
    
    sttSocket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === 'data' && msg.data?.transcript) {
          transcript.value = msg.data.transcript
        } else if (msg.type === 'events' && msg.data?.signal_type === 'START_SPEECH') {
          // Barge-in: User started speaking, stop the TTS playback!
          stopPlayback()
        }
      } catch (e) {
        console.error('STT parse error', e)
      }
    }
    
    // Connect to TTS proxy
    const ttsUrl = new URL('/ws/tts', window.location.origin)
    ttsUrl.protocol = ttsUrl.protocol === 'https:' ? 'wss:' : 'ws:'
    ttsSocket = new WebSocket(ttsUrl.toString())
    
    ttsSocket.onopen = () => {
      // Configure TTS for raw PCM so we can queue it instantly in Web Audio API
      ttsSocket?.send(JSON.stringify({
        type: 'config',
        data: {
          speaker: 'shubh',
          target_language_code: 'en-IN',
          output_audio_codec: 'pcm',
          speech_sample_rate: 22050
        }
      }))
    }
    
    ttsSocket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === 'audio' && msg.data?.audio) {
          queuePcmPlayback(msg.data.audio, 22050)
        }
      } catch (e) {
        console.error('TTS parse error', e)
      }
    }

    // Set up microphone capture via AudioWorklet to send raw PCM to STT
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    micNode = audioCtx.createMediaStreamSource(mediaStream)
    
    const workletCode = `
      class PCMProcessor extends AudioWorkletProcessor {
        process(inputs) {
          const input = inputs[0];
          if (input && input.length > 0) {
            const channelData = input[0];
            const pcm16 = new Int16Array(channelData.length);
            for (let i = 0; i < channelData.length; i++) {
              let s = Math.max(-1, Math.min(1, channelData[i]));
              pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            this.port.postMessage(pcm16.buffer, [pcm16.buffer]);
          }
          return true;
        }
      }
      registerProcessor('pcm-processor', PCMProcessor);
    `
    const blob = new Blob([workletCode], { type: 'application/javascript' })
    const workletUrl = URL.createObjectURL(blob)
    
    await audioCtx.audioWorklet.addModule(workletUrl)
    workletNode = new AudioWorkletNode(audioCtx, 'pcm-processor')
    
    workletNode.port.onmessage = (e) => {
      if (sttSocket?.readyState === WebSocket.OPEN) {
        // We must base64 encode the binary buffer because the proxy expects JSON { type: 'audio', audio: 'base64' }
        const bytes = new Uint8Array(e.data)
        let binary = ''
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        const b64 = btoa(binary)
        sttSocket.send(JSON.stringify({
          type: 'audio',
          audio: b64,
          sample_rate: 16000,
          encoding: 'audio/wav' // For PCM, sometimes 'audio/pcm' or 'pcm_s16le' is better, we'll see
        }))
      }
    }
    
    micNode.connect(workletNode)
    workletNode.connect(audioCtx.destination) // Required for worklet to run in some browsers, but we don't want feedback. 
    // Wait, connecting to destination causes mic echo. We should NOT connect to destination.
    // Instead we can use a GainNode with 0 gain.
    const silentGain = audioCtx.createGain()
    silentGain.gain.value = 0
    workletNode.connect(silentGain)
    silentGain.connect(audioCtx.destination)
  }

  function queuePcmPlayback(base64Audio: string, sampleRate: number) {
    if (!audioCtx) return
    isSpeaking.value = true
    
    const binaryStr = atob(base64Audio)
    const len = binaryStr.length
    // pcm is 16-bit
    const pcm16 = new Int16Array(len / 2)
    for (let i = 0; i < pcm16.length; i++) {
      const l = binaryStr.charCodeAt(i * 2)
      const h = binaryStr.charCodeAt(i * 2 + 1)
      // little endian
      let val = l + (h << 8)
      if (val >= 0x8000) val -= 0x10000
      pcm16[i] = val
    }
    
    const float32 = new Float32Array(pcm16.length)
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7FFF)
    }
    
    const audioBuffer = audioCtx.createBuffer(1, float32.length, sampleRate)
    audioBuffer.getChannelData(0).set(float32)
    
    const source = audioCtx.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioCtx.destination)
    
    const startTime = Math.max(audioCtx.currentTime, nextPlayTime)
    source.start(startTime)
    nextPlayTime = startTime + audioBuffer.duration
    
    source.onended = () => {
      if (audioCtx && audioCtx.currentTime >= nextPlayTime - 0.1) {
        isSpeaking.value = false
      }
    }
  }

  function stopPlayback() {
    if (audioCtx) {
      // Suspend and resume clears scheduled buffers, or we can just recreate context
      nextPlayTime = audioCtx.currentTime
      isSpeaking.value = false
    }
  }

  function speak(text: string) {
    if (ttsSocket?.readyState === WebSocket.OPEN) {
      ttsSocket.send(JSON.stringify({ type: 'text', text }))
    }
  }

  function stop() {
    isListening.value = false
    isSpeaking.value = false
    
    mediaStream?.getTracks().forEach(t => t.stop())
    sttSocket?.close()
    ttsSocket?.close()
    audioCtx?.close()
    
    sttSocket = null
    ttsSocket = null
    audioCtx = null
  }

  return {
    isListening: readonly(isListening),
    isSpeaking: readonly(isSpeaking),
    transcript: readonly(transcript),
    agentResponse: readonly(agentResponse),
    start,
    speak,
    stop,
    stopPlayback
  }
}
