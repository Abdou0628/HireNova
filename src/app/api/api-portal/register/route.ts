import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateApiKey, generateApiSecret, hashSecret } from '@/lib/api-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, industry, website, phone, plan } = body
    if (!name || !email || !company) return NextResponse.json({ success: false, error: { code: 400, message: 'name, email, company requis' } }, { status: 400 })

    const existing = await db.apiSubscriber.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ success: false, error: { code: 409, message: 'Email déjà enregistré' } }, { status: 409 })

    const apiKey = generateApiKey()
    const apiSecret = generateApiSecret()
    const creditsLimit = plan === 'enterprise' ? 999999 : plan === 'business' ? 500 : 100

    await db.apiSubscriber.create({
      data: { name, email, company, industry, website, phone, apiKey, apiSecretHash: hashSecret(apiSecret), plan: plan || 'starter', creditsLimit }
    })

    return NextResponse.json({ success: true, data: { apiKey, apiSecret } })
  } catch (error) {
    return NextResponse.json({ success: false, error: { code: 500, message: 'Erreur serveur' } }, { status: 500 })
  }
}
