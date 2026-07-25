'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Globe, Shield, PenLine, ArrowRight, FileText, Star, Languages, Check, X, Crown, Zap, Loader2, LayoutTemplate, Download, GraduationCap, Briefcase, Rocket, Plane, UserCheck, Award, Bot, MessageCircle, Linkedin, Search, Compass, BookOpen, Laptop, ChevronDown, HelpCircle, Users, ThumbsUp, Lock } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCVStore, type PersonaType } from '@/store/cv-store'
import { t } from '@/lib/i18n'
import type { CVLanguage, TranslationKey } from '@/lib/i18n'
import ProfileButton from '@/components/auth/profile-button'
import AuthModal from '@/components/auth/auth-modal'
import AdminDashboard from '@/components/admin/admin-dashboard'
import { useSession } from 'next-auth/react'

const flagEmoji: Record<CVLanguage, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  ar: '🇸🇦',
  es: '🇪🇸',
}

const features = [
  { icon: Sparkles, titleKey: 'feature1Title' as const, descKey: 'feature1Desc' as const },
  { icon: Globe, titleKey: 'feature2Title' as const, descKey: 'feature2Desc' as const },
  { icon: Shield, titleKey: 'feature3Title' as const, descKey: 'feature3Desc' as const },
  { icon: PenLine, titleKey: 'clFeatureTitle' as const, descKey: 'clFeatureDesc' as const },
]

function StatCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => setCount(data.total || 0))
      .catch(() => {})
  }, [])

  return (
    <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
      {count}
    </div>
  )
}

const staticStats = [
  { value: '4', icon: Languages, label: { fr: 'Langues', en: 'Languages', ar: 'لغات', es: 'Idiomas' } },
  { value: '3', icon: LayoutTemplate, label: { fr: 'Templates', en: 'Templates', ar: 'قوالب', es: 'Plantillas' } },
  { value: '2', icon: Download, label: { fr: 'Formats (PDF, Word)', en: 'Formats (PDF, Word)', ar: 'صيغ (PDF, Word)', es: 'Formatos (PDF, Word)' } },
]

interface PricingFeature {
  key: TranslationKey
  pro: boolean | string
  annual: boolean | string
}

const pricingFeatures: PricingFeature[] = [
  { key: 'pricingCv', pro: '∞', annual: '∞' },
  { key: 'pricingTemplates', pro: '3', annual: '3' },
  { key: 'pricingPdf', pro: true, annual: true },
  { key: 'pricingWord', pro: true, annual: true },
  { key: 'pricingCoverLetter', pro: true, annual: true },
  { key: 'pricingNoWatermark', pro: true, annual: true },
  { key: 'pricingAtsScore', pro: true, annual: true },
  { key: 'pricingPriority', pro: true, annual: true },
]

// FAQ Accordion Item Component
function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer group"
          aria-expanded={isOpen}
        >
          <div className="flex items-start gap-3 min-w-0">
            <span className="shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
              {index + 1}
            </span>
            <h3 className="font-semibold text-foreground text-sm sm:text-base leading-snug">{question}</h3>
          </div>
          <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-0 ml-10">
                <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

export default function Landing() {
  const { setStep, language, setLanguage, setSelectedPersona } = useCVStore()
  const personasRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)

  function scrollToPersonas() {
    personasRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  function scrollToPricing() {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  const { data: session } = useSession()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register')
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [currency, setCurrency] = useState<'eur' | 'usd' | 'gbp'>('eur')
  const [pendingAction, setPendingAction] = useState<'form' | 'clForm' | null>(null)
  const [adminEmail, setAdminEmail] = useState('')
  const [isAdminOpen, setIsAdminOpen] = useState(false)

  const isUsd = currency === 'usd'
  const isGbp = currency === 'gbp'

  const userPlan = (session?.user as { plan?: string } | undefined)?.plan ?? 'free'
  const isLoggedIn = !!session?.user
  const hasActivePlan = userPlan === 'pro' || userPlan === 'annual' || userPlan === 'lifetime'

  function requireAuthAndPlan(action: 'form' | 'clForm') {
    if (!isLoggedIn) {
      setPendingAction(action)
      setAuthMode('register')
      setAuthModalOpen(true)
      return
    }
    if (!hasActivePlan) {
      toast.warning(t(language, 'subscriptionRequiredDesc'), { duration: 4000 })
      scrollToPricing()
      return
    }
    if (action === 'clForm') {
      setStep('clForm')
    }
  }

  function handleAuthSuccess() {
    // After login/register, check plan and execute pending action
    if (pendingAction && hasActivePlan) {
      if (pendingAction === 'clForm') {
        setStep('clForm')
      }
      setPendingAction(null)
    } else if (pendingAction && !hasActivePlan) {
      // User logged in but no paid plan yet
      setTimeout(() => {
        toast.warning(t(language, 'subscriptionRequiredDesc'), { duration: 4000 })
        scrollToPricing()
      }, 500)
      setPendingAction(null)
    }
  }

  // Listen for scroll-to-pricing custom event from profile button
  useEffect(() => {
    const handler = () => {
      setStep('landing')
      setTimeout(scrollToPricing, 100)
    }
    document.addEventListener('scroll-to-pricing', handler)
    return () => document.removeEventListener('scroll-to-pricing', handler)
  }, [setStep])

  // Fetch admin email config
  useEffect(() => {
    fetch('/api/admin/config')
      .then((r) => r.json())
      .then((data) => {
        if (data.adminEmail) setAdminEmail(data.adminEmail)
      })
      .catch(() => {})
  }, [])

  const isAdmin = !!adminEmail && session?.user?.email === adminEmail

  async function handleCheckout(planType: 'pro' | 'annual') {
    if (!session?.user) {
      setAuthMode('register')
      setAuthModalOpen(true)
      return
    }
    setCheckoutLoading(planType)
    try {
      // LemonSqueezy for EUR/USD
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType, currency }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.code === 'PAYMENT_NOT_READY') {
        toast.info(data.error, { duration: 5000 })
      } else {
        toast.error(data.error || 'Erreur')
      }
    } catch {
      toast.error('Erreur de connexion')
    } finally {
      setCheckoutLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <Image src="/hirenova-logo.png" alt="HireNova" width={36} height={36} className="rounded-lg" />
              <span className="text-[9px] font-semibold text-emerald-600 tracking-wide">POWERED BY IA</span>
            </div>
            <span className="text-lg font-bold text-foreground">{t(language, 'siteTitle')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {(Object.keys(flagEmoji) as CVLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    language === lang
                      ? 'bg-white shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="mr-1">{flagEmoji[lang]}</span>
                  <span className="hidden sm:inline">{lang.toUpperCase()}</span>
                </button>
              ))}
            </div>
            {isAdmin && (
              <Button
                variant="outline"
                size="icon"
                className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer transition-all"
                onClick={() => setIsAdminOpen(true)}
                aria-label="Admin Dashboard"
              >
                <Shield className="w-4 h-4" />
              </Button>
            )}
            <ProfileButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50/30 to-amber-50/20">
          {/* Background image + overlay */}
          <div className="absolute inset-0 -z-10">
            <Image src="/images/hero-career.jpg" alt="" fill className="object-cover opacity-[0.38]" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white/50" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/15 to-white/45" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-emerald-200/20 via-teal-100/15 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-amber-200/15 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-emerald-200">
                  <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                  <span>{t(language, 'freeNoSignup')}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mb-6"
              >
                <div className="inline-flex items-center gap-2 bg-white text-muted-foreground px-4 py-1.5 rounded-full text-xs font-medium border border-emerald-200 shadow-sm">
                  <Languages className="w-3.5 h-3.5 text-emerald-600" />
                  <span>🇫🇷 🇬🇧 🇪🇸 🇸🇦</span>
                  <span className="text-emerald-700">{t(language, 'availableLangs')}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="mb-6"
              >
                <div className="flex flex-col items-center">
                  <Image src="/hirenova-logo.png" alt="HireNova" width={80} height={80} className="rounded-2xl shadow-lg shadow-emerald-600/20 mx-auto" />
                  <span className="text-[10px] font-semibold text-emerald-600 tracking-widest mt-1">POWERED BY IA</span>
                </div>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {t(language, 'siteTitle')}
                <span className="block text-emerald-600 mt-2">{t(language, 'siteSubtitle')}</span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {t(language, 'siteDescription')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all cursor-pointer"
                  onClick={() => requireAuthAndPlan('form')}
                >
                  <FileText className="mr-2 w-5 h-5" />
                  {t(language, 'ctaChooseProfile')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg rounded-xl transition-all cursor-pointer"
                  onClick={() => requireAuthAndPlan('clForm')}
                >
                  <PenLine className="mr-2 w-5 h-5" />
                  {t(language, 'clCta')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              className="mt-16 grid grid-cols-4 gap-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-center">
                <StatCounter />
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{{ fr: 'Documents générés', en: 'Documents generated', ar: 'مستندات تم إنشاؤها', es: 'Documentos generados' }[language]}</div>
              </div>
              {staticStats.map((stat) => (
                <div key={stat.value} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label[language]}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Persona Selection Section */}
        <section ref={personasRef} className="relative py-16 sm:py-20 bg-gradient-to-b from-white to-emerald-50/50">
          <div className="absolute inset-0 -z-10">
            <Image src="/images/hero-coaching.jpg" alt="" fill className="object-cover opacity-[0.22]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/75 to-emerald-50/50" />
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Qui êtes-vous ?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Sélectionnez votre profil pour un CV personnalisé</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {([{
                type: 'student' as PersonaType,
                emoji: '\uD83C\uDF93',
                icon: GraduationCap,
                nameKey: 'personaStudent' as TranslationKey,
                descKey: 'personaStudentDesc' as TranslationKey,
                color: 'emerald',
              }, {
                type: 'graduate' as PersonaType,
                emoji: '\uD83C\uDF1F',
                icon: Award,
                nameKey: 'personaGraduate' as TranslationKey,
                descKey: 'personaGraduateDesc' as TranslationKey,
                color: 'blue',
              }, {
                type: 'professional' as PersonaType,
                emoji: '\uD83D\uDCBC',
                icon: Briefcase,
                nameKey: 'personaProfessional' as TranslationKey,
                descKey: 'personaProfessionalDesc' as TranslationKey,
                color: 'violet',
              }, {
                type: 'executive' as PersonaType,
                emoji: '\uD83D\uDC54',
                icon: UserCheck,
                nameKey: 'personaExecutive' as TranslationKey,
                descKey: 'personaExecutiveDesc' as TranslationKey,
                color: 'amber',
              }, {
                type: 'freelance' as PersonaType,
                emoji: '\uD83D\uDE80',
                icon: Rocket,
                nameKey: 'personaFreelance' as TranslationKey,
                descKey: 'personaFreelanceDesc' as TranslationKey,
                color: 'rose',
              }, {
                type: 'expat' as PersonaType,
                emoji: '\u2708\uFE0F',
                icon: Plane,
                nameKey: 'personaExpat' as TranslationKey,
                descKey: 'personaExpatDesc' as TranslationKey,
                color: 'sky',
              }]).map((persona, index) => (
                <motion.div
                  key={persona.type}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <Card
                    className="h-full cursor-pointer hover:shadow-lg transition-all border-2 hover:border-emerald-400 group min-w-0 overflow-hidden"
                    onClick={() => {
                      if (!isLoggedIn) {
                        setPendingAction('form')
                        setAuthMode('register')
                        setAuthModalOpen(true)
                        return
                      }
                      if (!hasActivePlan) {
                        toast.warning(t(language, 'subscriptionRequiredDesc'), { duration: 4000 })
                        scrollToPricing()
                        return
                      }
                      setSelectedPersona(persona.type)
                      setStep('form')
                    }}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-${persona.color}-100 flex items-center justify-center shrink-0`}
                        >
                          <span className="text-xl">{persona.emoji}</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground text-sm">{t(language, persona.nameKey)}</h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2"><span className="truncate block max-w-full">{t(language, persona.descKey)}</span></p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-end gap-1 text-xs text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>{t(language, 'personaChoose')}</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.titleKey}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                        <feature.icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {t(language, feature.titleKey)}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(language, feature.descKey)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section ref={pricingRef} className="relative py-16 sm:py-24 bg-gradient-to-br from-amber-50/50 via-white to-emerald-50/30">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-200/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-200/20 to-transparent rounded-full blur-3xl" />
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {t(language, 'pricingTitle')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                {t(language, 'pricingSubtitle')}
              </p>
              {/* Currency Toggle */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrency('eur')}
                  className={["px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer", currency === 'eur' ? "bg-emerald-600 text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"].join(" ")}
                >
                  EUR €
                </button>
                <button
                  onClick={() => setCurrency('usd')}
                  className={["px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer", currency === 'usd' ? "bg-emerald-600 text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"].join(" ")}
                >
                  USD $
                </button>
                <button
                  onClick={() => setCurrency('gbp')}
                  className={["px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer", currency === 'gbp' ? "bg-emerald-600 text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"].join(" ")}
                >
                  GBP £
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start max-w-4xl mx-auto">
              {/* Pro Plan */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="relative border-2 border-emerald-600 bg-white shadow-lg shadow-emerald-600/10">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald-600 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {t(language, 'planProPopular')}
                    </Badge>
                  </div>
                  <CardContent className="p-6 sm:p-8 pt-8">
                    <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-emerald-600" />
                      {t(language, 'planPro')}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-extrabold text-foreground">{isUsd ? t(language, 'pricingProPriceUsd') : isGbp ? t(language, 'pricingProPriceGbp') : t(language, 'planProPrice')}</span>
                      <span className="text-muted-foreground text-sm">{isUsd ? t(language, 'pricingMonthlyUsd') : isGbp ? t(language, 'pricingMonthlyGbp') : t(language, 'pricingMonthly')}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">{t(language, 'planProDesc')}</p>

                    <div className="space-y-3 mb-8">
                      {pricingFeatures.map((feature) => (
                        <div key={feature.key} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t(language, feature.key)}</span>
                          <span className={`font-medium ${feature.pro === false ? 'text-muted-foreground/50' : 'text-foreground'}`}>
                            {feature.pro === false ? (
                              <X className="w-4 h-4 text-stone-300" />
                            ) : typeof feature.pro === 'string' ? (
                              feature.pro
                            ) : (
                              <Check className="w-4 h-4 text-emerald-600" />
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-5 font-semibold cursor-pointer transition-all shadow-md shadow-emerald-600/20"
                      onClick={() => handleCheckout('pro')}
                      disabled={checkoutLoading === 'pro'}
                    >
                      {checkoutLoading === 'pro' ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Crown className="mr-2 w-4 h-4" />}
                      {checkoutLoading === 'pro' ? 'Chargement...' : t(language, 'planPro')}
                      {!checkoutLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Annual Plan */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="relative border-2 border-amber-500 bg-gradient-to-br from-amber-50/50 to-white shadow-lg shadow-amber-500/10">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-500 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-sm">
                      <Zap className="w-3 h-3 mr-1" />
                      {t(language, 'planAnnualBest')}
                    </Badge>
                  </div>
                  <CardContent className="p-6 sm:p-8 pt-8">
                    <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      {t(language, 'planAnnual')}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-extrabold text-foreground">{isUsd ? t(language, 'pricingAnnualPriceUsd') : isGbp ? t(language, 'pricingAnnualPriceGbp') : t(language, 'planAnnualPrice')}</span>
                      <span className="text-muted-foreground text-sm">{isUsd ? t(language, 'pricingAnnualUsd') : isGbp ? t(language, 'pricingAnnualGbp') : t(language, 'pricingAnnual')}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">{t(language, 'planAnnualDesc')}</p>

                    <div className="space-y-3 mb-8">
                      {pricingFeatures.map((feature) => (
                        <div key={feature.key} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t(language, feature.key)}</span>
                          <span className="font-medium text-foreground">
                            {typeof feature.annual === 'string' ? (
                              feature.annual
                            ) : (
                              <Check className="w-4 h-4 text-emerald-600" />
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-5 font-semibold cursor-pointer transition-all shadow-md shadow-amber-500/20"
                      onClick={() => handleCheckout('annual')}
                      disabled={checkoutLoading === 'annual'}
                    >
                      {checkoutLoading === 'annual' ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Zap className="mr-2 w-4 h-4" />}
                      {checkoutLoading === 'annual' ? 'Chargement...' : t(language, 'planAnnual')}
                      {!checkoutLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

          </div>
        </section>

        {/* HireNova Ecosystem — Future Products Roadmap */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-b from-teal-50/40 via-white to-emerald-50/30">
          <div className="absolute inset-0 -z-10">
            <Image src="/images/bg-pattern.jpg" alt="" fill className="object-cover opacity-8" />
            <div className="absolute inset-0 bg-white/85" />
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-emerald-200">
                <Rocket className="w-4 h-4" />
                <span>{t(language, 'roadmapTitle')}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t(language, 'ecosystemTitle')}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t(language, 'ecosystemDesc')}</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {[
                { icon: FileText, name: 'HireNova CV', desc: t(language, 'ecosystemCv'), active: true, accent: 'emerald' },
                { icon: Search, name: 'HireNova ATS', desc: t(language, 'ecosystemAts'), active: true, accent: 'emerald' },
                { icon: MessageCircle, name: 'HireNova Interview', desc: t(language, 'ecosystemInterview'), active: false, accent: 'violet' },
                { icon: Linkedin, name: 'HireNova LinkedIn', desc: t(language, 'ecosystemLinkedin'), active: false, accent: 'sky' },
                { icon: UserCheck, name: 'HireNova Recruiter', desc: t(language, 'ecosystemRecruiter'), active: false, accent: 'amber' },
                { icon: Compass, name: 'HireNova Career', desc: t(language, 'ecosystemCareer'), active: false, accent: 'rose' },
                { icon: Bot, name: 'HireNova Coach', desc: t(language, 'ecosystemCoach'), active: false, accent: 'indigo' },
                { icon: BookOpen, name: 'HireNova Formation', desc: t(language, 'ecosystemFormation'), active: false, accent: 'teal' },
                { icon: Laptop, name: 'HireNova Freelance', desc: t(language, 'ecosystemFreelance'), active: false, accent: 'orange' },
              ].map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                >
                  <Card className={`h-full relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${product.active ? 'border-emerald-500 shadow-md bg-gradient-to-br from-emerald-50/50 to-white' : 'border-muted/50 bg-white'}`}>
                    {product.active && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-semibold rounded-full">ACTIF</Badge>
                      </div>
                    )}
                    {!product.active && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-semibold rounded-full">BIENTÔT</Badge>
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${product.active ? 'bg-emerald-100' : 'bg-muted'}`}>
                        <product.icon className={`w-5 h-5 ${product.active ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                      </div>
                      <h3 className={`font-semibold text-sm mb-1.5 ${product.active ? 'text-emerald-800' : 'text-foreground'}`}>{product.name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{product.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section — SEO Rich Content */}
        <section className="relative py-16 sm:py-24 bg-white" id="faq">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-emerald-200">
                <HelpCircle className="w-4 h-4" />
                <span>FAQ</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t(language, 'faqTitle')}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t(language, 'faqSubtitle')}</p>
            </motion.div>

            <div className="space-y-4">
              {([
                { q: 'faqQ1' as const, a: 'faqA1' as const },
                { q: 'faqQ2' as const, a: 'faqA2' as const },
                { q: 'faqQ3' as const, a: 'faqA3' as const },
                { q: 'faqQ4' as const, a: 'faqA4' as const },
                { q: 'faqQ5' as const, a: 'faqA5' as const },
                { q: 'faqQ6' as const, a: 'faqA6' as const },
                { q: 'faqQ7' as const, a: 'faqA7' as const },
                { q: 'faqQ8' as const, a: 'faqA8' as const },
              ]).map((item, index) => (
                <FAQItem key={item.q} question={t(language, item.q)} answer={t(language, item.a)} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Trust / Social Proof Section — SEO */}
        <section className="relative py-16 sm:py-20 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{t(language, 'trustTitle')}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">{t(language, 'trustSubtitle')}</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {([
                { icon: Users, value: '100+', label: t(language, 'trustStats'), color: 'emerald' },
                { icon: ThumbsUp, value: '5/5', label: { fr: 'Note moyenne', en: 'Average rating', ar: 'متوسط التقييم', es: 'Puntuación media' }[language], color: 'amber' },
                { icon: Lock, value: '100%', label: { fr: 'Données sécurisées', en: 'Data secured', ar: 'بيانات آمنة', es: 'Datos seguros' }[language], color: 'teal' },
              ]).map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-sm bg-white text-center">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl bg-${item.color}-100 flex items-center justify-center mx-auto mb-3`}>
                        <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                      </div>
                      <div className="text-2xl font-extrabold text-foreground mb-1">{item.value}</div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">{t(language, 'trustGuarantee')}</p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="relative text-center bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0">
                <Image src="/images/gradient-emerald.jpg" alt="" fill className="object-cover opacity-20" />
              </div>
              <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                {t(language, 'ctaReadyTitle')}
              </h2>
              <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
                {t(language, 'ctaReadyDesc')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg rounded-xl font-semibold shadow-lg transition-all cursor-pointer"
                  onClick={() => requireAuthAndPlan('form')}
                >
                  <FileText className="mr-2 w-5 h-5" />
                  {t(language, 'ctaChooseProfile')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl font-semibold transition-all cursor-pointer"
                  onClick={() => requireAuthAndPlan('clForm')}
                >
                  <PenLine className="mr-2 w-5 h-5" />
                  {t(language, 'clCta')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />

      <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      {/* Footer */}
      <footer className="border-t bg-gradient-to-r from-emerald-50/50 via-white to-amber-50/30 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-3 text-sm text-muted-foreground">
          <p>{t(language, 'footerText')} &copy; 2026 HireNova — <span className="font-medium text-foreground">E-Society 2050</span></p>
          <div className="flex items-center flex-wrap justify-center gap-2 text-xs">
            <span className="text-emerald-600 font-medium">Paiement sécurisé :</span>
            <span>🇫🇷 FR</span><span>🇧🇪 BE</span><span>🇨🇭 CH</span><span>🇱🇺 LU</span><span>🇲🇨 MC</span><span>🇪🇸 ES</span><span>🇬🇧 UK</span><span>🇺🇸 US</span><span>🇨🇦 CA</span><span>🇦🇺 AU</span><span>🇸🇦 SA</span><span>🇦🇪 AE</span><span>🇶🇦 QA</span><span>🇰🇼 KW</span><span>🇧🇭 BH</span><span>🇴🇲 OM</span>
          </div>
          <button onClick={() => { document.dispatchEvent(new CustomEvent('open-legal')) }} className="text-xs text-emerald-600 hover:underline cursor-pointer">Mentions Légales</button>
        </div>
      </footer>
    </div>
  )
}
