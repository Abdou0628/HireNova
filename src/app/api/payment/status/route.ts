import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPaymentStatus, getPaymentWithEvents, isEventProcessed } from '@/lib/payment/orchestrator';
import { getPaymentTimeline } from '@/lib/payment/ledger';
import { getAdapterOrNull } from '@/lib/payment/adapters';
import type { PaymentProviderName, PaymentStatus } from '@/lib/payment/types';

export const runtime = 'nodejs';

/**
 * GET /api/payment/status?id=<paymentId>&includeEvents=true&syncWithProvider=true
 *
 * Returns the current status of a payment.
 * Optional parameters:
 * - includeEvents=true: includes the full event timeline
 * - syncWithProvider=true: fetches live status from the provider before responding
 */
export async function GET(request: NextRequest) {
  try {
    // ── Authentication ──
    const session = await getServerSession(authOptions);
    const apiKey = request.headers.get('x-api-key');

    if (!session?.user?.id && apiKey !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // ── Parse query params ──
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('id');
    const includeEvents = searchParams.get('includeEvents') === 'true';
    const syncWithProvider = searchParams.get('syncWithProvider') === 'true';

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: 'Payment ID (id query param) is required' },
        { status: 400 }
      );
    }

    // ── Fetch payment ──
    let payment = await getPaymentStatus(paymentId);
    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }

    // ── Optionally sync with provider ──
    if (syncWithProvider && payment.providerPaymentId) {
      const adapter = await getAdapterOrNull(payment.provider as PaymentProviderName);
      if (adapter) {
        try {
          const providerStatus = await adapter.getPaymentStatus(payment.providerPaymentId);
          if (providerStatus.success && providerStatus.status) {
            const providerNewStatus = providerStatus.status as PaymentStatus;
            // Only update if the status has changed
            if (providerNewStatus !== payment.status) {
              const { updatePaymentStatus: updateStatus } = await import('@/lib/payment/orchestrator');
              payment = await updateStatus(
                paymentId,
                providerNewStatus,
                { providerSync: providerStatus.rawResponse },
                providerStatus.providerPaymentId
              );
            }
          }
        } catch (syncErr) {
          // Log sync error but don't fail the request
          console.warn('[payment/status] Provider sync failed:', syncErr);
        }
      }
    }

    // ── Format payment for response ──
    const formattedPayment = {
      ...payment,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
      capturedAt: payment.capturedAt?.toISOString(),
      refundedAt: payment.refundedAt?.toISOString(),
      expiresAt: payment.expiresAt?.toISOString(),
    };

    // ── Optionally include events ──
    let events;
    if (includeEvents) {
      const timeline = await getPaymentTimeline(paymentId);
      events = timeline.map((e) => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
      }));
    }

    return NextResponse.json({
      success: true,
      payment: formattedPayment,
      ...(events ? { events } : {}),
    });
  } catch (error) {
    console.error('[payment/status] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
