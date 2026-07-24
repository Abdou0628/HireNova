import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js'

lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY || '',
  onError: (error) => {
    console.error('LemonSqueezy SDK Error:', error)
  },
})

type Currency = 'eur' | 'usd' | 'gbp'

// Supported countries organized by region
export const SUPPORTED_REGIONS = {
  europe: {
    label: 'Europe',
    flags: ['🇫🇷', '🇧🇪', '🇨🇭', '🇱🇺', '🇲🇨', '🇪🇸'],
    countries: ['France', 'Belgique', 'Suisse', 'Luxembourg', 'Monaco', 'Espagne'],
    currency: 'eur' as Currency,
  },
  americas: {
    label: 'Amériques',
    flags: ['🇺🇸', '🇨🇦'],
    countries: ['États-Unis', 'Canada'],
    currency: 'usd' as Currency,
  },
  oceania: {
    label: 'Océanie',
    flags: ['🇦🇺'],
    countries: ['Australie'],
    currency: 'usd' as Currency,
  },
  gcc: {
    label: 'Golf (GCC)',
    flags: ['🇸🇦', '🇦🇪', '🇶🇦', '🇰🇼', '🇧🇭', '🇴🇲'],
    countries: ['Arabie Saoudite', 'Émirats Arabes Unis', 'Qatar', 'Koweït', 'Bahreïn', 'Oman'],
    currency: 'usd' as Currency,
  },
}

// Variant IDs per currency - replace with real ones after creating products in LemonSqueezy Dashboard
// Create 3 products in LemonSqueezy: Pro (EUR), Pro (USD), Pro (GBP)
// + Annual (EUR), Annual (USD), Annual (GBP)
export const VARIANTS: Record<Currency, Record<string, string>> = {
  eur: {
    pro: process.env.LS_PRO_VARIANT_ID_EUR || 'variant_pro_eur',
    annual: process.env.LS_ANNUAL_VARIANT_ID_EUR || 'variant_annual_eur',
  },
  usd: {
    pro: process.env.LS_PRO_VARIANT_ID_USD || 'variant_pro_usd',
    annual: process.env.LS_ANNUAL_VARIANT_ID_USD || 'variant_annual_usd',
  },
  gbp: {
    pro: process.env.LS_PRO_VARIANT_ID_GBP || 'variant_pro_gbp',
    annual: process.env.LS_ANNUAL_VARIANT_ID_GBP || 'variant_annual_gbp',
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

// Price display per currency
export const PRICES: Record<Currency, { pro: string; annual: string; proPeriod: string; annualPeriod: string }> = {
  eur: { pro: '6,99€', annual: '70€', proPeriod: '/mois', annualPeriod: '/an' },
  usd: { pro: '$7.99', annual: '$79', proPeriod: '/month', annualPeriod: '/year' },
  gbp: { pro: '£5.99', annual: '£59', proPeriod: '/month', annualPeriod: '/year' },
}
