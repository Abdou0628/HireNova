/**
 * HireNova — AI Speech (TTS) Generator
 *
 * POST /api/marketing/speech
 *
 * Generates TTS audio from text using the z-ai-web-dev-sdk TTS client.
 * Returns audio/wav stream.
 */

import { NextRequest, NextResponse } from 'next/server'

// ===== Types =====

type CVLanguage = 'fr' | 'en' | 'ar' | 'es'

interface SpeechRequest {
  text: string
  language: CVLanguage
  gender: 'male' | 'female'
}

// ===== Constants =====

const VOICE_NAME_MAP: Record<'male' | 'female', string> = {
  female: 'tongtong',
  male: 'jam',
}

const MAX_TTS_CHARS = 1000

function splitTextIntoChunks(text: string, maxLength = MAX_TTS_CHARS): string[] {
  const chunks: string[] = []
  const sentences = text.match(/[^.!؟?\n]+[.!؟?\n]+/g) || [text]

  let currentChunk = ''
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += sentence
    } else {
      if (currentChunk) chunks.push(currentChunk.trim())
      if (sentence.length > maxLength) {
        const words = sentence.split(' ')
        currentChunk = ''
        for (const word of words) {
          if ((currentChunk + ' ' + word).length > maxLength) {
            if (currentChunk) chunks.push(currentChunk.trim())
            currentChunk = word
          } else {
            currentChunk += (currentChunk ? ' ' : '') + word
          }
        }
      } else {
        currentChunk = sentence
      }
    }
  }
  if (currentChunk.trim()) chunks.push(currentChunk.trim())
  return chunks
}

// ===== Route Handler =====

export async function POST(request: NextRequest) {
  try {
    const body: SpeechRequest = await request.json()
    const { text, language, gender = 'female' } = body

    if (!text || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: text and language' },
        { status: 400 }
      )
    }

    const validLanguages: CVLanguage[] = ['fr', 'en', 'ar', 'es']
    if (!validLanguages.includes(language)) {
      return NextResponse.json(
        { error: `Invalid language: ${language}` },
        { status: 400 }
      )
    }

    const trimmedText = text.trim()
    if (trimmedText.length === 0) {
      return NextResponse.json(
        { error: 'Text cannot be empty' },
        { status: 400 }
      )
    }

    const voiceName = VOICE_NAME_MAP[gender]
    const chunks = splitTextIntoChunks(trimmedText)
    let audioBuffers: Buffer[] = []

    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default
      const zai = await ZAI.create()

      for (const chunk of chunks) {
        const response = await zai.audio.tts.create({
          input: chunk,
          voice: voiceName,
          speed: 1.0,
          response_format: 'wav',
          stream: false,
        })

        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(new Uint8Array(arrayBuffer))
        audioBuffers.push(buffer)
      }
    } catch (ttsError) {
      console.error('[/api/marketing/speech] TTS SDK failed:', ttsError)
      return NextResponse.json(
        { error: 'TTS service unavailable' },
        { status: 500 }
      )
    }

    // Concatenate WAV chunks
    let finalBuffer: Buffer
    if (audioBuffers.length === 1) {
      finalBuffer = audioBuffers[0]
    } else {
      const WAV_HEADER_SIZE = 44
      const header = audioBuffers[0].subarray(0, WAV_HEADER_SIZE)
      const pcmParts = audioBuffers.map((buf) => buf.subarray(WAV_HEADER_SIZE))
      const totalPCMSize = pcmParts.reduce((sum, p) => sum + p.length, 0)

      const updatedHeader = Buffer.from(header)
      updatedHeader.writeUInt32LE(36 + totalPCMSize, 4)
      updatedHeader.writeUInt32LE(totalPCMSize, 40)

      finalBuffer = Buffer.concat([updatedHeader, ...pcmParts])
    }

    return new NextResponse(finalBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': String(finalBuffer.length),
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    console.error('[/api/marketing/speech] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
