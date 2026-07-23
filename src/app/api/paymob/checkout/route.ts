import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { createPaymobCheckout, isPaymobConfigured, PAYMOB_PRICES } from '@/lib/paymob'

type PlanType = 'pro' | 'lifetime'

export async function POST(request: NextRequest) {
  try {
    if (!isPaymobConfigured()) {
      return NextResponse.json({ error: 'Paymob is not configured' }, { status: 503 })
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { planType: planTypeParam } = body as { planType?: string }

    const validPlans: PlanType[] = ['pro', 'lifetime']
    if (!planTypeParam || !validPlans.includes(planTypeParam as PlanType)) {
      return NextResponse.json({ error: 'Invalid planType' }, { status: 400 })
    }

    const planType = planTypeParam as PlanType
    const userId = session.user.id

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, plan: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.plan !== 'free') {
      return NextResponse.json({ error: 'You already have an active plan' }, { status: 400 })
    }

    const result = await createPaymobCheckout({
      userId,
      userEmail: user.email,
      userName: user.name || 'User',
      planType,
    })

    // Save Paymob order ID to user
    await db.user.update({
      where: { id: userId },
      data: { paymobOrderId: result.orderId },
    })

    return NextResponse.json({
      url: result.paymentUrl,
      orderId: result.orderId,
      amount: PAYMOB_PRICES[planType],
      currency: 'MAD',
    })
  } catch (error) {
    console.error('Paymob checkout error:', error)
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
