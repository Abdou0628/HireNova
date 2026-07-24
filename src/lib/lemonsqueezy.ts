import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js'

lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY || '',
  onError: (error) => {
    console.error('LemonSqueezy SDK Error:', error)
  },
})

type Currency = 'eur' | 'usd'

// Variant IDs per currency - replace with real ones after creating products in LemonSqueezy Dashboard
export const VARIANTS: Record<Currency, Record<string, string>> = {
  eur: {
    pro: process.env.LS_PRO_VARIANT_ID_EUR || 'variant_pro_eur',
    annual: process.env.LS_ANNUAL_VARIANT_ID_EUR || 'variant_annual_eur',
  },
  usd: {
    pro: process.env.LS_PRO_VARIANT_ID_USD || 'variant_pro_usd',
    annual: process.env.LS_ANNUAL_VARIANT_ID_USD || 'variant_annual_usd',
  },
}

export function getPlans(currency: Currency = 'eur') {
  return {
    pro: { name: 'Pro', variantId: VARIANTS[currency].pro, type: 'recurring' as const, currency },
    annual: { name: 'Annual', variantId: VARIANTS[currency].annual, type: 'recurring' as const, currency },
  }
}

// Store ID from LemonSqueezy Dashboard
export const STORE_ID = process.env.LS_STORE_ID || ''
