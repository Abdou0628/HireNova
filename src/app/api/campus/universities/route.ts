import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { withAuth } from '@/lib/hnsa'

const SEED_UNIVERSITIES = [
  { name: 'Université Mohammed VI Polytechnique', country: 'Morocco', programs: '[["Engineering","AI & Data Science","Computer Science"]]', studentCount: 8500, status: 'active', contactEmail: 'partnerships@um6p.ma' },
  { name: 'Sorbonne Université', country: 'France', programs: '[["Computer Science","Mathematics","Physics"]]', studentCount: 55000, status: 'active', contactEmail: 'campus@sorbonne-universite.fr' },
  { name: 'University of Barcelona', country: 'Spain', programs: '[["Business","Engineering","Data Science"]]', studentCount: 63000, status: 'active', contactEmail: 'rel.internacionales@ub.edu' },
  { name: 'University of Toronto', country: 'Canada', programs: '[["Computer Science","AI","Engineering"]]', studentCount: 95000, status: 'active', contactEmail: 'partnerships@utoronto.ca' },
  { name: 'University of London', country: 'United Kingdom', programs: '[["Business","Law","Data Analytics"]]', studentCount: 120000, status: 'pending', contactEmail: 'campus@london.ac.uk' },
]

async function seedIfEmpty() {
  const existing = await db.$queryRawUnsafe<any[]>('SELECT COUNT(*) as c FROM CampusUniversity')
  if (existing[0]?.c > 0) return

  for (const u of SEED_UNIVERSITIES) {
    await db.$executeRawUnsafe(
      `INSERT INTO CampusUniversity (id, name, country, programs, studentCount, status, contactEmail, partnershipDate, createdAt)
       VALUES (lower(hex(randomblob(12))), '${u.name.replace(/'/g, "''")}', '${u.country}', '${u.programs}', ${u.studentCount}, '${u.status}', '${u.contactEmail}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    )
  }
  console.log('[campus/universities] Seeded 5 demo universities')
}

// GET /api/campus/universities
export async function GET() {
  try {
    await seedIfEmpty()
    const unis = await db.$queryRawUnsafe<any[]>(
      'SELECT * FROM CampusUniversity ORDER BY createdAt DESC'
    )
    return NextResponse.json({ success: true, data: unis })
  } catch (error) {
    console.error('[campus/universities] GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch universities' }, { status: 500 })
  }
}

// POST /api/campus/universities — Create
export async function POST(req: NextRequest) {
  try {
    const auth = await withAuth(req)
    if (!auth.authorized) return NextResponse.json({ error: auth.reason }, { status: auth.statusCode })

    const body = await req.json()
    const { name, country, programs, studentCount, status, contactEmail } = body
    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 })
    }
    const programsStr = typeof programs === 'string' ? programs.replace(/'/g, "''") : JSON.stringify(programs || []).replace(/'/g, "''")
    const uni = await db.$queryRawUnsafe<any[]>(
      `INSERT INTO CampusUniversity (id, name, country, programs, studentCount, status, contactEmail, partnershipDate, createdAt) VALUES (lower(hex(randomblob(12))), '${name.trim().replace(/'/g, "''")}', '${(country || '').replace(/'/g, "''")}', '${programsStr}', ${typeof studentCount === 'number' ? studentCount : 0}, '${(status || 'active').replace(/'/g, "''")}', '${(contactEmail || '').replace(/'/g, "''")}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`
    )
    return NextResponse.json({ success: true, data: uni[0] })
  } catch (error) {
    console.error('[campus/universities] POST error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create university' }, { status: 500 })
  }
}

// PUT /api/campus/universities?id=xxx — Update
export async function PUT(req: NextRequest) {
  try {
    const auth = await withAuth(req)
    if (!auth.authorized) return NextResponse.json({ error: auth.reason }, { status: auth.statusCode })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })

    const body = await req.json()
    const { name, country, programs, studentCount, status, contactEmail } = body

    const sets: string[] = []
    if (name !== undefined) sets.push(`name = '${name.trim().replace(/'/g, "''")}'`)
    if (country !== undefined) sets.push(`country = '${(country || '').replace(/'/g, "''")}'`)
    if (programs !== undefined) sets.push(`programs = '${(typeof programs === 'string' ? programs : JSON.stringify(programs)).replace(/'/g, "''")}'`)
    if (studentCount !== undefined) sets.push(`studentCount = ${studentCount}`)
    if (status !== undefined) sets.push(`status = '${status}'`)
    if (contactEmail !== undefined) sets.push(`contactEmail = '${(contactEmail || '').replace(/'/g, "''")}'`)

    if (sets.length === 0) return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 })

    const uni = await db.$queryRawUnsafe<any[]>(
      `UPDATE CampusUniversity SET ${sets.join(', ')} WHERE id = '${id}' RETURNING *`
    )
    return NextResponse.json({ success: true, data: uni[0] })
  } catch (error) {
    console.error('[campus/universities] PUT error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update university' }, { status: 500 })
  }
}

// DELETE /api/campus/universities?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const auth = await withAuth(req)
    if (!auth.authorized) return NextResponse.json({ error: auth.reason }, { status: auth.statusCode })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    await db.$executeRawUnsafe(`DELETE FROM CampusUniversity WHERE id = '${id}'`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[campus/universities] DELETE error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete university' }, { status: 500 })
  }
}

export async function PATCH() {
  return NextResponse.json({ success: true, message: 'Already seeded' })
}
