import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const PAID_PLANS = ['pro', 'annual', 'lifetime']
const CODE_EXPIRY_MINUTES = 15

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email requis' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Find user and check active subscription
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true, name: true, plan: true },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Aucun compte trouvé avec cet email', code: 'USER_NOT_FOUND' },
        { status: 404 }
      )
    }

    if (!PAID_PLANS.includes(user.plan)) {
      return NextResponse.json(
        { success: false, error: 'Ce compte n\'a pas d\'abonnement actif. Veuillez d\'abord souscrire à un plan.', code: 'NO_ACTIVE_PLAN' },
        { status: 403 }
      )
    }

    // Generate 6-digit code
    const code = generateCode()
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000)

    // Store code in database
    await db.user.update({
      where: { id: user.id },
      data: {
        resetCode: code,
        resetCodeExpires: expiresAt,
      },
    })

    // TODO: In production, send code via email service (Resend, SendGrid, etc.)
    // For now, the code is returned so the frontend can display it
    // In production, remove `code` from response and send via email only

    return NextResponse.json({
      success: true,
      message: 'Code de vérification envoyé',
      // In production, DO NOT return the code. Send via email instead.
      // For development/testing, we return it here.
      code,
      expiresIn: CODE_EXPIRY_MINUTES,
    })
  } catch (error) {
    console.error('Send reset code error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
