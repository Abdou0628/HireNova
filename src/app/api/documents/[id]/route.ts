import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''

/**
 * GET /api/documents/[id]
 * Admin: download the PDF (returns binary).
 * Authenticated user: download their own document (if userId matches).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const doc = await db.document.findUnique({ where: { id } })
    if (!doc) {
      return NextResponse.json({ error: 'Document introuvable' }, { status: 404 })
    }

    const isAdmin = session.user.email === ADMIN_EMAIL
    const isOwner = doc.userId && session.user.id && doc.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!doc.pdfBase64) {
      return NextResponse.json({ error: 'PDF non généré' }, { status: 404 })
    }

    const pdfBuffer = Buffer.from(doc.pdfBase64, 'base64')

    const typeLabels: Record<string, string> = {
      invoice: 'facture',
      quote: 'devis',
      agreement: 'contrat',
      receipt: 'recu',
      credit_note: 'avoir',
    }
    const filename = `${typeLabels[doc.type] || 'document'}-${doc.number}.pdf`

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(pdfBuffer.length),
        'Cache-Control': 'private, no-cache',
      },
    })
  } catch (error) {
    console.error('[documents/[id]] error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
