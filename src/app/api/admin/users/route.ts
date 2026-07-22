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
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const planFilter = searchParams.get('plan') || ''

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { name: { contains: search } },
      ]
    }
    if (planFilter && ['free', 'pro', 'lifetime'].includes(planFilter)) {
      where.plan = planFilter
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
          cvCountThisMonth: true,
          clCountThisMonth: true,
          lsCustomerId: true,
          lsVariantId: true,
          lsSubId: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              resumes: true,
              coverLetters: true,
            },
          },
        },
      }),
      db.user.count({ where }),
    ])

    // Also count per plan
    const [freeCount, proCount, lifetimeCount] = await Promise.all([
      db.user.count({ where: { plan: 'free' } }),
      db.user.count({ where: { plan: 'pro' } }),
      db.user.count({ where: { plan: 'lifetime' } }),
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      planCounts: {
        free: freeCount,
        pro: proCount,
        lifetime: lifetimeCount,
      },
    })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
