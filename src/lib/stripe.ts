import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
})

type Currency = 'eur' | 'usd'

// Price IDs per currency - replace with real ones after creating products in Stripe Dashboard
export const PRICES: Record<Currency, Record<string, string>> = {
  eur: {
    pro: process.env.STRIPE_PRO_PRICE_ID_EUR || 'price_pro_eur',
    lifetime: process.env.STRIPE_LIFETIME_PRICE_ID_EUR || 'price_lifetime_eur',
  },
  usd: {
    pro: process.env.STRIPE_PRO_PRICE_ID_USD || 'price_pro_usd',
    lifetime: process.env.STRIPE_LIFETIME_PRICE_ID_USD || 'price_lifetime_usd',
  },
}

export function getPlans(currency: Currency = 'eur') {
  return {
    pro: { name: 'Pro', priceId: PRICES[currency].pro, type: 'recurring' as const, currency },
    lifetime: { name: 'Lifetime', priceId: PRICES[currency].lifetime, type: 'one_time' as const, currency },
  }
}

// Default plans (EUR)
export const PLANS = getPlans('eur')