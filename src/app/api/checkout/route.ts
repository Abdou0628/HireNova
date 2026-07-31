import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { isStripeConfigured, type Currency, type HireNovaPlan, PLAN_PRICES } from '@/lib/stripe'
import { isPaymobConfigured, PAYMOB_PRICES, type PaymobPlan, type PaymobBillingData } from '@/lib/paymob'
import { STORE_ID, VARIANTS, getPlans, type PlanType as LSPlanType } from '@/lib/lemonsqueezy'
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js'

/**
 * Unified Checkout API — Routes to the appropriate payment provider.
 *
 * Provider Priority (EUR/USD/GBP): Stripe → LemonSqueezy → Dev Payment
 * MAD Payments: PayMob (Morocco) → Dev Payment
 *
 * Returns:
 * - `{ url }` → redirect to payment provider
 * - `{ code: 'DEV_PAYMENT', data: {...} }` → dev payment simulator result
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    const body = await request.json()
    const { planType: planTypeParam, currency: currencyParam, provider: providerParam, billingData: clientBilling } = body as {
      planType?: string
      currency?: string
      provider?: string
      billingData?: {
        firstName?: string
        lastName?: string
        email?: string
        phoneNumber?: string
        city?: string
        state?: string
        country?: string
        postalCode?: string
        street?: string
        building?: string
        apartment?: string
        floor?: string
      }
    }

    // Validate plan
    const validPlans: HireNovaPlan[] = ['starter', 'pro', 'career_plus', 'employer', 'annual']
    if (!planTypeParam || !validPlans.includes(planTypeParam as HireNovaPlan)) {
      return NextResponse.json(
        { error: `Plan invalide: ${validPlans.join(', ')}` },
        { status: 400 }
      )
    }

    const planType = planTypeParam as HireNovaPlan
    const currency = (['eur', 'usd', 'gbp', 'mad'].includes(currencyParam) ? currencyParam : 'eur') as Currency
    const userId = session.user.id

    // Fetch user and their most recent resume for billing info
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, name: true, plan: true,
        stripeCustomerId: true, lsCustomerId: true,
        resumes: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { phone: true, location: true, fullName: true, email: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Check if user already has a paid plan
    if (user.plan !== 'free') {
      return NextResponse.json({ error: 'Vous avez déjà un abonnement actif.', code: 'ALREADY_SUBSCRIBED' }, { status: 400 })
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    // ════════════════════════════════════════════════════════
    // ─── MAD → PayMob (Morocco) ──────────────────────────
    // ════════════════════════════════════════════════════════
    if (currency === 'mad') {
      if (isPaymobConfigured()) {
        const { createPaymobCheckout } = await import('@/lib/paymob')
        const pmPlan = planType as PaymobPlan

        // Build billing data from: client body > user's latest resume > user profile > safe defaults
        const latestResume = user.resumes?.[0]
        const billingData: PaymobBillingData = {
          firstName: clientBilling?.firstName || latestResume?.fullName?.split(' ')[0] || user.name?.split(' ')[0] || undefined,
          lastName: clientBilling?.lastName || latestResume?.fullName?.split(' ').slice(1).join(' ') || user.name?.split(' ').slice(1).join(' ') || undefined,
          email: clientBilling?.email || latestResume?.email || user.email || undefined,
          phoneNumber: clientBilling?.phoneNumber || latestResume?.phone || undefined,
          city: clientBilling?.city || latestResume?.location || undefined,
          state: clientBilling?.state || undefined,
          country: clientBilling?.country || undefined,
          postalCode: clientBilling?.postalCode || undefined,
          street: clientBilling?.street || undefined,
          building: clientBilling?.building || undefined,
          apartment: clientBilling?.apartment || undefined,
          floor: clientBilling?.floor || undefined,
        }

        const result = await createPaymobCheckout({
          userId,
          userEmail: user.email,
          userName: user.name || 'User',
          planType: pmPlan,
          billingData,
        })

        await db.user.update({
          where: { id: userId },
          data: { paymobOrderId: result.orderId },
        })

        return NextResponse.json({
          url: result.paymentUrl,
          orderId: result.orderId,
          provider: 'paymob',
          plan: pmPlan,
          amount: PAYMOB_PRICES[pmPlan],
          currency: 'MAD',
        })
      }
      // PayMob not configured → fall through to dev payment simulator
      console.log(`[checkout] PayMob not configured for MAD, using dev payment simulator for ${planType}`)
    }

    // ════════════════════════════════════════════════════════
    // ─── EUR/USD/GBP → Stripe or LemonSqueezy ─────────────
    // ════════════════════════════════════════════════════════
    // Priority: explicit provider > Stripe > LemonSqueezy > dev-payment
    const providers: { name: string; available: boolean }[] = []

    if (providerParam === 'stripe' || (!providerParam && isStripeConfigured())) {
      providers.push({ name: 'stripe', available: isStripeConfigured() })
    }
    if (providerParam === 'lemonsqueezy' || (!providerParam && STORE_ID && !STORE_ID.startsWith('variant_'))) {
      providers.push({ name: 'lemonsqueezy', available: !!(STORE_ID && !STORE_ID.startsWith('variant_')) })
    }

    // Try each available provider
    for (const p of providers) {
      if (!p.available) continue

      if (p.name === 'stripe') {
        try {
          const { stripe, STRIPE_PRICE_IDS } = await import('@/lib/stripe')

          let customerId = user.stripeCustomerId
          if (!customerId) {
            const customer = await stripe.customers.create({
              email: user.email,
              name: user.name || undefined,
              metadata: { userId },
            })
            customerId = customer.id
            await db.user.update({
              where: { id: userId },
              data: { stripeCustomerId: customerId },
            })
          }

          const priceId = STRIPE_PRICE_IDS[currency]?.[planType]
          if (!priceId || !priceId.startsWith('price_')) continue // skip if not configured

          const isAnnual = planType === 'annual'
          const checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: isAnnual ? 'payment' : 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${baseUrl}/?checkout=success&plan=${planType}&provider=stripe`,
            cancel_url: `${baseUrl}/?checkout=canceled`,
            metadata: { userId, planType, currency },
            allow_promotion_codes: true,
            subscription_data: isAnnual ? undefined : {
              metadata: { userId, planType, currency },
            },
          })

          return NextResponse.json({
            url: checkoutSession.url,
            sessionId: checkoutSession.id,
            provider: 'stripe',
            plan: planType,
          })
        } catch (stripeErr) {
          console.error('[checkout] Stripe error:', stripeErr)
          continue // Try next provider
        }
      }

      if (p.name === 'lemonsqueezy') {
        try {
          const plans = getPlans(currency as 'eur' | 'usd' | 'gbp')
          const plan = plans[planType as LSPlanType]
          if (!plan || plan.variantId.startsWith('variant_')) continue

          const { data, error } = await createCheckout({
            storeId: STORE_ID,
            variantId: plan.variantId,
            checkoutData: {
              email: user.email,
              name: user.name || undefined,
              custom: { userId, planType, currency },
            },
            checkoutOptions: {
              redirectUrl: `${baseUrl}/?checkout=success&plan=${planType}&provider=lemonsqueezy`,
              cancelUrl: `${baseUrl}/?checkout=canceled`,
              embed: false,
            },
            productOptions: {
              enabledVariants: [plan.variantId],
              isSubscription: planType !== 'annual',
            },
          })

          if (error || !data?.data?.attributes?.url) continue

          const customerId = data.data.attributes.customer_id?.toString()
          if (customerId) {
            await db.user.update({
              where: { id: userId },
              data: { lsCustomerId: customerId },
            })
          }

          return NextResponse.json({
            url: data.data.attributes.url,
            provider: 'lemonsqueezy',
            plan: planType,
          })
        } catch (lsErr) {
          console.error('[checkout] LemonSqueezy error:', lsErr)
          continue
        }
      }
    }

    // ════════════════════════════════════════════════════════
    // ─── No real provider → Dev Payment Simulator ──────────
    // ════════════════════════════════════════════════════════
    const prices: Record<string, number> = { starter: 9, pro: 19, career_plus: 39, employer: 49, annual: 179 }
    const basePrice = prices[planType] ?? 19
    const amount = currency === 'usd' ? Math.round(basePrice * 1.1) : currency === 'gbp' ? Math.round(basePrice * 0.85) : currency === 'mad' ? Math.round(basePrice * 10.7) : basePrice
    const currencyLabel = currency.toUpperCase()

    const { generateInvoiceForPayment, generateReceiptForPayment, generateServiceAgreement } = await import('@/lib/documents')

    // Upgrade plan
    await db.user.update({
      where: { id: userId },
      data: { plan: planType },
    })

    // Generate invoice
    const invoice = await generateInvoiceForPayment({
      userEmail: user.email,
      userName: user.name || 'Client',
      plan: planType,
      amount,
      currency: currencyLabel,
      userId,
      paidAt: new Date(),
    })

    // Generate receipt
    const receipt = await generateReceiptForPayment({
      userEmail: user.email,
      userName: user.name || 'Client',
      amount,
      currency: currencyLabel,
      description: `Abonnement ${planType} — HireNova (Simulation)`,
      userId,
      paidAt: new Date(),
    })

    // Auto-generate service agreement (contrat de service)
    try {
      await generateServiceAgreement({
        userId,
        userName: user.name || 'Client',
        userEmail: user.email,
        plan: planType,
        amount,
        currency: currencyLabel,
        paymentProvider: 'dev_simulation',
      })
    } catch (contractErr) {
      console.error('[checkout] Service agreement generation failed:', contractErr instanceof Error ? contractErr.message : contractErr)
    }

    // Create accounting entry
    try {
      await db.accountingEntry.create({
        data: {
          type: 'income',
          category: 'subscription',
          description: `Abonnement ${planType} — Dev Simulation (${user.email})`,
          amount,
          currency: currencyLabel,
          status: 'confirmed',
          userId,
          metadata: JSON.stringify({
            provider: 'dev_simulation',
            plan: planType,
            userEmail: user.email,
            invoiceNumber: invoice.number,
            receiptNumber: receipt.number,
          }),
        },
      })
    } catch (acctErr) {
      console.error('[checkout] Dev accounting entry failed:', acctErr)
    }

    return NextResponse.json({
      code: 'DEV_PAYMENT',
      success: true,
      data: {
        plan: planType,
        amount,
        currency: currencyLabel,
        invoice: {
          number: invoice.number,
          downloadUrl: `/api/documents/${invoice.id}`,
        },
        receipt: {
          number: receipt.number,
          downloadUrl: `/api/documents/${receipt.id}`,
        },
      },
    })
  } catch (error) {
    console.error('[checkout] Error:', error)
    const message = error instanceof Error ? error.message : 'Erreur interne du serveur'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
