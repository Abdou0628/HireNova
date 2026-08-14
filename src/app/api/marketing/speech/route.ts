/**
 * HireNova — AI Speech (TTS) Generator
 *
 * POST /api/marketing/speech
 *
 * Generates TTS audio from text using the z-ai-web-dev-sdk TTS client.
 * Returns an audio/mpeg (MP3) stream.
 */

import { NextRequest, NextResponse } from 'next/server'
import { TTS } from 'z-ai-web-dev-sdk'
import { CVLanguage } from '@/lib/i18n'

// ===== Types =====

interface SpeechRequest {
  text: string
  language: CVLanguage
  gender: 'male' | 'female'
}

// ===== Constants =====

/** Maps app language codes to TTS speech locale codes */
const SPEECH_CODE_MAP: Record<CVLanguage, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  ar: 'ar-SA',
  es: 'es-ES',
}

/** Maps gender to TTS voice names */
const VOICE_NAME_MAP: Record<'male' | 'female', string> = {
  female: 'alloy',
  male: 'onyx',
}

// ===== Route Handler =====

export async function POST(request: NextRequest) {
  try {
    const body: SpeechRequest = await request.json()
    const { text, language, gender = 'female' } = body

    // Validate required fields
    if (!text || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: text and language are required' },
        { status: 400 }
      )
    }

    // Validate language
    const validLanguages: CVLanguage[] = ['fr', 'en', 'ar', 'es']
    if (!validLanguages.includes(language)) {
      return NextResponse.json(
        { error: `Invalid language. Must be one of: ${validLanguages.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate gender
    const validGenders: Array<'male' | 'female'> = ['male', 'female']
    if (!validGenders.includes(gender)) {
      return NextResponse.json(
        { error: 'Invalid gender. Must be one of: male, female' },
        { status: 400 }
      )
    }

    // Trim and validate text length
    const trimmedText = text.trim()
    if (trimmedText.length === 0) {
      return NextResponse.json(
        { error: 'Text cannot be empty' },
        { status: 400 }
      )
    }

    if (trimmedText.length > 5000) {
      return NextResponse.json(
        { error: 'Text too long. Maximum 5000 characters allowed.' },
        { status: 400 }
      )
    }

    const speechCode = SPEECH_CODE_MAP[language]
    const voiceName = VOICE_NAME_MAP[gender]

    let audioBuffer: Buffer

    try {
      // Use the z-ai-web-dev-sdk TTS client
      const tts = new TTS()
      const result = await tts.generate({
        text: trimmedText,
        lang: speechCode,
        voice: voiceName,
      })

      audioBuffer = Buffer.from(result)
    } catch (ttsError) {
      console.error('[/api/marketing/speech] TTS SDK failed, trying fallback:', ttsError)

      // Fallback: attempt to use a simple system TTS via child_process if available
      try {
        const { execSync } = await import('child_process')
        const escapedText = trimmedText.replace(/'/g, "'\\''")

        // Try espeak-ng (common on Linux) as a last-resort fallback
        const tmpFile = `/tmp/hirenova-tts-${Date.now()}.mp3`
        execSync(
          `espeak-ng -v ${speechCode} -w ${tmpFile} '${escapedText}' 2>/dev/null || ` +
          `espeak -v ${speechCode} -w ${tmpFile} '${escapedText}' 2>/dev/null || true`,
          { timeout: 15000 }
        )

        const { readFileSync, existsSync, unlinkSync } = await import('fs')

        if (existsSync(tmpFile)) {
          audioBuffer = readFileSync(tmpFile)
          unlinkSync(tmpFile).catch(() => {}) // Cleanup temp file
        } else {
          throw new Error('Fallback TTS (espeak) not available on this system')
        }
      } catch (fallbackError) {
        console.error('[/api/marketing/speech] Fallback TTS also failed:', fallbackError)
        return NextResponse.json(
          { error: 'Failed to generate speech audio. Both primary SDK and fallback are unavailable.' },
          { status: 500 }
        )
      }
    }

    // Return the audio buffer as MP3
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audioBuffer.length),
        'Cache-Control': 'public, max-age=86400', // Cache for 24h
      },
    })
  } catch (error) {
    console.error('[/api/marketing/speech] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error while generating speech audio' },
      { status: 500 }
    )
  }
}
