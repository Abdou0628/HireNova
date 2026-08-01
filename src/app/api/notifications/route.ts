import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET — Return user notifications with unread count
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 401, message: 'Auth requis' } },
        { status: 401 }
      )
    }

    const userId = session.user.id

    const [notifications, unreadCount] = await Promise.all([
      db.jobNotification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      db.jobNotification.count({
        where: { userId, isRead: false },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: { notifications, unreadCount },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 500, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}

// PATCH — Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 401, message: 'Auth requis' } },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const body = await request.json()

    if (body.markAll) {
      // Mark ALL as read
      await db.jobNotification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      })
      return NextResponse.json({ success: true, data: { updated: true } })
    }

    if (Array.isArray(body.ids) && body.ids.length > 0) {
      // Mark specific IDs as read
      await db.jobNotification.updateMany({
        where: { id: { in: body.ids }, userId },
        data: { isRead: true },
      })
      return NextResponse.json({ success: true, data: { updated: true } })
    }

    return NextResponse.json(
      { success: false, error: { code: 400, message: 'Paramètres invalides' } },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 500, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
