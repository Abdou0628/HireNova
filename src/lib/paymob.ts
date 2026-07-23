const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY || ''
const PAYMOB_INTEGRATION_ID = parseInt(process.env.PAYMOB_INTEGRATION_ID || '0', 10)
const PAYMOB_IFRAME_ID = parseInt(process.env.PAYMOB_IFRAME_ID || '0', 10)
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET || ''

const PAYMOB_BASE_URL = 'https://accept.paymob.com/api'

type PlanType = 'pro' | 'lifetime'

// Prices in MAD (Moroccan Dirham)
export const PAYMOB_PRICES: Record<PlanType, number> = {
  pro: 70,       // ~6.99 EUR equivalent
  lifetime: 300, // ~29.99 EUR equivalent
}

export const PAYMOB_CURRENCY = 'EGP' // Paymob processes in EGP internally for Africa

interface PaymobTokenResponse {
  token: string
}

interface PaymobOrderResponse {
  id: number
}

interface PaymobPaymentKeyResponse {
  token: string
}

async function getAuthToken(): Promise<string> {
  const res = await fetch(`${PAYMOB_BASE_URL}/auth/tokens/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
  })
  const data: PaymobTokenResponse = await res.json()
  if (!data.token) throw new Error('Paymob auth failed')
  return data.token
}

async function createOrder(token: string, amountCents: number, merchantOrderId: string): Promise<number> {
  const res = await fetch(`${PAYMOB_BASE_URL}/ecommerce/orders/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: token,
      delivery_needed: false,
      amount_cents: amountCents * 100, // Paymob expects cents
      currency: PAYMOB_CURRENCY,
      merchant_order_id: merchantOrderId,
    }),
  })
  const data: PaymobOrderResponse = await res.json()
  if (!data.id) throw new Error('Paymob order creation failed')
  return data.id
}

async function getPaymentKey(
  token: string,
  orderId: number,
  amountCents: number,
  userEmail: string,
  userName: string,
  userId: string,
  planType: string
): Promise<string> {
  const res = await fetch(`${PAYMOB_BASE_URL}/acceptance/payment_keys/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: token,
      amount_cents: amountCents * 100,
      expiration: 3600, // 1 hour
      order_id: orderId,
      billing_data: {
        apartment: 'NA',
        email: userEmail,
        floor: 'NA',
        first_name: userName.split(' ')[0] || 'User',
        street: 'NA',
        building: 'NA',
        phone_number: 'NA',
        shipping_method: 'NA',
        postal_code: 'NA',
        city: 'NA',
        country: 'MA',
        last_name: userName.split(' ').slice(1).join(' ') || '',
        state: 'NA',
      },
      currency: PAYMOB_CURRENCY,
      integration_id: PAYMOB_INTEGRATION_ID,
      lock_order_when_paid: true,
    }),
  })
  const data: PaymobPaymentKeyResponse = await res.json()
  if (!data.token) throw new Error('Paymob payment key creation failed')
  return data.token
}

export async function createPaymobCheckout(params: {
  userId: string
  userEmail: string
  userName: string
  planType: PlanType
}): Promise<{ paymentUrl: string; orderId: string }> {
  const { userId, userEmail, userName, planType } = params
  const amount = PAYMOB_PRICES[planType]
  const merchantOrderId = `cvg-${userId}-${Date.now()}`

  const token = await getAuthToken()
  const orderId = await createOrder(token, amount, merchantOrderId)
  const paymentKey = await getPaymentKey(token, orderId, amount, userEmail, userName, userId, planType)

  const paymentUrl = `${PAYMOB_BASE_URL}/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`

  return {
    paymentUrl,
    orderId: orderId.toString(),
  }
}

// HMAC verification for webhook
import { createHmac } from 'crypto'

export function verifyPaymobWebhook(payload: Record<string, unknown>): boolean {
  if (!PAYMOB_HMAC_SECRET) return false

  // Paymob sends an object with `type` and `obj`
  const obj = payload.obj as Record<string, unknown> | undefined
  if (!obj) return false

  try {
    const concatenated = `
    ${obj.amount_cents}
    ${obj.created_at}
    ${obj.currency}
    ${obj.error_occured}
    ${obj.has_parent_transaction}
    ${obj.id}
    ${obj.integration_id}
    ${obj.is_3d_secure}
    ${obj.is_auth}
    ${obj.is_capture}
    ${obj.is_refunded}
    ${obj.is_standalone_payment}
    ${obj.is_voided}
    ${obj.order?.id}
    ${obj.owner}
    ${obj.pending}
    ${obj.source_data?.pan}
    ${obj.source_data?.sub_type}
    ${obj.source_data?.type}
    ${obj.success}
    ${obj.transaction?.id}`.trim()

    const hmac = createHmac('sha512', PAYMOB_HMAC_SECRET)
      .update(concatenated)
      .digest('hex')

    const receivedHmac = payload.hmac as string
    return hmac === receivedHmac
  } catch {
    return false
  }
}

export function isPaymobConfigured(): boolean {
  return !!(PAYMOB_API_KEY && PAYMOB_INTEGRATION_ID && PAYMOB_IFRAME_ID)
}
