'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Search, FileText, PenLine, Target, MessageSquare,
  Linkedin, Map, ClipboardList, Lock, Check, Loader2,
  ArrowRight, Sparkles, ChevronDown, Zap, Shield, TrendingUp,
  AlertTriangle, Crown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

// ─── Types (mirrors server types for client use) ─────────────────────────────

type CopilotStep =
  | 'analyze_offer'
  | 'match_score'
  | 'optimize_cv'
  | 'generate_cover_letter'
  | 'identify_skill_gaps'
  | 'prepare_interview'
  | 'optimize_linkedin'
  | 'career_roadmap'
  | 'track_application'

type StepStatus = 'pending' | 'running' | 'completed' | 'skipped' | 'blocked'

interface StepDefinition {
  step: CopilotStep
  label: string
  description: string
  modules: string[]
}

interface PipelineStep {
  step: CopilotStep
  status: StepStatus
  module: string
  result?: Record<string, unknown>
  error?: string
}

interface MatchScore {
  score: number
  breakdown: Record<string, number>
  grade: string
}

interface UpgradeInfo {
  targetPlan: string
  targetBundle: string
  additionalCost: number
  neededSteps: CopilotStep[]
}

interface AnalyzeResponse {
  success: boolean
  pipeline: {
    steps: PipelineStep[]
    status: string
    blockedReason?: string
  }
  accessibleSteps: CopilotStep[]
  blockedSteps: CopilotStep[]
  upgradeInfo: UpgradeInfo | null
  cheapestBundle: { name: string; price: number } | null
  matchScore: MatchScore | null
  keywordMatch: { matchedCount: number; missingCount: number } | null
  stepDefinitions: StepDefinition[]
  hasCv: boolean
}

// ─── Step Icon Map ───────────────────────────────────────────────────────────

const STEP_ICONS: Record<CopilotStep, React.ElementType> = {
  analyze_offer: Search,
  match_score: Target,
  optimize_cv: FileText,
  generate_cover_letter: PenLine,
  identify_skill_gaps: AlertTriangle,
  prepare_interview: MessageSquare,
  optimize_linkedin: Linkedin,
  career_roadmap: Map,
  track_application: ClipboardList,
}

const STEP_LABELS: Record<CopilotStep, string> = {
  analyze_offer: 'Analyse de l\'offre',
  match_score: 'HireNova Match Score™',
  optimize_cv: 'CV optimisé ATS',
  generate_cover_letter: 'Lettre de motivation',
  identify_skill_gaps: 'Compétences manquantes',
  prepare_interview: 'Préparation entretien',
  optimize_linkedin: 'Optimisation LinkedIn',
  career_roadmap: 'Feuille de route carrière',
  track_application: 'Suivi de candidature',
}

const GRADE_COLORS: Record<string, string> = {
  Excellent: 'text-emerald-600',
  Bon: 'text-emerald-500',
  Moyen: 'text-amber-500',
  Faible: 'text-orange-500',
  Insuffisant: 'text-red-500',
}

const GRADE_BG: Record<string, string> = {
  Excellent: 'bg-emerald-500',
  Bon: 'bg-emerald-400',
  Moyen: 'bg-amber-400',
  Faible: 'bg-orange-400',
  Insuffisant: 'bg-red-400',
}

const GRADE_RING: Record<string, string> = {
  Excellent: 'stroke-emerald-500',
  Bon: 'stroke-emerald-400',
  Moyen: 'stroke-amber-400',
  Faible: 'stroke-orange-400',
  Insuffisant: 'stroke-red-400',
}

// ─── Circular Score Component ────────────────────────────────────────────────

function CircularScore({ score, grade, size = 160 }: { score: number; grade: string; size?: number }) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const center = size / 2

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-100"
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className={GRADE_RING[grade] || 'stroke-emerald-500'}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`text-3xl font-bold ${GRADE_COLORS[grade] || 'text-emerald-600'}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] text-muted-foreground font-medium">/100</span>
        <span className={`text-xs font-semibold mt-0.5 ${GRADE_COLORS[grade] || ''}`}>{grade}</span>
      </div>
    </div>
  )
}

// ─── Pipeline Step Row ───────────────────────────────────────────────────────

function PipelineStepRow({
  step,
  status,
  label,
  description,
  onExecute,
  upgradePlan,
  upgradePrice,
}: {
  step: CopilotStep
  status: StepStatus
  label: string
  description: string
  onExecute?: () => void
  upgradePlan?: string
  upgradePrice?: number
}) {
  const Icon = STEP_ICONS[step]
  const isBlocked = status === 'blocked'
  const isCompleted = status === 'completed'
  const isRunning = status === 'running'
  const isPending = status === 'pending'

  return (
    <motion.div
      className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
        isBlocked
          ? 'bg-slate-50/50 border-slate-200/60'
          : isCompleted
            ? 'bg-emerald-50/50 border-emerald-200/60'
            : isRunning
              ? 'bg-emerald-50/30 border-emerald-300/60 ring-2 ring-emerald-200/40'
              : 'bg-white border-slate-200/80 hover:border-emerald-200 hover:shadow-sm'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Icon / Status Badge */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isBlocked
          ? 'bg-slate-100 text-slate-400'
          : isCompleted
            ? 'bg-emerald-100 text-emerald-600'
            : isRunning
              ? 'bg-emerald-100 text-emerald-600'
              : 'bg-emerald-50 text-emerald-500 border border-emerald-200'
      }`}>
        {isRunning ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isCompleted ? (
          <Check className="w-5 h-5" />
        ) : isBlocked ? (
          <Lock className="w-5 h-5" />
        ) : (
          <Icon className="w-5 h-5" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className={`font-semibold text-sm ${isBlocked ? 'text-slate-400' : 'text-foreground'}`}>
            {label}
          </h4>
          {isBlocked && <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-600 border-amber-200">Premium</Badge>}
        </div>
        <p className={`text-xs mt-0.5 ${isBlocked ? 'text-slate-400' : 'text-muted-foreground'}`}>
          {description}
        </p>
        {isBlocked && upgradePlan && upgradePrice && (
          <div className="flex items-center gap-2 mt-2">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs text-amber-600 font-medium">
              Disponible dans {upgradePlan} — {upgradePrice.toFixed(2)}€/mois
            </span>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="flex-shrink-0 self-center">
        {isPending && onExecute && (
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8 px-3 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
            onClick={onExecute}
          >
            Exécuter
          </Button>
        )}
        {isBlocked && (
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8 px-3 border-amber-200 text-amber-600 hover:bg-amber-50 hover:text-amber-700 cursor-pointer"
            onClick={() => {
              toast.info('Mise à niveau requise pour accéder à cette fonctionnalité.')
            }}
          >
            <Crown className="w-3 h-3 mr-1" />
            Upgrade
          </Button>
        )}
        {isCompleted && (
          <span className="text-xs text-emerald-600 font-medium">✅ Terminé</span>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main Widget ─────────────────────────────────────────────────────────────

export default function JobCopilotWidget() {
  const { data: session, status: authStatus } = useSession()
  const [jobDescription, setJobDescription] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPipeline, setShowPipeline] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Intersection observer for scroll-triggered visibility
  useEffect(() => {
    const el = widgetRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!jobDescription.trim()) {
      toast.error('Veuillez coller une offre d\'emploi.')
      return
    }
    if (!session) {
      toast.error('Connectez-vous pour utiliser le Job Copilot.')
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/copilot/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: jobDescription.trim(),
          jobTitle: jobTitle.trim() || 'Non spécifié',
          company: company.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur lors de l\'analyse.')
        if (data.code === 'AUTH_REQUIRED') {
          toast.error('Connectez-vous pour continuer.')
        }
        return
      }

      setResult(data)
      setShowPipeline(true)
    } catch {
      setError('Erreur réseau. Vérifiez votre connexion.')
    } finally {
      setIsAnalyzing(false)
    }
  }, [jobDescription, jobTitle, company, session])

  const handleStepExecute = useCallback((step: CopilotStep) => {
    toast.info(`Étape « ${STEP_LABELS[step]} » en cours de développement.`)
  }, [])

  const planName = (result?.upgradeInfo?.targetPlan || '').replace('hirenova_', 'HireNova ').replace(/_/g, ' ')
  const bundlePrice = result?.cheapestBundle?.price
  const bundleName = result?.cheapestBundle?.name

  return (
    <div ref={widgetRef} className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Main Card */}
        <Card className="border-2 border-emerald-200/60 shadow-xl shadow-emerald-900/5 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">HireNova Job Copilot</h3>
                <p className="text-emerald-100 text-xs">Collez une offre d\'emploi et obtenez une analyse complète en un clic</p>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-5">
            {/* Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Titre du poste</label>
                <Input
                  placeholder="ex: Développeur Full-Stack Senior"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Entreprise</label>
                <Input
                  placeholder="ex: HireNova"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Offre d\'emploi <span className="text-red-400">*</span></label>
              <Textarea
                placeholder={"Collez ici la description complète de l'offre d'emploi...\n\nExemple:\nNous recherchons un Développeur Full-Stack Senior (H/F) pour rejoindre notre équipe tech.\nCompétences requises : React, Node.js, TypeScript, PostgreSQL..."}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[140px] text-sm resize-none"
              />
            </div>

            {/* Analyze Button */}
            <Button
              className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm cursor-pointer"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jobDescription.trim()}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyser avec HireNova
                </>
              )}
            </Button>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs"
              >
                {error}
              </motion.div>
            )}

            {/* Results */}
            <AnimatePresence>
              {result && showPipeline && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-5 overflow-hidden"
                >
                  {/* ── Match Score ── */}
                  {result.matchScore ? (
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-emerald-100">
                      <CircularScore
                        score={result.matchScore.score}
                        grade={result.matchScore.grade}
                        size={150}
                      />
                      <div className="flex-1 space-y-3">
                        <div>
                          <h4 className="text-sm font-bold text-foreground">HireNova Match Score™</h4>
                          <p className="text-xs text-muted-foreground">
                            Score de compatibilité basé sur l\'analyse de vos compétences
                          </p>
                        </div>

                        {/* Breakdown bars */}
                        <div className="space-y-2">
                          {Object.entries(result.matchScore.breakdown).map(([key, value]) => (
                            <div key={key} className="space-y-0.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className="font-medium text-foreground">{value}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <motion.div
                                  className={`h-full rounded-full ${
                                    value >= 70 ? 'bg-emerald-500' : value >= 50 ? 'bg-amber-400' : 'bg-red-400'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${value}%` }}
                                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {result.keywordMatch && (
                          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-500" />
                              {result.keywordMatch.matchedCount} mots-clés correspondants
                            </span>
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              {result.keywordMatch.missingCount} mots-clés manquants
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : !result.hasCv ? (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">CV requis pour le Match Score</p>
                        <p className="text-xs text-amber-600 mt-0.5">
                          Créez d\'abord un CV pour obtenir votre score de compatibilité personnalisé.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {/* ── Pipeline Stepper ── */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground">Pipeline d\'analyse</h4>
                      <Badge variant="outline" className="text-[10px] border-emerald-200 text-emerald-600">
                        {result.pipeline.steps.filter((s) => s.status === 'pending' || s.status === 'completed').length} étapes accessibles
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {result.pipeline.steps.map((step, idx) => {
                        const def = result.stepDefinitions.find((d) => d.step === step.step)
                        return (
                          <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05, duration: 0.3 }}
                          >
                            <PipelineStepRow
                              step={step.step}
                              status={step.status}
                              label={def?.label || step.step}
                              description={def?.description || ''}
                              onExecute={step.status === 'pending' ? () => handleStepExecute(step.step) : undefined}
                              upgradePlan={bundleName}
                              upgradePrice={bundlePrice ?? undefined}
                            />
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>

                  {/* ── Upgrade Banner ── */}
                  {result.upgradeInfo && bundleName && bundlePrice && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="relative p-4 rounded-xl bg-gradient-to-r from-amber-50 via-amber-50/80 to-amber-50 border border-amber-200 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <Crown className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-amber-800">
                            Débloquez {result.blockedSteps.length} étapes supplémentaires
                          </h4>
                          <p className="text-xs text-amber-600 mt-0.5">
                            Passez à <span className="font-semibold">{bundleName}</span> ({bundlePrice.toFixed(2)}€/mois) pour accéder à toutes les fonctionnalités du Job Copilot.
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs cursor-pointer"
                          onClick={() => {
                            const event = new CustomEvent('scroll-to-pricing')
                            document.dispatchEvent(event)
                          }}
                        >
                          Voir les offres
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
