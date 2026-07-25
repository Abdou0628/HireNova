import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({ success: false, error: { code: 401, message: 'Non authentifié' } }, { status: 401 })

    const user = await db.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ success: false, error: { code: 401, message: 'Utilisateur non trouvé' } }, { status: 401 })

    const applications = await db.application.findMany({
      where: { candidateId: user.id },
      include: { job: { select: { title: true, company: true, location: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({ success: true, data: applications })
  } catch {
    return NextResponse.json({ success: false, error: { code: 500, message: 'Erreur' } }, { status: 500 })
  }
}
