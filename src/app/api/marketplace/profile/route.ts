import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let profile = await db.communityProfile.findUnique({
      where: { userId: session.user.email },
      include: { user: { select: { name: true, image: true, email: true } } },
    })

    // Auto-create profile if not exists
    if (!profile) {
      profile = await db.communityProfile.create({
        data: {
          userId: session.user.email,
          bio: '',
          skills: '[]',
          badges: '["early-adopter"]',
          reputation: 10,
        },
        include: { user: { select: { name: true, image: true, email: true } } },
      })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('GET /api/marketplace/profile error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { bio, skills } = body

    const profile = await db.communityProfile.upsert({
      where: { userId: session.user.email },
      create: {
        userId: session.user.email,
        bio: bio || '',
        skills: skills || '[]',
        badges: '["early-adopter"]',
        reputation: 10,
      },
      update: {
        ...(bio !== undefined && { bio }),
        ...(skills !== undefined && { skills }),
      },
      include: { user: { select: { name: true, image: true, email: true } } },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('PUT /api/marketplace/profile error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
