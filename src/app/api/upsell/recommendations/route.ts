import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/hnsa/with-auth'
import { db } from '@/lib/db'
import { getRecommendations, getPersonalizedBanner } from '@/lib/upsell-engine'
import type { UserContext } from '@/lib/upsell-engine'

// ─── In-memory cache (5 min TTL per user) ─────────────────────────────────────

interface CacheEntry {
  recommendations: ReturnType<typeof getRecommendations>
  banner: ReturnType<typeof getPersonalizedBanner>
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

function getFromCache(userId: string): CacheEntry | null {
  const entry = cache.get(userId)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    cache.delete(userId)
    return null
  }
  return entry
}

function setCache(userId: string, data: CacheEntry): void {
  // Evict expired entries to prevent memory leaks
  for (const [key, val] of cache) {
    if (Date.now() > val.expiresAt) cache.delete(key)
  }
  cache.set(userId, data)
}

// ─── GET /api/upsell/recommendations ──────────────────────────────────────────

export async function GET(request: NextRequest) {
  const auth = await withAuth(request)
  if (!auth.authorized || !auth.userId) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 },
    )
  }

  // Check cache first
  const cached = getFromCache(auth.userId)
  if (cached) {
    return NextResponse.json({
      recommendations: cached.recommendations,
      banner: cached.banner,
      cached: true,
    })
  }

  try {
    // Fetch user data from DB in parallel
    const [user, resumeCount, coverLetterCount, applicationsCount, linkedinCount, interviewCount, careerAssessments, mobilityCount] =
      await Promise.all([
        db.user.findUnique({ where: { id: auth.userId } }),
        db.resume.count({ where: { userId: auth.userId } }),
        db.coverLetter.count({ where: { userId: auth.userId } }),
        db.application.count({ where: { candidateId: auth.userId } }),
        db.linkedinAnalysis.count({ where: { userId: auth.userId } }),
        db.interviewSession.count({ where: { userId: auth.userId } }),
        db.careerAssessment.count({ where: { userId: auth.userId } }),
        db.mobilityProfile.count({ where: { userId: auth.userId } }),
      ])

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', code: 'NOT_FOUND' },
        { status: 404 },
      )
    }

    // Calculate days since registration
    const createdAt = new Date(user.createdAt)
    const now = new Date()
    const daysSinceRegistration = Math.max(
      0,
      Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)),
    )

    // Build modules used list from DB activity
    const modulesUsed: string[] = []
    if (resumeCount > 0) modulesUsed.push('mod_cv')
    // ATS usage is implied by resume + ats analysis
    if (careerAssessments > 0) modulesUsed.push('mod_career')
    if (linkedinCount > 0) modulesUsed.push('mod_linkedin')
    if (interviewCount > 0) modulesUsed.push('mod_interview')
    if (mobilityCount > 0) modulesUsed.push('mod_mobility')
    if (applicationsCount > 0) modulesUsed.push('mod_jobs')

    // Build user context for the upsell engine
    const context: UserContext = {
      currentPlan: user.plan,
      modulesUsed,
      cvCount: user.cvCountThisMonth,
      clCount: user.clCountThisMonth,
      applicationsCount,
      daysSinceRegistration,
      hasLinkedInOptimized: linkedinCount > 0,
      hasInterviewPrep: interviewCount > 0,
      hasCareerRoadmap: careerAssessments > 0,
      lastActivityDate: user.updatedAt.toISOString(),
      role: user.role,
    }

    // Get recommendations
    const recommendations = getRecommendations(context)
    const banner = getPersonalizedBanner(context)

    // Cache result
    setCache(auth.userId, {
      recommendations,
      banner,
      expiresAt: Date.now() + CACHE_TTL_MS,
    })

    return NextResponse.json({
      recommendations,
      banner,
      cached: false,
    })
  } catch (error) {
    console.error('[upsell/recommendations] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    )
  }
}
