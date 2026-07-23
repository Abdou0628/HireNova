import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const [tickets, openCount, resolvedCount] = await Promise.all([
      db.supportTicket.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      db.supportTicket.count({ where: { status: 'open' } }),
      db.supportTicket.count({ where: { status: 'resolved' } }),
    ])

    return NextResponse.json({ tickets, openCount, resolvedCount })
  } catch (error) {
    console.error('Admin support error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { ticketId, status } = await request.json()
    if (!ticketId || !['open', 'resolved', 'closed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    await db.supportTicket.update({
      where: { id: ticketId },
      data: { status },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin support patch error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
