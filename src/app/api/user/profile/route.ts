import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 401, message: 'Authentification requise' } },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, companyName, industry, companyWebsite, image } = body as {
      name?: string
      companyName?: string
      industry?: string
      companyWebsite?: string
      image?: string
    }

    // Validate
    if (name && (name.length < 2 || name.length > 100)) {
      return NextResponse.json(
        { success: false, error: { code: 400, message: 'Nom invalide (2-100 caractères)' } },
        { status: 400 }
      )
    }

    const updateData: Record<string, string> = {}
    if (name !== undefined) updateData.name = name.trim()
    if (companyName !== undefined) updateData.companyName = companyName.trim()
    if (industry !== undefined) updateData.industry = industry.trim()
    if (companyWebsite !== undefined) updateData.companyWebsite = companyWebsite.trim()
    if (image !== undefined) updateData.image = image

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 400, message: 'Aucune modification' } },
        { status: 400 }
      )
    }

    const updated = await db.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        companyName: true,
        industry: true,
        companyWebsite: true,
        plan: true,
        role: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('[user/profile] Update error:', error)
    return NextResponse.json(
      { success: false, error: { code: 500, message: 'Erreur interne' } },
      { status: 500 }
    )
  }
}
