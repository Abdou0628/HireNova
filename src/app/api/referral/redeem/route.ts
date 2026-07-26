import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 401, message: 'Authentification requise' } },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const body = await req.json()
    const { referralCode } = body

    if (!referralCode) {
      return NextResponse.json(
        { success: false, error: { code: 400, message: 'Code de parrainage requis' } },
        { status: 400 }
      )
    }

    const referral = await db.referral.findFirst({
      where: {
        referralCode,
        referredEmail: session.user.email?.toLowerCase(),
        status: 'PENDING',
      },
    })

    if (!referral) {
      return NextResponse.json(
        { success: false, error: { code: 404, message: 'Aucun parrainage en attente trouvé' } },
        { status: 404 }
      )
    }

    if (referral.referredUserId) {
      return NextResponse.json(
        { success: false, error: { code: 409, message: 'Ce parrainage a déjà été activé' } },
        { status: 409 }
      )
    }

    await db.$transaction([
      db.referral.update({
        where: { id: referral.id },
        data: {
          referredUserId: userId,
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      }),
      db.user.update({
        where: { id: referral.referrerId },
        data: { plan: 'pro' },
      }),
    ])

    await db.referral.update({
      where: { id: referral.id },
      data: { status: 'REWARDED' },
    })

    return NextResponse.json({
      success: true,
      data: { message: 'Récompense accordée : 1 mois gratuit Pro !' },
    })
  } catch (error) {
    console.error('[Referral Redeem Error]', error)
    return NextResponse.json(
      { success: false, error: { code: 500, message: 'Erreur interne du serveur' } },
      { status: 500 }
    )
  }
}
