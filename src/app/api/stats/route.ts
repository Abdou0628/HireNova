import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [cvCount, clCount, userCount] = await Promise.all([
      db.resume.count(),
      db.coverLetter.count(),
      db.user.count(),
    ])

    return NextResponse.json({
      cvCount,
      clCount,
      userCount,
      total: cvCount + clCount,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ cvCount: 0, clCount: 0, userCount: 0, total: 0 })
  }
}
