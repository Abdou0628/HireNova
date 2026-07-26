import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getPlans, STORE_ID, type PlanType as LSPlanType } from '@/lib/lemonsqueezy'
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js'

type Currency = 'eur' | 'usd' | 'gbp'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { planType, currency: currencyParam } = body as { planType?: string; currency?: string }

    const validPlans: LSPlanType[] = ['starter', 'pro', 'career_plus', 'employer', 'annual']
    if (!planType || !validPlans.includes(planType as LSPlanType)) {
      return NextResponse.json(
        { error: `Invalid planType. Must be one of: ${validPlans.join(', ')}` },
        { status: 400 }
      )
    }

    const currency: Currency = ['eur', 'usd', 'gbp'].includes(currencyParam) ? currencyParam : 'eur'
    const plans = getPlans(currency)
    const plan = plans[planType as LSPlanType]
    const userId = session.user.id

    // Check if LemonSqueezy is properly configured
    if (!STORE_ID || STORE_ID === '' || plan.variantId.startsWith('variant_')) {
      return NextResponse.json({
        error: 'Les paiements seront bientôt disponibles. Nous préparons les abonnements pour votre région.',
        code: 'PAYMENT_NOT_READY'
      }, { status: 503 })
    }

    // Fetch user from DB
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, lsCustomerId: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    // Create LemonSqueezy checkout
    const { data, error } = await createCheckout({
      storeId: STORE_ID,
      variantId: plan.variantId,
      checkoutData: {
        email: user.email,
        name: user.name || undefined,
        custom: {
          userId,
          planType,
          currency,
        },
      },
      checkoutOptions: {
        redirectUrl: `${baseUrl}/?checkout=success`,
        cancelUrl: `${baseUrl}/?checkout=canceled`,
        embed: false,
        media: false,
        logo: true,
        desc: true,
        discount: true,
        dark: false,
        subscriptionPreview: true,
      },
      productOptions: {
        enabledVariants: [plan.variantId],
        isSubscription: plan.type === 'recurring',
      },
    })

    if (error) {
      console.error('LemonSqueezy checkout error:', error)
      return NextResponse.json({ error: error.message || 'Failed to create checkout' }, { status: 500 })
    }

    const checkoutUrl = data?.data?.attributes?.url

    if (!checkoutUrl) {
      return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 })
    }

    // Update user with LemonSqueezy customer ID if available
    const customerId = data?.data?.attributes?.customer_id?.toString()
    if (customerId) {
      await db.user.update({
        where: { id: userId },
        data: { lsCustomerId: customerId },
      })
    }

    return NextResponse.json({
      checkoutId: data?.data?.id,
      url: checkoutUrl,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
