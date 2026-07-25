import { NextResponse } from 'next/server'
import { resetFailedAttempts } from '@/lib/auth'

export async function POST() {
  resetFailedAttempts('abdellahbazhani053@gmail.com')
  return NextResponse.json({ unlocked: true })
}
