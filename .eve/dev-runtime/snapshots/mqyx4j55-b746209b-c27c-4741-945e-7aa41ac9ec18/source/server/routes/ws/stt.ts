import { defineWebSocketHandler } from 'h3'
import { SarvamAIClient } from 'sarvamai'

const activeSockets = new Map<string, any>()

export default defineWebSocketHandler({
  async open(peer) {
    console.log('Client connected to STT proxy:', peer.id)
    
    const url = new URL(peer.url, 'http://localhost')
    const lang = url.searchParams.get('lang') || 'en-IN'
    const mode = url.searchParams.get('mode') || 'transcribe'
    
    const apiKey = process.env.SARVAM_API_KEY
    if (!apiKey) {
      console.error('SARVAM_API_KEY is not set')
      peer.send(JSON.stringify({ type: 'error', data: 'Missing SARVAM_API_KEY' }))
      peer.close()
      return
    }

    const client = new SarvamAIClient({
      apiSubscriptionKey: apiKey
    })
    
    try {
      const sarvamSocket = await client.speechToTextStreaming.connect({
        model: 'saaras:v3',
        mode: mode as any,
        'language-code': lang,
        high_vad_sensitivity: 'true',
        vad_signals: 'true'
      })
      
      sarvamSocket.on('open', () => {
        console.log('Connected to Sarvam STT')
        peer.send(JSON.stringify({ type: 'status', data: 'connected' }))
      })
      
      sarvamSocket.on('message', (message: any) => {
        peer.send(JSON.stringify(message))
      })
      
      sarvamSocket.on('error', (err: any) => {
        console.error('Sarvam STT Error:', err)
        peer.send(JSON.stringify({ type: 'error', data: err }))
      })
      
      sarvamSocket.on('close', () => {
        console.log('Sarvam STT closed')
        peer.close()
      })
      
      await sarvamSocket.waitForOpen()
      activeSockets.set(peer.id, sarvamSocket)
      
    } catch (err) {
      console.error('Failed to connect to Sarvam:', err)
      peer.send(JSON.stringify({ type: 'error', data: 'Failed to connect to Sarvam upstream' }))
      peer.close()
    }
  },
  
  message(peer, message) {
    const sarvamSocket = activeSockets.get(peer.id)
    if (!sarvamSocket) return
    
    try {
      const data = JSON.parse(message.text())
      if (data.type === 'audio') {
        sarvamSocket.transcribe({
          audio: data.audio,
          sample_rate: data.sample_rate || 16000,
          encoding: data.encoding || 'audio/wav'
        })
      } else if (data.type === 'flush' && typeof sarvamSocket.flush === 'function') {
        sarvamSocket.flush()
      }
    } catch (e) {
      console.error('Invalid message from peer', e)
    }
  },
  
  close(peer) {
    const sarvamSocket = activeSockets.get(peer.id)
    if (sarvamSocket) {
      try {
        sarvamSocket.close()
      } catch (e) {}
      activeSockets.delete(peer.id)
    }
    console.log('Client disconnected from STT proxy:', peer.id)
  }
})
