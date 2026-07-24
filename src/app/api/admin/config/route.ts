import { NextResponse } from 'next/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''

export async function GET() {
  // Only return a non-empty string if configured
  // Frontend will compare session email against this value
  if (!ADMIN_EMAIL) {
    return NextResponse.json({ adminEmail: '' })
  }
  return NextResponse.json({ adminEmail: ADMIN_EMAIL })
}