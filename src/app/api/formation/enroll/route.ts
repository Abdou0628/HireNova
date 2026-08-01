import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

// GET /api/formation/enroll — get user enrollments
export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ enrollments: [] })
    }

    const user = await db.user.findUnique({ where: { email: session.user.email } })
    if (!user) {
      return NextResponse.json({ enrollments: [] })
    }

    const enrollments = await db.enrollment.findMany({
      where: { userId: user.id },
      include: { course: true },
      orderBy: { startedAt: 'desc' },
    })

    return NextResponse.json({ enrollments })
  } catch (error) {
    console.error('Formation enroll GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 })
  }
}

// POST /api/formation/enroll — enroll in a course or update progress
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    const body = await req.json()
    const { courseId, progress, completed } = body

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({ where: { email: session.user.email } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if already enrolled
    const existing = await db.enrollment.findFirst({
      where: { userId: user.id, courseId },
    })

    if (existing) {
      // Update progress
      const updateData: Record<string, unknown> = {}
      if (progress !== undefined) updateData.progress = Math.min(100, Math.max(0, progress))
      if (completed !== undefined) {
        updateData.completed = completed
        if (completed) updateData.completedAt = new Date()
      }

      const updated = await db.enrollment.update({
        where: { id: existing.id },
        data: updateData,
        include: { course: true },
      })
      return NextResponse.json({ enrollment: updated })
    }

    // Create new enrollment
    const enrollment = await db.enrollment.create({
      data: {
        userId: user.id,
        courseId,
        progress: progress || 0,
        completed: completed || false,
      },
      include: { course: true },
    })

    // Increment enroll count on course
    await db.formationCourse.update({
      where: { id: courseId },
      data: { enrollCount: { increment: 1 } },
    })

    return NextResponse.json({ enrollment }, { status: 201 })
  } catch (error) {
    console.error('Formation enroll POST error:', error)
    return NextResponse.json({ error: 'Failed to enroll' }, { status: 500 })
  }
}
