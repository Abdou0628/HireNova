/**
 * HNSA — Security Audit Log API (Admin Only)
 *
 * GET /api/admin/security-audit — Paginated audit trail with filters
 * GET ?action=LOGIN_FAILURE&severity=high&startDate=...&endDate=...&page=1&limit=50
 *
 * HNSA Pillars: 1 (Identity), 8 (Monitoring & Incident Response)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuditTrail } from '@/lib/hnsa'

export async function GET(request: NextRequest) {
  try {
    // --- Auth check ---
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // --- Admin check (HNSA Pillar 1: IAM) ---
    const { db } = await import('@/lib/db')
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    })

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden — admin only', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // --- Parse query params ---
    const { searchParams } = request.nextUrl
    const filters = {
      action: searchParams.get('action') || undefined,
      actorId: searchParams.get('actorId') || undefined,
      actorEmail: searchParams.get('actorEmail') || undefined,
      resource: searchParams.get('resource') || undefined,
      outcome: searchParams.get('outcome') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      page: Number(searchParams.get('page')) || 1,
      limit: Math.min(Number(searchParams.get('limit')) || 50, 100),
    }

    const result = await getAuditTrail(filters)

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error('[HNSA] Audit API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
