import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/campus/students
export async function GET() {
  try {
    const students = await db.$queryRawUnsafe<any[]>(
      `SELECT s.*, u.name as "userName", u.email as "userEmail", uni.name as "universityName"
       FROM CampusStudent s
       LEFT JOIN User u ON s.userId = u.id
       LEFT JOIN CampusUniversity uni ON s.universityId = uni.id
       ORDER BY s.enrolledAt DESC`
    )
    const formatted = students.map(s => ({
      id: s.id,
      userId: s.userId,
      universityId: s.universityId,
      program: s.program,
      cvsCreated: s.cvsCreated,
      atsAvgScore: s.atsAvgScore,
      interviewsCompleted: s.interviewsCompleted,
      certificationsEarned: s.certificationsEarned,
      enrolledAt: s.enrolledAt,
      user: s.userName ? { name: s.userName, email: s.userEmail } : null,
      university: s.universityName ? { name: s.universityName } : null,
    }))
    return NextResponse.json({ success: true, data: formatted })
  } catch (error) {
    console.error('[campus/students] GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch students' }, { status: 500 })
  }
}
