import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import type Stripe from 'stripe'

// Disable Next.js default body parsing — we need the raw body for signature verification
export const runtime = 'nodejs'

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const planType = session.metadata?.planType

  if (!userId) {
    console.error('checkout.session.completed: missing userId in metadata')
    return
  }

  const plan = planType === 'lifetime' ? 'lifetime' : 'pro'
  const priceId = session.line_items?.data?.[0]?.price?.id || null

  // For subscriptions, grab the subscription ID
  const subscriptionId =
    session.mode === 'subscription' && typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id || null

  await db.user.update({
    where: { id: userId },
    data: {
      plan,
      stripeCustomerId: session.customer as string | null,
      stripePriceId: priceId,
      stripeSubId: subscriptionId,
    },
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    // Fallback: look up user by stripeCustomerId
    const customerId = subscription.customer as string
    const user = await db.user.findFirst({
      where: { stripeCustomerId: customerId },
    })
    if (!user) {
      console.error('customer.subscription.updated: no user found for customer', customerId)
      return
    }
    const plan = subscription.status === 'active' ? 'pro' : 'free'
    await db.user.update({
      where: { id: user.id },
      data: { plan },
    })
    return
  }

  const plan = subscription.status === 'active' ? 'pro' : 'free'
  await db.user.update({
    where: { id: userId },
    data: { plan },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    const customerId = subscription.customer as string
    const user = await db.user.findFirst({
      where: { stripeCustomerId: customerId },
    })
    if (!user) {
      console.error('customer.subscription.deleted: no user found for customer', customerId)
      return
    }
    await db.user.update({
      where: { id: user.id },
      data: { plan: 'free', stripeSubId: null },
    })
    return
  }

  await db.user.update({
    where: { id: userId },
    data: { plan: 'free', stripeSubId: null },
  })
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // Log the failed payment — could trigger notifications in the future
  const customerId = invoice.customer as string
  console.warn(`Invoice payment failed for customer ${customerId}, invoice ${invoice.id}`)
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('Missing stripe-signature header')
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        // Unhandled event type — still return 200
        console.log(`Unhandled webhook event type: ${event.type}`)
    }
  } catch (error) {
    console.error(`Error processing webhook ${event.type}:`, error)
    // Still return 200 to prevent Stripe from retrying
  }

  return NextResponse.json({ received: true }, { status: 200 })
}