import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const severity = searchParams.get('severity') || ''
    const type = searchParams.get('type') || ''

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (severity) {
      where.severity = severity
    }
    if (type) {
      where.type = type
    }

    const [logs, total, highCriticalCount] = await Promise.all([
      db.securityLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          severity: true,
          ip: true,
          path: true,
          method: true,
          userAgent: true,
          email: true,
          details: true,
          createdAt: true,
        },
      }),
      db.securityLog.count({ where }),
      db.securityLog.count({
        where: {
          severity: { in: ['high', 'critical'] },
        },
      }),
    ])

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unresolvedHighCritical: highCriticalCount,
    })
  } catch (error) {
    console.error('Admin security alerts error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
