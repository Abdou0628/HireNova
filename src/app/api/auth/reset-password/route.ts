import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { db } from '@/lib/db'

const PAID_PLANS = ['pro', 'annual', 'lifetime']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, newPassword } = body

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Email et nouveau mot de passe sont requis' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

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
        { success: false, error: 'Seuls les abonnés avec un plan actif peuvent réinitialiser leur mot de passe. Veuillez d\'abord souscrire à un abonnement.', code: 'NO_ACTIVE_PLAN' },
        { status: 403 }
      )
    }

    const hashedPassword = await hash(newPassword, 12)

    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      success: true,
      message: 'Mot de passe mis à jour avec succès',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// GET: verify if email exists and has an active plan (for pre-validation)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email requis' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

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
        { success: false, error: 'Compte trouvé mais sans abonnement actif. Veuillez d\'abord souscrire à un abonnement.', code: 'NO_ACTIVE_PLAN' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      name: user.name,
      plan: user.plan,
    })
  } catch (error) {
    console.error('Verify email error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
