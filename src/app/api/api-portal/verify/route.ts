import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { apiKey } = body
    if (!apiKey) return NextResponse.json({ success: false, error: { code: 400, message: 'apiKey requis' } }, { status: 400 })

    const subscriber = await db.apiSubscriber.findUnique({ where: { apiKey }, select: { id: true, name: true, plan: true, status: true, creditsUsed: true, creditsLimit: true } })
    if (!subscriber) return NextResponse.json({ success: false, error: { code: 401, message: 'Clé invalide' } }, { status: 401 })

    return NextResponse.json({ success: true, data: subscriber })
  } catch {
    return NextResponse.json({ success: false, error: { code: 500, message: 'Erreur' } }, { status: 500 })
  }
}
