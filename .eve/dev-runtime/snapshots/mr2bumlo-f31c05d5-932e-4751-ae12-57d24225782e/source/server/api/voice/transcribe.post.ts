import { createError, defineEventHandler, readMultipartFormData } from 'h3'
import { SarvamAIClient, type SarvamAI } from 'sarvamai'

declare const process: {
  env: Record<string, string | undefined>
}

const MAX_AUDIO_BYTES = 25 * 1024 * 1024
const STT_LANGUAGES = new Set<SarvamAI.SpeechToTextLanguage>([
  'unknown',
  'hi-IN',
  'bn-IN',
  'kn-IN',
  'ml-IN',
  'mr-IN',
  'od-IN',
  'pa-IN',
  'ta-IN',
  'te-IN',
  'en-IN',
  'gu-IN',
  'as-IN',
  'ur-IN',
  'ne-IN',
  'kok-IN',
  'ks-IN',
  'sd-IN',
  'sa-IN',
  'sat-IN',
  'mni-IN',
  'brx-IN',
  'mai-IN',
  'doi-IN'
])
const STT_MODES = new Set<SarvamAI.Mode>(['transcribe', 'translate', 'verbatim', 'translit', 'codemix'])

function getStringField(form: Awaited<ReturnType<typeof readMultipartFormData>>, name: string) {
  return form?.find(part => part.name === name && !part.filename)?.data.toString('utf8')
}

function getLanguageCode(value?: string): SarvamAI.SpeechToTextLanguage {
  return STT_LANGUAGES.has(value as SarvamAI.SpeechToTextLanguage)
    ? value as SarvamAI.SpeechToTextLanguage
    : 'en-IN'
}

function getMode(value?: string): SarvamAI.Mode {
  return STT_MODES.has(value as SarvamAI.Mode)
    ? value as SarvamAI.Mode
    : 'transcribe'
}

function normalizeAudioContentType(value?: string) {
  if (!value) return 'audio/webm'

  return value.split(';')[0]?.trim() || 'audio/webm'
}

export default defineEventHandler(async (event) => {
  const apiKey = process.env.SARVAM_API_KEY
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'SARVAM_API_KEY is not configured.'
    })
  }

  const form = await readMultipartFormData(event)
  const audioPart = form?.find(part => part.name === 'audio' && part.filename)

  if (!audioPart?.data?.length) {
    throw createError({
      statusCode: 400,
      message: 'Audio file is required.'
    })
  }

  if (audioPart.data.length > MAX_AUDIO_BYTES) {
    throw createError({
      statusCode: 413,
      message: 'Audio file is too large.'
    })
  }

  const languageCode = getLanguageCode(getStringField(form, 'languageCode'))
  const mode = getMode(getStringField(form, 'mode'))
  const client = new SarvamAIClient({ apiSubscriptionKey: apiKey })

  try {
    const response = await client.speechToText.transcribe({
      file: {
        data: audioPart.data,
        filename: audioPart.filename || 'voice.webm',
        contentType: normalizeAudioContentType(audioPart.type),
        contentLength: audioPart.data.length
      },
      language_code: languageCode,
      mode,
      model: 'saaras:v3'
    })

    return {
      transcript: response.transcript,
      languageCode: response.language_code
    }
  } catch (error) {
    console.error('Sarvam one-shot STT failed', error)
    throw createError({
      statusCode: 502,
      message: 'Unable to transcribe audio.'
    })
  }
})
