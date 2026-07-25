import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createHmac } from 'crypto'

function signatureCheck(body: string, secret: string, signature: string): boolean {
  const hmac = createHmac('sha256', secret)
  hmac.update(body)
  return hmac.digest('hex') === signature
}

export const runtime = 'nodejs'

interface LemonSqueezyWebhookBody {
  meta: {
    event_name: string
    custom_data: {
      userId?: string
      planType?: string
      currency?: string
    }
  }
  data: {
    id: string
    type: string
    attributes: {
      status: string
      user_email: string
      user_name: string
      customer_id: number
      order_id?: number
      product_id: number
      variant_id: number
      first_order_item: {
        id: number
        variant_id: number
      }
      subscription_id?: number
      ends_at?: string | null
      renews_at?: string | null
      trial_ends_at?: string | null
      created_at: string
      updated_at: string
    }
  }
}

async function handleOrderCreated(body: LemonSqueezyWebhookBody) {
  const userId = body.meta.custom_data?.userId
  const planType = body.meta.custom_data?.planType
  const customerId = body.data.attributes.customer_id?.toString()
  const variantId = body.data.attributes.variant_id?.toString()

  if (!userId) {
    console.error('order_created: missing userId in custom_data')
    return
  }

  // Order created can be for one-time (lifetime) or first subscription payment
  const plan = planType === 'lifetime' ? 'lifetime' : 'pro'

  await db.user.update({
    where: { id: userId },
    data: {
      plan,
      lsCustomerId: customerId || undefined,
      lsVariantId: variantId || undefined,
    },
  })
}

async function handleSubscriptionCreated(body: LemonSqueezyWebhookBody) {
  const userId = body.meta.custom_data?.userId
  const planType = body.meta.custom_data?.planType
  const customerId = body.data.attributes.customer_id?.toString()
  const subId = body.data.attributes.subscription_id?.toString()
  const variantId = body.data.attributes.first_order_item?.variant_id?.toString()

  if (!userId) {
    console.error('subscription_created: missing userId in custom_data')
    return
  }

  const plan = planType === 'lifetime' ? 'lifetime' : 'pro'

  await db.user.update({
    where: { id: userId },
    data: {
      plan,
      lsCustomerId: customerId || undefined,
      lsVariantId: variantId || undefined,
      lsSubId: subId || undefined,
    },
  })
}

async function handleSubscriptionUpdated(body: LemonSqueezyWebhookBody) {
  const customerId = body.data.attributes.customer_id?.toString()
  const subId = body.data.attributes.subscription_id?.toString()
  const status = body.data.attributes.status

  if (!customerId) return

  // Find user by LemonSqueezy customer ID
  const user = await db.user.findFirst({
    where: { lsCustomerId: customerId },
  })

  if (!user) {
    console.error('subscription_updated: no user found for customer', customerId)
    return
  }

  // LemonSqueezy subscription statuses: active, paused, cancelled, expired, unpaid
  const plan = status === 'active' ? 'pro' : 'free'

  await db.user.update({
    where: { id: user.id },
    data: {
      plan,
      lsSubId: subId || undefined,
    },
  })
}

async function handleSubscriptionCancelledOrExpired(body: LemonSqueezyWebhookBody) {
  const customerId = body.data.attributes.customer_id?.toString()

  if (!customerId) return

  const user = await db.user.findFirst({
    where: { lsCustomerId: customerId },
  })

  if (!user) {
    console.error(`${body.meta.event_name}: no user found for customer`, customerId)
    return
  }

  // Downgrade to free, but keep lifetime if they had it
  if (user.plan === 'lifetime') return

  await db.user.update({
    where: { id: user.id },
    data: { plan: 'free', lsSubId: null },
  })
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-signature')

  if (!signature) {
    console.error('Missing x-signature header')
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  if (!secret) {
    console.error('LEMONSQUEEZY_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  // Verify webhook signature
  const isValid = signatureCheck(body, secret, signature)
  if (!isValid) {
    console.error('Webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let parsedBody: LemonSqueezyWebhookBody
  try {
    parsedBody = JSON.parse(body)
  } catch {
    console.error('Failed to parse webhook body')
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventName = parsedBody.meta.event_name

  try {
    switch (eventName) {
      case 'order_created':
        await handleOrderCreated(parsedBody)
        break

      case 'subscription_created':
        await handleSubscriptionCreated(parsedBody)
        break

      case 'subscription_updated':
        await handleSubscriptionUpdated(parsedBody)
        break

      case 'subscription_cancelled':
      case 'subscription_expired':
        await handleSubscriptionCancelledOrExpired(parsedBody)
        break

      default:
        console.log(`Unhandled webhook event: ${eventName}`)
    }
  } catch (error) {
    console.error(`Error processing webhook ${eventName}:`, error)
    // Still return 200 to prevent retries
  }

  return NextResponse.json({ received: true }, { status: 200 })
}