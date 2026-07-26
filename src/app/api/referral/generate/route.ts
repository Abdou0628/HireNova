import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 401, message: 'Authentification requise' } },
        { status: 401 }
      )
    }

    const userId = session.user.id

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { referralCode: true, id: true },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 404, message: 'Utilisateur introuvable' } },
        { status: 404 }
      )
    }

    let code = user.referralCode

    if (!code) {
      const shortId = userId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase()
      code = `HN-${shortId}`

      let attempts = 0
      while (attempts < 10) {
        const existing = await db.user.findUnique({ where: { referralCode: code } })
        if (!existing) break
        code = `HN-${shortId}${Math.random().toString(36).slice(2, 4).toUpperCase()}`
        attempts++
      }

      await db.user.update({
        where: { id: userId },
        data: { referralCode: code },
      })
    }

    const origin = req.headers.get('origin') || 'https://hirenova.app'
    const shareUrl = `${origin}/?ref=${code}`

    return NextResponse.json({
      success: true,
      data: {
        referralCode: code,
        shareUrl,
        shareLinks: {
          whatsapp: `https://wa.me/?text=${encodeURIComponent("Découvrez HireNova — Générez des CV professionnels avec l'IA ! Utilisez mon code de parrainage : " + code + "\n\n" + shareUrl)}`,
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent("Découvrez @HireNova — CV IA professionnel en 60 secondes !")}&url=${encodeURIComponent(shareUrl)}`,
          email: `mailto:?subject=${encodeURIComponent('Invitation à rejoindre HireNova')}&body=${encodeURIComponent("Salut !\n\nDécouvre HireNova, la plateforme qui génère des CV professionnels avec l'IA.\n\nMon code de parrainage : " + code + "\n\n" + shareUrl)}`,
        },
      },
    })
  } catch (error) {
    console.error('[Referral Generate Error]', error)
    return NextResponse.json(
      { success: false, error: { code: 500, message: 'Erreur interne du serveur' } },
      { status: 500 }
    )
  }
}
