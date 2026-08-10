import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { withAuth } from '@/lib/hnsa'

// GET /api/recruiter/candidates — list all candidates with optional filters
export async function GET(req: NextRequest) {
  try {
    const auth = await withAuth(req)
    if (!auth.authorized) return NextResponse.json({ error: auth.reason }, { status: auth.statusCode })

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const minScore = parseInt(searchParams.get('minScore') || '0', 10)

    const where: any = {}
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
      ]
    }
    if (minScore > 0) {
      where.score = { gte: minScore }
    }

    const candidates = await db.recruiterCandidate.findMany({
      where,
      include: { job: { select: { title: true, id: true } } },
      orderBy: { score: 'desc' },
      take: 50,
    })

    const formatted = candidates.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      score: c.score,
      stage: c.stage,
      jobTitle: c.job.title,
      jobId: c.job.id,
      skills: c.notes || '',
      appliedAt: c.appliedAt.toISOString(),
    }))

    return NextResponse.json({ candidates: formatted })
  } catch (error) {
    console.error('Candidates GET error:', error)
    return NextResponse.json({ candidates: [] }, { status: 500 })
  }
}
