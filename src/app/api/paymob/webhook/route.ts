import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPaymobWebhook } from '@/lib/paymob'
import { generateInvoiceForPayment, generateReceiptForPayment } from '@/lib/documents'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()

    console.log('Paymob webhook received:', JSON.stringify(payload, null, 2))

    // Verify HMAC
    if (!verifyPaymobWebhook(payload)) {
      console.error('Paymob webhook HMAC verification failed')
      return NextResponse.json({ error: 'Invalid HMAC' }, { status: 401 })
    }

    const obj = payload.obj as Record<string, unknown>
    const success = obj.success as boolean
    const orderId = (obj.order as Record<string, unknown>)?.id?.toString()
    const transactionId = obj.id?.toString()
    const sourceData = obj.source_data as Record<string, unknown> | undefined
    const provider = (sourceData?.type as string) || 'card'

    if (!success || !orderId) {
      console.log(`Paymob payment failed for order ${orderId}`)
      return NextResponse.json({ success: true })
    }

    // Find user by Paymob order ID
    const user = await db.user.findFirst({
      where: { paymobOrderId: orderId },
    })

    if (!user) {
      console.error(`No user found for Paymob order ${orderId}`)
      return NextResponse.json({ success: true })
    }

    if (user.plan !== 'free') {
      console.log(`User ${user.id} already has plan ${user.plan}, skipping`)
      return NextResponse.json({ success: true })
    }

    // Determine plan type from order amount
    const amountCents = (obj.amount_cents as number) / 100
    const plan = amountCents >= 200 ? 'lifetime' : 'pro'

    // Update user plan
    await db.user.update({
      where: { id: user.id },
      data: {
        plan,
        paymobPaymentId: transactionId,
        paymobProvider: provider,
      },
    })

    console.log(`User ${user.id} upgraded to ${plan} via Paymob (order: ${orderId}, tx: ${transactionId})`)

    // ===== Auto-generate invoice + receipt (paperless loop) =====
    // PayMob processes in MAD (Moroccan Dirham)
    try {
      const invoice = await generateInvoiceForPayment({
        userEmail: user.email,
        userName: user.name || 'Client',
        plan,
        amount: amountCents,
        currency: 'MAD',
        userId: user.id,
        paidAt: new Date(),
      })
      console.log(`[paymob-webhook] Invoice ${invoice.number} generated for user ${user.id} (${amountCents} MAD)`)

      const receipt = await generateReceiptForPayment({
        userEmail: user.email,
        userName: user.name || 'Client',
        amount: amountCents,
        currency: 'MAD',
        description: `Abonnement ${plan} — HireNova (PayMob)`,
        userId: user.id,
        paidAt: new Date(),
      })
      console.log(`[paymob-webhook] Receipt ${receipt.number} generated for user ${user.id}`)
    } catch (docErr) {
      console.error('[paymob-webhook] Auto-invoicing failed:', docErr instanceof Error ? docErr.message : docErr)
      // Don't throw — webhook should still return 200
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Paymob webhook error:', error)
    return NextResponse.json({ success: true }) // Always return 200 to Paymob
  }
}

// Paymob also sends GET for transaction verification
export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
