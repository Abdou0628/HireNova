import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 401, message: 'Authentification requise' } },
        { status: 401 }
      )
    }

    const userId = session.user.id

    const [total, completed, rewarded, pending, recentReferrals] = await Promise.all([
      db.referral.count({ where: { referrerId: userId } }),
      db.referral.count({ where: { referrerId: userId, status: { in: ['COMPLETED', 'REWARDED'] } } }),
      db.referral.count({ where: { referrerId: userId, status: 'REWARDED' } }),
      db.referral.count({ where: { referrerId: userId, status: 'PENDING' } }),
      db.referral.findMany({
        where: { referrerId: userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          referredEmail: true,
          status: true,
          rewardType: true,
          rewardValue: true,
          createdAt: true,
          completedAt: true,
        },
      }),
    ])

    const freeMonthsEarned = rewarded // Each reward = 1 free month

    return NextResponse.json({
      success: true,
      data: {
        totalReferrals: total,
        completedReferrals: completed,
        rewardedReferrals: rewarded,
        pendingReferrals: pending,
        freeMonthsEarned,
        recentReferrals,
      },
    })
  } catch (error) {
    console.error('[Referral Stats Error]', error)
    return NextResponse.json(
      { success: false, error: { code: 500, message: 'Erreur interne du serveur' } },
      { status: 500 }
    )
  }
}
