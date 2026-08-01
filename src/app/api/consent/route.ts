import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET — Return current user's consent (if logged in) or null
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: true, data: null })
    }

    const consent = await db.userConsent.findUnique({
      where: { userId: session.user.id }
    })

    return NextResponse.json({ success: true, data: consent })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 500, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}

// POST — Save or update user consent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      analyticsCookies,
      marketingCookies,
      newsletterConsent,
      newsletterJobs,
      newsletterProducts,
    } = body

    // Extract IP and User-Agent
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const session = await getServerSession(authOptions)

    if (session?.user?.id) {
      // Logged in — upsert to DB
      const consent = await db.userConsent.upsert({
        where: { userId: session.user.id },
        update: {
          analyticsCookies: !!analyticsCookies,
          marketingCookies: !!marketingCookies,
          newsletterConsent: !!newsletterConsent,
          newsletterJobs: !!newsletterJobs,
          newsletterProducts: !!newsletterProducts,
          ipAddress,
          userAgent,
        },
        create: {
          userId: session.user.id,
          analyticsCookies: !!analyticsCookies,
          marketingCookies: !!marketingCookies,
          newsletterConsent: !!newsletterConsent,
          newsletterJobs: !!newsletterJobs,
          newsletterProducts: !!newsletterProducts,
          ipAddress,
          userAgent,
        },
      })

      return NextResponse.json({ success: true, data: consent })
    }

    // Not logged in — just return success (localStorage handles cookie-only consent)
    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 500, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
