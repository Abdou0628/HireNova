import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [activeJobs, applications, avgScore] = await Promise.all([
      db.jobListing.count({ where: { status: 'active' } }),
      db.application.count(),
      db.application.aggregate({ _avg: { matchScore: true }, where: { matchScore: { not: null } } })
    ])

    const companies = await db.jobListing.findMany({ where: { status: 'active' }, select: { company: true }, distinct: ['company'] })

    return NextResponse.json({
      success: true,
      data: {
        activeJobs, totalApplications: applications,
        avgMatchScore: avgScore._avg.matchScore ? Math.round(avgScore._avg.matchScore) : 0,
        companies: companies.length
      }
    })
  } catch {
    return NextResponse.json({ success: false, error: { code: 500, message: 'Erreur' } }, { status: 500 })
  }
}
