// ─── HireNova AI Contextual Upsell Recommendation Engine ─────────────────
// Rule-based recommendation engine that analyzes user context and returns
// relevant upsell suggestions. No LLM calls needed for core logic.

// ─── Types ──────────────────────────────────────────────────────────────────

export interface UserContext {
  currentPlan: string          // 'free' | 'hirenova_start' | 'hirenova_career' | etc.
  modulesUsed: string[]        // which module steps the user has visited (from analytics)
  cvCount: number              // CVs generated this month
  clCount: number              // cover letters generated
  applicationsCount: number    // total applications
  daysSinceRegistration: number
  hasLinkedInOptimized: boolean
  hasInterviewPrep: boolean
  hasCareerRoadmap: boolean
  lastActivityDate: string
  role?: string                // 'candidate' | 'employer'
}

export interface UpsellRecommendation {
  id: string
  targetId: string             // module id or bundle id to recommend
  targetType: 'module' | 'bundle' | 'b2b'
  title: string                // FR text
  description: string          // FR text
  reason: string               // why we recommend this (FR)
  priority: number             // 1-10, higher = more relevant
  discountPercent?: number     // if applicable
  validUntil?: string          // urgency
}

export interface PersonalizedBanner {
  text: string
  cta: string
  targetId: string
  targetType: string
}

// ─── Recommendation Builders ─────────────────────────────────────────────────

function addUrgency(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

// ─── Rule Implementations ────────────────────────────────────────────────────

/**
 * Rule 1: Free user with 1+ CV generated → Career bundle
 */
function ruleFreeUserWithCV(ctx: UserContext): UpsellRecommendation | null {
  if (ctx.currentPlan === 'free' && ctx.cvCount >= 1) {
    return {
      id: 'r1-cv-to-career',
      targetId: 'hirenova_career',
      targetType: 'bundle',
      title: 'HIRENOVA CAREER',
      description: 'Débloquez 7 modules carrière',
      reason: 'Votre CV est prêt, optimisez votre recherche avec nos 7 modules carrière',
      priority: 9,
      discountPercent: 10,
      validUntil: addUrgency(3),
    }
  }
  return null
}

/**
 * Rule 2: Free user who visited jobs page → JOBS module
 */
function ruleFreeUserVisitedJobs(ctx: UserContext): UpsellRecommendation | null {
  if (
    ctx.currentPlan === 'free' &&
    ctx.modulesUsed.some(m => m.toLowerCase().includes('jobs') || m.toLowerCase().includes('job'))
  ) {
    return {
      id: 'r2-jobs-module',
      targetId: 'mod_jobs',
      targetType: 'module',
      title: 'Module Offres d\'Emploi',
      description: 'Accédez à des milliers d\'offres triées par IA',
      reason: "Accédez à des milliers d'offres triées par IA",
      priority: 7,
      validUntil: addUrgency(5),
    }
  }
  return null
}

/**
 * Rule 3: Free user who visited interview page → Career bundle
 */
function ruleFreeUserVisitedInterview(ctx: UserContext): UpsellRecommendation | null {
  if (
    ctx.currentPlan === 'free' &&
    ctx.modulesUsed.some(m => m.toLowerCase().includes('interview') || m.toLowerCase().includes('entretien'))
  ) {
    return {
      id: 'r3-interview-career',
      targetId: 'hirenova_career',
      targetType: 'bundle',
      title: 'HIRENOVA CAREER',
      description: 'Préparez vos entretiens avec notre simulateur IA',
      reason: 'Préparez vos entretiens avec notre simulateur IA',
      priority: 8,
      discountPercent: 10,
      validUntil: addUrgency(3),
    }
  }
  return null
}

/**
 * Rule 4: Start plan user → upgrade to Career
 */
function ruleStartPlanUpgrade(ctx: UserContext): UpsellRecommendation | null {
  if (ctx.currentPlan === 'hirenova_start') {
    return {
      id: 'r4-start-to-career',
      targetId: 'hirenova_career',
      targetType: 'bundle',
      title: 'Passez à HIRENOVA CAREER',
      description: '5 modules supplémentaires pour 10€ de plus',
      reason: 'Débloquez 5 modules supplémentaires pour 10€ de plus',
      priority: 7,
      validUntil: addUrgency(7),
    }
  }
  return null
}

/**
 * Rule 5: Career plan user who used mobility → upgrade to Professional
 */
function ruleCareerMobilityUpgrade(ctx: UserContext): UpsellRecommendation | null {
  if (
    ctx.currentPlan === 'hirenova_career' &&
    ctx.modulesUsed.some(m => m.toLowerCase().includes('mobility') || m.toLowerCase().includes('mobilité'))
  ) {
    return {
      id: 'r5-career-to-pro',
      targetId: 'hirenova_professional',
      targetType: 'bundle',
      title: 'HIRENOVA PROFESSIONNEL',
      description: 'Mobilité, Coach et Formation inclus',
      reason: 'Ajoutez Mobilité, Coach et Formation à votre arsenal',
      priority: 8,
      discountPercent: 15,
      validUntil: addUrgency(5),
    }
  }
  return null
}

/**
 * Rule 6: Any user who used 3+ different modules as individual → cheapest bundle
 */
function ruleBundleSavings(ctx: UserContext): UpsellRecommendation | null {
  // Only applies if user seems to be using modules individually (not already on a bundle)
  const individualModules = [
    'mod_cv', 'mod_ats', 'mod_jobs', 'mod_global', 'mod_mobility',
    'mod_interview', 'mod_linkedin', 'mod_career', 'mod_coach', 'mod_formation', 'mod_freelance',
  ]
  const usedIndividual = ctx.modulesUsed.filter(m => individualModules.includes(m))

  if (usedIndividual.length >= 3 && ctx.currentPlan === 'free') {
    // Map module IDs to bundle module names
    const moduleToBundleName: Record<string, string> = {
      mod_cv: 'CV', mod_ats: 'ATS', mod_jobs: 'JOBS', mod_global: 'GLOBAL',
      mod_mobility: 'MOBILITY', mod_interview: 'INTERVIEW', mod_linkedin: 'LINKEDIN',
      mod_career: 'CAREER', mod_coach: 'COACH', mod_formation: 'FORMATION', mod_freelance: 'FREELANCE',
    }
    const usedNames = usedIndividual.map(m => moduleToBundleName[m]).filter(Boolean)

    // Find cheapest bundle covering all
    const bundles = [
      { id: 'hirenova_start', price: 9.9, modules: ['CV', 'ATS'] },
      { id: 'hirenova_career', price: 19.9, modules: ['CV', 'ATS', 'JOBS', 'GLOBAL', 'INTERVIEW', 'LINKEDIN', 'CAREER'] },
      { id: 'hirenova_professional', price: 29.9, modules: ['CV', 'ATS', 'JOBS', 'GLOBAL', 'MOBILITY', 'INTERVIEW', 'LINKEDIN', 'CAREER', 'COACH', 'FORMATION', 'FREELANCE'] },
      { id: 'hirenova_ai_power', price: 39.9, modules: ['CV', 'ATS', 'JOBS', 'GLOBAL', 'MOBILITY', 'INTERVIEW', 'LINKEDIN', 'CAREER', 'COACH', 'FORMATION', 'FREELANCE', 'Intelligence'] },
    ]

    const covering = bundles
      .filter(b => usedNames.every(n => b.modules.includes(n)))
      .sort((a, b) => a.price - b.price)

    if (covering.length > 0) {
      const best = covering[0]
      const individualTotal = usedIndividual.length * 9.9 // avg individual price
      const savings = Math.round(((individualTotal - best.price) / individualTotal) * 100)

      return {
        id: 'r6-bundle-savings',
        targetId: best.id,
        targetType: 'bundle',
        title: best.id.replace('hirenova_', '').toUpperCase(),
        description: `Économisez ${savings}% avec un bundle`,
        reason: 'Économisez avec un bundle — vos modules coûtent moins cher ensemble',
        priority: 8,
        discountPercent: savings,
        validUntil: addUrgency(7),
      }
    }
  }
  return null
}

/**
 * Rule 7: User approaching monthly limit on Start plan
 */
function ruleApproachingLimit(ctx: UserContext): UpsellRecommendation | null {
  if (ctx.currentPlan === 'hirenova_start' && (ctx.cvCount >= 3 || ctx.clCount >= 2)) {
    return {
      id: 'r7-approaching-limit',
      targetId: 'hirenova_career',
      targetType: 'bundle',
      title: 'Augmentez vos limites',
      description: 'Vous approchez votre limite mensuelle',
      reason: 'Vous approchez votre limite mensuelle',
      priority: 10, // Urgent!
      validUntil: addUrgency(1),
    }
  }
  return null
}

/**
 * Rule 8: Employer role user → B2B recruiter plans
 */
function ruleEmployerUpsell(ctx: UserContext): UpsellRecommendation | null {
  if (ctx.role === 'employer') {
    return {
      id: 'r8-employer-b2b',
      targetId: 'b2b_recruiter',
      targetType: 'b2b',
      title: 'Solutions Recruteur',
      description: 'Recrutez plus efficacement',
      reason: 'Recrutez plus efficacement avec nos solutions entreprise',
      priority: 9,
      validUntil: addUrgency(14),
    }
  }
  return null
}

/**
 * Rule 9: User registered 7+ days ago still on free → Start with urgency
 */
function ruleRegisteredFreeUrgency(ctx: UserContext): UpsellRecommendation | null {
  if (ctx.currentPlan === 'free' && ctx.daysSinceRegistration >= 7) {
    return {
      id: 'r9-registered-free',
      targetId: 'hirenova_start',
      targetType: 'bundle',
      title: 'Offre de lancement',
      description: 'Débutez pour 9.90€/mois',
      reason: 'Offre de lancement : débuter pour 9.90€/mois',
      priority: 6,
      discountPercent: 20,
      validUntil: addUrgency(2),
    }
  }
  return null
}

/**
 * Rule 10: Professional plan user → AI Power
 */
function ruleProfessionalToAIPower(ctx: UserContext): UpsellRecommendation | null {
  if (ctx.currentPlan === 'hirenova_professional') {
    return {
      id: 'r10-pro-to-ai',
      targetId: 'hirenova_ai_power',
      targetType: 'bundle',
      title: 'HIRENOVA AI POWER',
      description: 'Débloquez tout le potentiel de l\'IA avancée',
      reason: 'Débloquez tout le potentiel de l\'IA avancée',
      priority: 5,
      validUntil: addUrgency(14),
    }
  }
  return null
}

// ─── Main Exports ─────────────────────────────────────────────────────────────

/**
 * Analyzes user context and returns up to 3 upsell recommendations
 * sorted by priority (highest first).
 */
export function getRecommendations(context: UserContext): UpsellRecommendation[] {
  const rules = [
    ruleApproachingLimit,    // Urgency first
    ruleFreeUserWithCV,
    ruleFreeUserVisitedInterview,
    ruleCareerMobilityUpgrade,
    ruleBundleSavings,
    ruleFreeUserVisitedJobs,
    ruleStartPlanUpgrade,
    ruleEmployerUpsell,
    ruleRegisteredFreeUrgency,
    ruleProfessionalToAIPower,
  ]

  const all: UpsellRecommendation[] = []
  for (const rule of rules) {
    const rec = rule(context)
    if (rec) {
      all.push(rec)
    }
  }

  // Deduplicate by targetId (keep highest priority)
  const seen = new Map<string, UpsellRecommendation>()
  for (const rec of all) {
    const existing = seen.get(rec.targetId)
    if (!existing || rec.priority > existing.priority) {
      seen.set(rec.targetId, rec)
    }
  }

  // Sort by priority desc, return top 3
  return Array.from(seen.values())
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3)
}

/**
 * Returns a single banner recommendation for the top of the app,
 * or null if no recommendation applies.
 */
export function getPersonalizedBanner(context: UserContext): PersonalizedBanner | null {
  const recs = getRecommendations(context)
  if (recs.length === 0) return null

  const top = recs[0]

  const ctaMap: Record<string, string> = {
    bundle: 'Voir le plan',
    module: 'Découvrir',
    b2b: 'En savoir plus',
  }

  return {
    text: top.reason,
    cta: ctaMap[top.targetType] ?? 'En savoir plus',
    targetId: top.targetId,
    targetType: top.targetType,
  }
}
