import { createError, defineEventHandler, readBody } from 'h3'
import { SarvamAIClient, type SarvamAI } from 'sarvamai'

declare const process: {
  env: Record<string, string | undefined>
}

interface SpeakBody {
  languageCode?: string
  text?: string
}

const MAX_TTS_CHARS = 2500
const TTS_LANGUAGES = new Set<SarvamAI.TextToSpeechLanguage>([
  'bn-IN',
  'en-IN',
  'gu-IN',
  'hi-IN',
  'kn-IN',
  'ml-IN',
  'mr-IN',
  'od-IN',
  'pa-IN',
  'ta-IN',
  'te-IN'
])

function getLanguageCode(value?: string): SarvamAI.TextToSpeechLanguage {
  return TTS_LANGUAGES.has(value as SarvamAI.TextToSpeechLanguage)
    ? value as SarvamAI.TextToSpeechLanguage
    : 'en-IN'
}

export default defineEventHandler(async (event) => {
  const apiKey = process.env.SARVAM_API_KEY
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'SARVAM_API_KEY is not configured.'
    })
  }

  const body = await readBody<SpeakBody>(event)
  const text = body.text?.trim()

  if (!text) {
    throw createError({
      statusCode: 400,
      message: 'Text is required.'
    })
  }

  if (text.length > MAX_TTS_CHARS) {
    throw createError({
      statusCode: 413,
      message: 'Text is too long for speech synthesis.'
    })
  }

  const client = new SarvamAIClient({ apiSubscriptionKey: apiKey })
  const languageCode = getLanguageCode(body.languageCode)

  try {
    const response = await client.textToSpeech.convert({
      text,
      target_language_code: languageCode,
      speaker: 'shubh',
      model: 'bulbul:v3',
      output_audio_codec: 'wav',
      speech_sample_rate: 24000,
      pace: 1
    })

    const audio = response.audios[0]
    if (!audio) {
      throw new Error('Sarvam returned no audio.')
    }

    return {
      audio,
      contentType: 'audio/wav'
    }
  } catch (error) {
    console.error('Sarvam one-shot TTS failed', error)
    throw createError({
      statusCode: 502,
      message: 'Unable to synthesize speech.'
    })
  }
})
