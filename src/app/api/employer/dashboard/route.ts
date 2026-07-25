import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({ success: false, error: { code: 401, message: 'Non authentifié' } }, { status: 401 })
    const user = await db.user.findUnique({ where: { email: session.user.email } })
    if (!user || user.role !== 'employer') return NextResponse.json({ success: false, error: { code: 403, message: 'Employeur requis' } }, { status: 403 })

    const [postedJobs, applications] = await Promise.all([
      db.jobListing.count({ where: { employerId: user.id } }),
      db.application.count({ where: { job: { employerId: user.id } } })
    ])

    return NextResponse.json({ success: true, data: { postedJobs, totalApplications: applications } })
  } catch {
    return NextResponse.json({ success: false, error: { code: 500, message: 'Erreur' } }, { status: 500 })
  }
}
