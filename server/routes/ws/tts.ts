import { defineWebSocketHandler } from 'h3'
import { SarvamAIClient } from 'sarvamai'

const activeTtsSockets = new Map<string, any>()

export default defineWebSocketHandler({
  async open(peer) {
    console.log('Client connected to TTS proxy:', peer.id)
    
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
      const sarvamSocket = await client.textToSpeechStreaming.connect({
        model: 'bulbul:v3',
        send_completion_event: true
      })
      
      sarvamSocket.on('open', () => {
        console.log('Connected to Sarvam TTS')
        peer.send(JSON.stringify({ type: 'status', data: 'connected' }))
      })
      
      sarvamSocket.on('message', (message: any) => {
        if (message.type === 'audio') {
           console.log(`[TTS] Received audio chunk from Sarvam, forwarding...`)
        } else {
           console.log(`[TTS] Received message from Sarvam:`, message.type)
        }
        peer.send(JSON.stringify(message))
      })
      
      sarvamSocket.on('error', (err: any) => {
        console.error('Sarvam TTS Error:', err)
        peer.send(JSON.stringify({ type: 'error', data: err }))
      })
      
      sarvamSocket.on('close', () => {
        console.log('Sarvam TTS closed')
        peer.close()
      })
      
      await sarvamSocket.waitForOpen()
      activeTtsSockets.set(peer.id, sarvamSocket)
      
    } catch (err) {
      console.error('Failed to connect to Sarvam TTS:', err)
      peer.send(JSON.stringify({ type: 'error', data: 'Failed to connect to Sarvam upstream' }))
      peer.close()
    }
  },
  
  message(peer, message) {
    const sarvamSocket = activeTtsSockets.get(peer.id)
    if (!sarvamSocket) return
    
    try {
      const data = JSON.parse(message.text())
      if (data.type === 'ping') {
        if (typeof sarvamSocket.ping === 'function') sarvamSocket.ping()
        return
      }
      
      if (data.type === 'config') {
        sarvamSocket.configureConnection({
          type: 'config',
          data: data.data // { speaker: 'shubh', target_language_code: 'hi-IN' }
        })
      } else if (data.type === 'text') {
        console.log(`[TTS] Sending text to Sarvam:`, data.text)
        sarvamSocket.convert(data.text)
      } else if (data.type === 'flush') {
        console.log(`[TTS] Flushing Sarvam buffer`)
        // Handle optional flush logic
        if (typeof sarvamSocket.flush === 'function') {
          sarvamSocket.flush()
        }
      }
    } catch (e: any) {
      if (e.message && e.message.includes('Socket is not open')) {
        // Socket closed prematurely, client will reconnect
      } else {
        console.error('Invalid TTS message from peer', e)
      }
    }
  },
  
  close(peer) {
    const sarvamSocket = activeTtsSockets.get(peer.id)
    if (sarvamSocket) {
      try {
        sarvamSocket.close()
      } catch (e) {}
      activeTtsSockets.delete(peer.id)
    }
    console.log('Client disconnected from TTS proxy:', peer.id)
  }
})
