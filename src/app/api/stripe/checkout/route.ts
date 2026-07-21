import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { stripe, getPlans } from '@/lib/stripe'
import type { Stripe } from 'stripe'

type PlanType = 'pro' | 'lifetime'
type Currency = 'eur' | 'usd'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { planType, currency: currencyParam } = body as { planType?: string; currency?: string }

    const validPlans: PlanType[] = ['pro', 'lifetime']
    if (!planType || !validPlans.includes(planType as PlanType)) {
      return NextResponse.json(
        { error: `Invalid planType. Must be one of: ${validPlans.join(', ')}` },
        { status: 400 }
      )
    }

    const currency: Currency = currencyParam === 'usd' ? 'usd' : 'eur'
    const plans = getPlans(currency)
    const plan = plans[planType as PlanType]
    const userId = session.user.id

    // Fetch user from DB to check for existing Stripe customer
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true, email: true, name: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let customerId = user.stripeCustomerId

    // Create or retrieve Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId },
      })
      customerId = customer.id

      // Store the Stripe customer ID
      await db.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      })
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    const checkoutParams: Stripe.Checkout.SessionCreateParams = {
      mode: plan.type === 'recurring' ? 'subscription' : 'payment',
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: `${baseUrl}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?canceled=true`,
      customer: customerId,
      metadata: { userId, planType, currency },
      allow_promotion_codes: true,
      payment_method_types: ['card'],
      // Set currency for the session
      currency,
    }

    // Add subscription-specific config
    if (plan.type === 'recurring') {
      checkoutParams.subscription_data = {
        metadata: { userId, currency },
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutParams)

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)

    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred'

    // Handle Stripe-specific validation errors
    if (message.includes('price') || message.includes('Invalid')) {
      return NextResponse.json({ error: message }, { status: 400 })
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}