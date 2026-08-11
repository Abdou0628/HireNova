'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Check, FileText, Shield, Search, Globe, Plane, UserCheck,
  Linkedin, Compass, BookOpen, GraduationCap, Briefcase,
  Loader2, Rocket, Crown, Sparkles, Star, ArrowRight, Mail,
  Building2, Code2, Store, MessageSquare, Laptop, Calculator, Target, TrendingDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { CVLanguage } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import type { AppStep } from '@/store/cv-store'
import { events } from '@/lib/analytics'
import { toast } from 'sonner'

type Currency = 'eur' | 'usd' | 'gbp' | 'mad'
type BillingPeriod = 'monthly' | 'annual'

// ─── Goal Selector Types & Data ─────────────────────────────────────────────

type UserGoal = 'create_cv' | 'find_job' | 'prepare_interview' | 'develop_career' | 'freelance'

interface GoalCard {
  id: UserGoal
  icon: any
  labelKey: 'goalCreateCv' | 'goalFindJob' | 'goalPrepareInterview' | 'goalDevelopCareer' | 'goalFreelance'
  recommendedBundle: string
}

const GOALS: GoalCard[] = [
  { id: 'create_cv', icon: FileText, labelKey: 'goalCreateCv', recommendedBundle: 'hirenova_start' },
  { id: 'find_job', icon: Briefcase, labelKey: 'goalFindJob', recommendedBundle: 'hirenova_career' },
  { id: 'prepare_interview', icon: MessageSquare, labelKey: 'goalPrepareInterview', recommendedBundle: 'hirenova_career' },
  { id: 'develop_career', icon: GraduationCap, labelKey: 'goalDevelopCareer', recommendedBundle: 'hirenova_professional' },
  { id: 'freelance', icon: Laptop, labelKey: 'goalFreelance', recommendedBundle: 'hirenova_professional' },
]

// Module individual prices (EUR) for value calculation
const MODULE_PRICES: Record<string, number> = {
  CV: 9.90, ATS: 7.90, JOBS: 9.90, GLOBAL: 9.90, MOBILITY: 12.90,
  INTERVIEW: 9.90, LINKEDIN: 7.90, CAREER: 9.90, COACH: 9.90,
  FORMATION: 12.90, FREELANCE: 9.90, Intelligence: 0,
}

// Goal-specific value props
const GOAL_VALUE_PROPS: Record<UserGoal, { reason: string; savingsPercent: number }> = {
  create_cv: { reason: 'CV professionnel + analyse ATS', savingsPercent: 38 },
  find_job: { reason: '7 modules pour maximiser vos chances', savingsPercent: 60 },
  prepare_interview: { reason: 'Simulation IA + coaching entretien', savingsPercent: 54 },
  develop_career: { reason: '11 modules pour votre évolution', savingsPercent: 72 },
  freelance: { reason: 'Marketplace + coaching + formation', savingsPercent: 62 },
}

interface PricingSectionProps {
  language: CVLanguage
  currency: Currency
  onCurrencyChange: (c: Currency) => void
  session: any
  setAuthMode: (m: 'login' | 'register') => void
  setAuthModalOpen: (b: boolean) => void
  setStep: (s: AppStep) => void
  requireAuthAndPlan: (s: AppStep) => void
  checkoutLoading: string | null
  setCheckoutLoading: (s: string | null) => void
  setPaymentSuccess: (s: any) => void
}

// ─── Currency Helpers ───────────────────────────────────────────────────────

const CONVERSION: Record<Currency, number> = { eur: 1, usd: 1.08, gbp: 0.86, mad: 10.84 }
const SYMBOLS: Record<Currency, string> = { eur: '€', usd: '$', gbp: '£', mad: 'MAD' }

function convert(eur: number, currency: Currency): number {
  return Math.round(eur * CONVERSION[currency] * 100) / 100
}

function fmtPrice(eur: number, currency: Currency): string {
  const val = convert(eur, currency)
  if (currency === 'mad') return `${val} ${SYMBOLS[currency]} 🇲🇦`
  return `${SYMBOLS[currency]}${val.toFixed(2)}`
}

function fmtAnnual(eurMonthly: number, currency: Currency): string {
  const annualEur = eurMonthly * 10
  const val = convert(annualEur, currency)
  if (currency === 'mad') return `${Math.round(val)} ${SYMBOLS[currency]} 🇲🇦`
  return `${SYMBOLS[currency]}${val.toFixed(0)}`
}

// ─── B2C Bundle Data ────────────────────────────────────────────────────────

interface BundlePlan {
  id: string
  name: string
  monthlyEur: number
  color: string
  borderClass: string
  bgIcon: string
  iconColor: string
  btnClass: string
  badge: string | null
  badgeClass: string
  icon: any
  modules: string[]
  description: string
}

const BUNDLES: BundlePlan[] = [
  {
    id: 'hirenova_start',
    name: 'HIRENOVA START',
    monthlyEur: 9.9,
    color: 'emerald',
    borderClass: 'border-2 border-emerald-400',
    bgIcon: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    btnClass: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    badge: null,
    badgeClass: '',
    icon: Rocket,
    modules: ['CV', 'ATS'],
    description: 'Créez des CV professionnels et analysez votre compatibilité ATS.',
  },
  {
    id: 'hirenova_career',
    name: 'HIRENOVA CAREER',
    monthlyEur: 19.9,
    color: 'sky',
    borderClass: 'border-2 border-sky-400',
    bgIcon: 'bg-sky-100',
    iconColor: 'text-sky-600',
    btnClass: 'bg-sky-500 hover:bg-sky-600 text-white',
    badge: '⭐ Populaire',
    badgeClass: 'bg-sky-500 text-white',
    icon: Star,
    modules: ['CV', 'ATS', 'JOBS', 'GLOBAL', 'INTERVIEW', 'LINKEDIN', 'CAREER'],
    description: 'Tous les outils essentiels pour booster votre recherche d\'emploi.',
  },
  {
    id: 'hirenova_professional',
    name: 'HIRENOVA PROFESSIONNEL',
    monthlyEur: 29.9,
    color: 'violet',
    borderClass: 'border-2 border-violet-400',
    bgIcon: 'bg-violet-100',
    iconColor: 'text-violet-600',
    btnClass: 'bg-violet-500 hover:bg-violet-600 text-white',
    badge: 'Best Value',
    badgeClass: 'bg-violet-500 text-white',
    icon: Crown,
    modules: ['CV', 'ATS', 'JOBS', 'GLOBAL', 'MOBILITY', 'INTERVIEW', 'LINKEDIN', 'CAREER', 'COACH', 'FORMATION', 'FREELANCE', 'Intelligence'],
    description: 'L\'expérience complète : coaching, formation, freelance et plus.',
  },
  {
    id: 'hirenova_ai_power',
    name: 'HIRENOVA AI POWER',
    monthlyEur: 39.9,
    color: 'amber',
    borderClass: 'border-2 border-amber-400',
    bgIcon: 'bg-amber-100',
    iconColor: 'text-amber-600',
    btnClass: 'bg-amber-500 hover:bg-amber-600 text-white',
    badge: 'Premium',
    badgeClass: 'bg-amber-500 text-white',
    icon: Sparkles,
    modules: ['CV', 'ATS', 'JOBS', 'GLOBAL', 'MOBILITY', 'INTERVIEW', 'LINKEDIN', 'CAREER', 'COACH', 'FORMATION', 'FREELANCE', 'Intelligence', 'AI Intelligence', 'AI Chatbot Advanced', 'IA avancées'],
    description: 'La puissance maximale avec tous les modules IA avancés inclus.',
  },
]

// ─── Individual Module Data ─────────────────────────────────────────────────

interface IndividualModule {
  id: string
  name: string
  monthlyEur: number
  icon: any
  shortDesc: string
  fullDesc: string
  features: string[]
}

const MODULES: IndividualModule[] = [
  {
    id: 'mod_cv', name: 'CV', monthlyEur: 9.9, icon: FileText,
    shortDesc: 'Générateur de CV IA professionnel',
    fullDesc: 'Créez des CV professionnels optimisés pour chaque candidature avec notre intelligence artificielle avancée. Templates modernes, export PDF et Word.',
    features: ['Templates modernes', 'Export PDF & Word', 'Optimisation IA', 'Aperçu en temps réel', 'Multi-langues'],
  },
  {
    id: 'mod_ats', name: 'ATS', monthlyEur: 7.9, icon: Shield,
    shortDesc: 'Analyse de compatibilité ATS',
    fullDesc: 'Analysez la compatibilité de votre CV avec les systèmes ATS des entreprises. Recevez des recommandations précises pour améliorer votre score.',
    features: ['Score de compatibilité', 'Recommandations IA', 'Keywords manquants', 'Comparaison par offre'],
  },
  {
    id: 'mod_jobs', name: 'JOBS', monthlyEur: 9.9, icon: Search,
    shortDesc: 'Marketplace d\'offres d\'emploi',
    fullDesc: 'Parcourez des milliers d\'offres d\'emploi en France et à l\'international. Filtres avancés, alertes personnalisées et candidature en un clic.',
    features: ['Offres en temps réel', 'Filtres avancés', 'Alertes email', 'Candidature simplifiée', 'Suivi des candidatures'],
  },
  {
    id: 'mod_global', name: 'GLOBAL', monthlyEur: 9.9, icon: Globe,
    shortDesc: 'Recrutement international',
    fullDesc: 'Accédez à des opportunités dans le monde entier. Offres internationales, visa, relocation et accompagnement personnalisé.',
    features: ['Offres mondiales', 'Guide visa & relocation', 'Matching IA international', 'Alertes par pays'],
  },
  {
    id: 'mod_mobility', name: 'MOBILITY', monthlyEur: 12.9, icon: Plane,
    shortDesc: 'OCR & Analyse de documents',
    fullDesc: 'Pipeline IA complet pour l\'analyse de vos documents de mobilité. OCR avancé, traitement NLP et scoring automatique.',
    features: ['OCR haute précision', 'Pipeline NLP', 'Scoring automatique', 'Multi-formats supportés'],
  },
  {
    id: 'mod_interview', name: 'INTERVIEW', monthlyEur: 9.9, icon: UserCheck,
    shortDesc: 'Simulateur d\'entretien IA',
    fullDesc: 'Préparez-vous aux entretiens avec notre simulateur IA. Questions personnalisées, feedback en temps réel et coaching vocal.',
    features: ['Simulation IA réaliste', 'Feedback instantané', 'Entraînement vocal', 'Questions par métier', 'Suivi de progression'],
  },
  {
    id: 'mod_linkedin', name: 'LINKEDIN', monthlyEur: 7.9, icon: Linkedin,
    shortDesc: 'Optimisation profil LinkedIn',
    fullDesc: 'Analysez et optimisez votre profil LinkedIn avec l\'IA. Génération de résumés percutants et conseils d\'optimisation.',
    features: ['Analyse IA du profil', 'Génération de résumé', 'Conseils d\'optimisation', 'Benchmark vs concurrents'],
  },
  {
    id: 'mod_career', name: 'CAREER', monthlyEur: 9.9, icon: Compass,
    shortDesc: 'Feuille de route de carrière',
    fullDesc: 'Planifiez votre évolution professionnelle avec des assessments IA, des roadmaps personnalisées et une analyse de vos compétences.',
    features: ['Assessment IA', 'Roadmap personnalisée', 'Analyse compétences', 'Objectifs de carrière'],
  },
  {
    id: 'mod_coach', name: 'COACH', monthlyEur: 9.9, icon: BookOpen,
    shortDesc: 'Coach de carrière IA',
    fullDesc: 'Votre coach de carrière personnel alimenté par l\'IA. Sessions de coaching, définition d\'objectifs et suivi de progression.',
    features: ['Sessions coaching IA', 'Définition d\'objectifs', 'Historique & suivi', 'Plan d\'action personnalisé'],
  },
  {
    id: 'mod_formation', name: 'FORMATION', monthlyEur: 12.9, icon: GraduationCap,
    shortDesc: 'Formation & Certification',
    fullDesc: 'Catalogue de formations et certifications pour développer vos compétences. Parcours personnalisés selon vos objectifs.',
    features: ['Catalogue riche', 'Parcours personnalisés', 'Certification IA', 'Suivi de progression'],
  },
  {
    id: 'mod_freelance', name: 'FREELANCE', monthlyEur: 9.9, icon: Briefcase,
    shortDesc: 'Marketplace freelance',
    fullDesc: 'Trouvez des missions freelance ou recrutez des talents. Matching IA, gestion de contrats et paiement sécurisé.',
    features: ['Missions freelance', 'Matching IA', 'Gestion contrats', 'Paiement sécurisé', 'Dashboard freelance'],
  },
]

// ─── B2B Data (raw EUR prices — computed at render time) ───────────────────

interface B2BTier {
  name: string
  monthlyEur: number | null  // null = custom pricing ("Sur devis")
  minMonthlyEur?: number      // for "X+" tiers (e.g. campus/whitelabel enterprise)
  description: string
  features: string[]
}

const B2B: Record<string, { label: string; icon: any; tiers: B2BTier[] }> = {
  recruiter: {
    label: 'Recruteur',
    icon: Building2,
    tiers: [
      { name: 'Starter', monthlyEur: 99, description: 'Petites entreprises', features: ['5 offres d\'emploi actives', 'Dashboard recruteur', 'Recherche candidats', 'Export CSV'] },
      { name: 'Professional', monthlyEur: 249, description: 'Agences de recrutement', features: ['25 offres actives', 'Pipeline IA', 'Matching avancé', 'Support prioritaire', 'Multi-utilisateurs'] },
      { name: 'Business', monthlyEur: 499, description: 'Multi-recruteurs', features: ['Offres illimitées', 'API intégrée', 'SSO', 'Support dédié', 'Rapports avancés'] },
      { name: 'Enterprise', monthlyEur: null, description: 'Solutions sur mesure', features: ['Tout illimité', 'SLA garanti', 'Intégration custom', 'Account manager dédié', 'Formation équipe'] },
    ],
  },
  campus: {
    label: 'Campus SaaS',
    icon: GraduationCap,
    tiers: [
      { name: 'Starter', monthlyEur: 299, description: 'Écoles & universités', features: ['500 étudiants max', 'CV center', 'ATS intégré', 'Statistiques de base'] },
      { name: 'Professional', monthlyEur: 699, description: 'Grands campus', features: ['2 000 étudiants', 'Job board intégré', 'Analytics avancés', 'Branding custom', 'API access'] },
      { name: 'Enterprise', monthlyEur: 1499, minMonthlyEur: 1499, description: 'Réseaux d\'écoles', features: ['Étudiants illimités', 'Multi-campus', 'White label partiel', 'SSO & LMS', 'Support dédié 24/7'] },
    ],
  },
  whitelabel: {
    label: 'White Label',
    icon: Store,
    tiers: [
      { name: 'Starter', monthlyEur: 499, description: 'Marque propre', features: ['Branding complet', 'Domaine custom', 'Modules au choix', 'Support standard'] },
      { name: 'Pro', monthlyEur: 999, description: 'Déploiement complet', features: ['Tout Starter +', 'API full access', 'Analytics avancés', 'Support prioritaire', 'Formation équipe'] },
      { name: 'Enterprise', monthlyEur: 2500, minMonthlyEur: 2500, description: 'Solution clé en main', features: ['Tout Pro +', 'Source code access', 'SLA 99.9%', 'Account manager dédié', 'Développement custom'] },
    ],
  },
  api: {
    label: 'API',
    icon: Code2,
    tiers: [
      { name: 'Starter', monthlyEur: 49, description: 'Intégration basique', features: ['1 000 requêtes/mois', 'Endpoints CV', 'Documentation', 'Support email'] },
      { name: 'Pro', monthlyEur: 149, description: 'Intégration avancée', features: ['10 000 requêtes/mois', 'Tous les endpoints', 'Webhooks', 'Support prioritaire'] },
      { name: 'Business', monthlyEur: 399, description: 'Volume élevé', features: ['50 000 requêtes/mois', 'Rate limiting custom', 'SLA garanti', 'Account manager', 'Analytics API'] },
    ],
  },
}

// ─── B2B Price Computation (mirrors pricing-engine.ts formatTierPriceRaw) ───

const B2B_ANNUAL_MULTIPLIER = 10 // 17% savings

function computeB2BPrice(tier: B2BTier, currency: Currency, billing: BillingPeriod): string {
  if (tier.monthlyEur === null) return 'Sur devis'

  const rate = CONVERSION[currency]
  const sym = SYMBOLS[currency]
  const multiplier = billing === 'annual' ? B2B_ANNUAL_MULTIPLIER : 1
  const amount = Math.round(tier.monthlyEur * rate * multiplier * 100) / 100
  const period = billing === 'annual' ? '/an' : '/mois'
  const isMin = !!tier.minMonthlyEur

  if (currency === 'mad') {
    const val = Math.round(amount)
    return isMin ? `${val}+ ${sym}${period}` : `${val} ${sym}${period}`
  }

  if (billing === 'annual') {
    const val = Math.round(amount)
    return isMin ? `${sym}${val}+${period}` : `${sym}${val}${period}`
  }

  return isMin ? `${sym}${amount.toFixed(2)}+${period}` : `${sym}${amount.toFixed(2)}${period}`
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function PricingSection({
  language,
  currency,
  onCurrencyChange,
  session,
  setAuthMode,
  setAuthModalOpen,
  setStep,
  requireAuthAndPlan,
  checkoutLoading,
  setCheckoutLoading,
  setPaymentSuccess,
}: PricingSectionProps) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
  const [selectedModule, setSelectedModule] = useState<IndividualModule | null>(null)
  const [checkoutSuccessId, setCheckoutSuccessId] = useState<string | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | null>(null)
  const bundleCardsRef = useRef<HTMLDivElement>(null)

  const isAnnual = billingPeriod === 'annual'
  const isLoggedIn = !!session?.user

  // Derive recommended bundle from selected goal
  const recommendedBundleId = selectedGoal ? GOALS.find(g => g.id === selectedGoal)?.recommendedBundle ?? null : null

  // Calculate value for the selected goal
  function getGoalValueCalc() {
    if (!selectedGoal) return null
    const goal = GOALS.find(g => g.id === selectedGoal)
    if (!goal) return null
    const bundle = BUNDLES.find(b => b.id === goal.recommendedBundle)
    if (!bundle) return null

    const individualTotal = bundle.modules.reduce((sum, mod) => sum + (MODULE_PRICES[mod] ?? 0), 0)
    const bundleCost = isAnnual ? bundle.monthlyEur * 10 : bundle.monthlyEur
    const savings = individualTotal - bundleCost
    const savingsPct = individualTotal > 0 ? Math.round((savings / individualTotal) * 100) : 0
    const goalProps = GOAL_VALUE_PROPS[selectedGoal]

    return {
      bundleName: bundle.name,
      moduleCount: bundle.modules.length,
      individualTotal,
      bundleCost,
      savings: Math.max(0, savings),
      savingsPct: Math.max(0, savingsPct),
      reason: goalProps?.reason ?? '',
      formattedIndividual: fmtPrice(individualTotal, currency),
      formattedBundle: isAnnual ? fmtAnnual(bundle.monthlyEur, currency) : fmtPrice(bundle.monthlyEur, currency),
      formattedSavings: fmtPrice(Math.max(0, savings), currency),
    }
  }

  const valueCalc = getGoalValueCalc()

  function handleGoalSelect(goal: UserGoal) {
    if (selectedGoal === goal) {
      setSelectedGoal(null)
      return
    }
    setSelectedGoal(goal)
    // Scroll to recommended bundle after a short delay
    setTimeout(() => {
      const el = document.getElementById(`bundle-${GOALS.find(g => g.id === goal)?.recommendedBundle}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  async function handleCheckout(planId: string) {
    if (!isLoggedIn) {
      setAuthMode('register')
      setAuthModalOpen(true)
      return
    }
    setCheckoutLoading(planId)
    events.checkoutStarted(planId, 0, currency)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: planId, currency, billing: billingPeriod }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.code === 'DEV_PAYMENT' && data.success) {
        setPaymentSuccess(data.data)
        setCheckoutSuccessId(planId)
        toast.success(`Paiement réussi — ${data.data.planLabel || planId} activé. Facture ${data.data.invoice.number} générée.`)
      } else {
        toast.error(data.error || 'Erreur lors du paiement')
      }
    } catch {
      toast.error('Erreur de connexion au serveur de paiement')
    } finally {
      setCheckoutLoading(null)
    }
  }

  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-br from-amber-50/50 via-white to-emerald-50/30">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-200/20 to-transparent rounded-full blur-3xl" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Header ─── */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Nos Offres
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Choisissez le plan qui correspond à vos besoins. Tous les plans incluent un accès complet aux modules sélectionnés.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center rounded-lg bg-muted p-1 mb-4">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={[
                'px-5 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer',
                billingPeriod === 'monthly'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              MENSUEL
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={[
                'px-5 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer flex items-center gap-2',
                billingPeriod === 'annual'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              ANNUEL
              <span className="text-xs text-emerald-600 font-medium">
                — ÉCONOMISEZ JUSQU'À 17%
              </span>
            </button>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center justify-center gap-2">
            {([['eur', 'EUR €'], ['usd', 'USD $'], ['gbp', 'GBP £'], ['mad', 'MAD 🇲🇦']] as [Currency, string][]).map(([c, label]) => (
              <button
                key={c}
                onClick={() => onCurrencyChange(c)}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                  currency === c
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ─── Goal Selector ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                {t(language, 'goalQuestion')}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {t(language, 'selectYourGoal')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {GOALS.map((goal, i) => {
              const GoalIcon = goal.icon
              const isSelected = selectedGoal === goal.id
              const isRecommended = recommendedBundleId === goal.recommendedBundle && selectedGoal !== null
              return (
                <motion.button
                  key={goal.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  onClick={() => handleGoalSelect(goal.id)}
                  className={[
                    'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer group',
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-500/10'
                      : 'border-muted hover:border-emerald-300 hover:bg-emerald-50/50',
                  ].join(' ')}
                >
                  <div className={[
                    'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                    isSelected ? 'bg-emerald-100' : 'bg-muted group-hover:bg-emerald-100',
                  ].join(' ')}>
                    <GoalIcon className={[
                      'w-5 h-5 transition-colors',
                      isSelected ? 'text-emerald-600' : 'text-muted-foreground group-hover:text-emerald-600',
                    ].join(' ')} />
                  </div>
                  <span className={[
                    'text-xs font-semibold text-center leading-tight',
                    isSelected ? 'text-emerald-700' : 'text-muted-foreground group-hover:text-foreground',
                  ].join(' ')}>
                    {t(language, goal.labelKey)}
                  </span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* ─── Value Calculator Summary ─── */}
        {selectedGoal && valueCalc && (
          <motion.div
            initial={{ opacity: 0, y: 15, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-white overflow-hidden">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <Calculator className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground mb-1">
                      {t(language, 'valueCalculatorTitle')}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground">{valueCalc.bundleName}</span>
                      {' — '}{valueCalc.reason}
                      {'. '}{valueCalc.moduleCount} {t(language, 'includesModules').toLowerCase()}
                      {' — '}{t(language, 'bundleCost').toLowerCase()}
                      {' '}
                      <span className="font-bold text-emerald-600">{valueCalc.formattedBundle}</span>
                      {' '}{isAnnual ? '/an' : '/mois'}
                      {' au lieu de '}
                      <span className="line-through text-muted-foreground">{valueCalc.formattedIndividual}</span>
                      {' — '}
                      <span className="font-bold text-emerald-600">{t(language, 'youSave').toLowerCase()} {valueCalc.savingsPct}%</span>
                      {' ('}{valueCalc.formattedSavings}{')'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedGoal(null)}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ─── B2C Bundles ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 items-stretch max-w-6xl mx-auto mb-16">
          {BUNDLES.map((plan, i) => {
            const Icon = plan.icon
            const isPopular = plan.id === 'hirenova_career'
            const isGoalRecommended = recommendedBundleId === plan.id
            return (
              <motion.div
                key={plan.id}
                id={`bundle-${plan.id}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={isPopular ? 'lg:-mt-2' : ''}
              >
                <Card
                  className={[
                    'relative h-full bg-white transition-all duration-300',
                    isGoalRecommended
                      ? 'border-2 border-emerald-500 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-500/20'
                      : plan.borderClass,
                    isPopular && !isGoalRecommended ? 'shadow-lg shadow-sky-500/20' : '',
                  ].join(' ')}
                >
                  {/* Goal recommendation badge — shows above the normal badge */}
                  {isGoalRecommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-emerald-600 text-white px-3 py-0.5 text-[10px] font-bold rounded-full shadow-sm flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {t(language, 'recommendedForYou')}
                      </Badge>
                    </div>
                  )}
                  {!isGoalRecommended && plan.badge && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <Badge className={`${plan.badgeClass} px-3 py-0.5 text-[10px] font-semibold rounded-full shadow-sm`}>
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  <CardContent className={['p-5 sm:p-6 flex flex-col h-full', (isGoalRecommended || plan.badge) ? 'pt-7' : ''].join(' ')}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-9 h-9 rounded-lg ${plan.bgIcon} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${plan.iconColor}`} />
                      </div>
                      <h3 className="text-sm font-bold text-foreground leading-tight">{plan.name}</h3>
                    </div>

                    <div className="mb-1">
                      {isAnnual ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-foreground">{fmtAnnual(plan.monthlyEur, currency)}</span>
                          <span className="text-muted-foreground text-xs">/an</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-foreground">{fmtPrice(plan.monthlyEur, currency)}</span>
                          <span className="text-muted-foreground text-xs">/mois</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>

                    <div className="space-y-2 mb-6 flex-grow">
                      {plan.modules.map((mod) => (
                        <div key={mod} className="flex items-start gap-2 text-xs">
                          <Check className={`w-3.5 h-3.5 ${plan.iconColor} mt-0.5 shrink-0`} />
                          <span className="text-muted-foreground">{mod}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className={`w-full rounded-xl py-3 text-sm font-semibold cursor-pointer transition-all ${plan.btnClass}`}
                      onClick={() => handleCheckout(plan.id)}
                      disabled={checkoutLoading === plan.id}
                    >
                      {checkoutLoading === plan.id ? (
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      ) : checkoutSuccessId === plan.id ? (
                        <Check className="mr-2 w-4 h-4" />
                      ) : (
                        <Icon className="mr-1.5 w-3.5 h-3.5" />
                      )}
                      {checkoutSuccessId === plan.id
                        ? 'ACTIVÉ'
                        : isAnnual
                          ? `${fmtAnnual(plan.monthlyEur, currency)}/an`
                          : 'COMMENCER'
                      }
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* ─── Individual Modules ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-3">
            Vous préférez choisir vos modules ?
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-xl mx-auto">
            Sélectionnez uniquement les modules dont vous avez besoin. Combinez-les librement.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {MODULES.map((mod, i) => {
              const Icon = mod.icon
              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Card
                    className="h-full border hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
                    onClick={() => setSelectedModule(mod)}
                  >
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                          <Icon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground">{mod.name}</h4>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{mod.shortDesc}</p>
                        </div>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {isAnnual
                            ? <><span className="font-bold text-foreground">{fmtAnnual(mod.monthlyEur, currency)}</span>/an</>
                            : <><span className="font-bold text-foreground">{fmtPrice(mod.monthlyEur, currency)}</span>/mois</>
                          }
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          DÉCOUVRIR <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* ─── B2B Section ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-3">
            HireNova Business
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-xl mx-auto">
            Solutions professionnelles pour les recruteurs, campus et entreprises.
          </p>

          <Tabs defaultValue="recruiter" className="w-full">
            <TabsList className="mx-auto grid w-full max-w-lg grid-cols-4 mb-6">
              {Object.entries(B2B).map(([key, val]) => {
                const TabIcon = val.icon
                return (
                  <TabsTrigger key={key} value={key} className="text-xs sm:text-sm gap-1">
                    <TabIcon className="w-3.5 h-3.5 hidden sm:inline" />
                    <span className="truncate">{val.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {Object.entries(B2B).map(([key, section]) => (
              <TabsContent key={key} value={key}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                  {section.tiers.map((tier, i) => {
                    const TabIcon = section.icon
                    return (
                      <motion.div
                        key={tier.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.3, delay: i * 0.06 }}
                      >
                        <Card className="h-full border hover:shadow-md transition-shadow">
                          <CardContent className="p-5 flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                <TabIcon className="w-4 h-4 text-slate-600" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-foreground">{tier.name}</h4>
                                <p className="text-[11px] text-muted-foreground">{tier.description}</p>
                              </div>
                            </div>
                            <div className="mb-4">
                              <span className="text-2xl font-extrabold text-foreground">{computeB2BPrice(tier, currency, billingPeriod)}</span>
                            </div>
                            <div className="space-y-2 mb-6 flex-grow">
                              {tier.features.map((f) => (
                                <div key={f} className="flex items-start gap-2 text-xs">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                  <span className="text-muted-foreground">{f}</span>
                                </div>
                              ))}
                            </div>
                            {tier.monthlyEur === null ? (
                              <Button
                                variant="outline"
                                className="w-full rounded-xl py-2.5 text-sm font-semibold cursor-pointer border-slate-300 text-slate-700 hover:bg-slate-50"
                                onClick={() => {
                                  toast.info('Un conseiller vous contactera sous 24h.', { duration: 4000 })
                                }}
                              >
                                <Mail className="mr-1.5 w-3.5 h-3.5" />
                                Nous contacter
                              </Button>
                            ) : (
                              <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 text-sm font-semibold cursor-pointer transition-all"
                                onClick={() => {
                                  toast.info('Un conseiller vous contactera sous 24h pour configurer votre abonnement.', { duration: 4000 })
                                }}
                              >
                                Demander un devis
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

      </div>

      {/* ─── Module Detail Dialog ─── */}
      <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedModule && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    {(() => { const Icon = selectedModule.icon; return <Icon className="w-5 h-5 text-emerald-600" /> })()}
                  </div>
                  <div>
                    <DialogTitle className="text-lg">{selectedModule.name}</DialogTitle>
                    <DialogDescription>{selectedModule.shortDesc}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{selectedModule.fullDesc}</p>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Fonctionnalités incluses :</h4>
                  <div className="space-y-1.5">
                    {selectedModule.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-lg font-bold text-foreground">
                    {isAnnual
                      ? <>{fmtAnnual(selectedModule.monthlyEur, currency)}/an</>
                      : <>{fmtPrice(selectedModule.monthlyEur, currency)}/mois</>
                    }
                  </div>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-2.5 text-sm font-semibold cursor-pointer"
                    disabled={checkoutLoading === selectedModule.id}
                    onClick={() => {
                      handleCheckout(selectedModule.id)
                      setSelectedModule(null)
                    }}
                  >
                    {checkoutLoading === selectedModule.id ? (
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    ) : checkoutSuccessId === selectedModule.id ? (
                      <Check className="mr-2 w-4 h-4" />
                    ) : null}
                    {checkoutSuccessId === selectedModule.id ? 'ACTIVÉ' : 'COMMENCER'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
