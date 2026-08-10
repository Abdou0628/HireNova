import { NextResponse } from 'next/server'
import { unlockAccount } from '@/lib/hnsa'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const success = await unlockAccount(email, session.user.id)
    if (!success) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    return NextResponse.json({ unlocked: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unlock account' }, { status: 500 })
  }
}
