import { NextRequest, NextResponse } from 'next/server'
import { ZAI } from 'z-ai-web-dev-sdk'

const zai = ZAI.create()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, mode = 'advisor', conversationHistory = [] } = body

    const systemPrompt = mode === 'advisor'
      ? `Tu es un conseiller de carrière expert pour HireNova, une plateforme IA de création de CV et lettres de motivation. Tu aides les utilisateurs à optimiser leur profil, choisir les bons templates, et répondre aux questions sur les fonctionnalités. Réponds en français de manière professionnelle et bienveillante.`
      : `Tu es un support technique expert pour HireNova. Tu résous les problèmes techniques, questions de facturation, et bugs. Réponds en français de manière claire et concise. Si le problème nécessite une escalade, informe l'utilisateur qu'un ticket a été créé.`

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.slice(-10).map((m: any) => ({ role: m.role as string, content: m.content })),
      { role: 'user' as const, content: message }
    ]

    const res = await zai.chat.completions.create({
      model: 'deepseek-chat',
      messages,
      temperature: 0.7,
      max_tokens: 500
    })

    const response = res.choices?.[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.'
    return NextResponse.json({ success: true, response })
  } catch (error) {
    return NextResponse.json({ success: false, error: { code: 500, message: 'Erreur chatbot' } }, { status: 500 })
  }
}
