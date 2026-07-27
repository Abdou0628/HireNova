import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

/**
 * Get all interview sessions for the current user.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    const sessions = await db.interviewSession.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        _count: {
          select: { messages: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: sessions.map((s) => ({
        id: s.id,
        jobTitle: s.jobTitle,
        industry: s.industry,
        language: s.language,
        difficulty: s.difficulty,
        interviewType: s.interviewType,
        status: s.status,
        totalScore: s.totalScore,
        totalQuestions: s._count.messages,
        report: s.report ? JSON.parse(s.report) : null,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
    })
  } catch (error) {
    console.error('[interview/sessions] Error:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
