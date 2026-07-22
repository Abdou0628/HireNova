import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, itemId, rating, comment } = body

    if (!type || !rating) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    if (!['cv', 'cover_letter'].includes(type)) {
      return NextResponse.json({ error: 'Type invalide' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'La note doit être entre 1 et 5' }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    let userId: string | undefined

    if (session?.user?.id) {
      const user = await db.user.findUnique({ where: { id: session.user.id } })
      if (user) userId = user.id
    }

    await db.satisfactionRating.create({
      data: {
        userId,
        type,
        itemId: itemId || undefined,
        rating,
        comment: comment?.trim() || undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Satisfaction error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
