'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Globe, Shield, PenLine, ArrowRight, FileText, Star, Languages, Check, X, Crown, Zap, Loader2, LayoutTemplate, Download, Wallet, CreditCard, Smartphone, GraduationCap, Briefcase, Rocket, Plane, UserCheck, Award } from 'lucide-react'
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
  lifetime: boolean | string
}

const pricingFeatures: PricingFeature[] = [
  { key: 'pricingCv', pro: '∞', lifetime: '∞' },
  { key: 'pricingTemplates', pro: '3', lifetime: '3' },
  { key: 'pricingPdf', pro: true, lifetime: true },
  { key: 'pricingWord', pro: true, lifetime: true },
  { key: 'pricingCoverLetter', pro: true, lifetime: true },
  { key: 'pricingNoWatermark', pro: true, lifetime: true },
  { key: 'pricingAtsScore', pro: false, lifetime: true },
  { key: 'pricingPriority', pro: false, lifetime: true },
]

export default function Landing() {
  const { setStep, language, setLanguage, setSelectedPersona } = useCVStore()
  const personasRef = useRef<HTMLDivElement>(null)

  function scrollToPersonas() {
    personasRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  const { data: session } = useSession()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register')
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [currency, setCurrency] = useState<'eur' | 'usd' | 'mad'>('eur')

  const isUsd = currency === 'usd'
  const isMad = currency === 'mad'

  async function handleCheckout(planType: 'pro' | 'lifetime') {
    if (!session?.user) {
      setAuthMode('register')
      setAuthModalOpen(true)
      return
    }
    setCheckoutLoading(planType)
    try {
      if (isMad) {
        // Paymob/Floos for Africa
        const res = await fetch('/api/paymob/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planType }),
        })
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        } else {
          toast.error(data.error || 'Erreur')
        }
      } else {
        // LemonSqueezy for EUR/USD
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planType, currency }),
        })
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        } else {
          toast.error(data.error || 'Erreur')
        }
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
            <ProfileButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-emerald-100/60 via-teal-50/40 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-amber-100/30 to-transparent rounded-full blur-3xl" />
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
                  onClick={scrollToPersonas}
                >
                  <FileText className="mr-2 w-5 h-5" />
                  {t(language, 'ctaChooseProfile')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg rounded-xl transition-all cursor-pointer"
                  onClick={() => setStep('clForm')}
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
        <section ref={personasRef} className="py-16 sm:py-20 bg-white">
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
        <section className="py-16 sm:py-24">
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
                  className={["px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer", !isUsd && !isMad ? "bg-emerald-600 text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"].join(" ")}
                >
                  EUR
                </button>
                <button
                  onClick={() => setCurrency('usd')}
                  className={["px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer", isUsd ? "bg-emerald-600 text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"].join(" ")}
                >
                  USD
                </button>
                <button
                  onClick={() => setCurrency('mad')}
                  className={["px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer", isMad ? "bg-amber-500 text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"].join(" ")}
                >
                  🌍 MAD
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
                      <span className="text-4xl font-extrabold text-foreground">{isMad ? t(language, 'paymobProPrice') : isUsd ? t(language, 'pricingProPriceUsd') : t(language, 'planProPrice')}</span>
                      <span className="text-muted-foreground text-sm">{isMad ? t(language, 'paymobMonthly') : isUsd ? t(language, 'pricingMonthlyUsd') : t(language, 'pricingMonthly')}</span>
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

              {/* Lifetime Plan */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="relative border bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-500 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-sm">
                      <Zap className="w-3 h-3 mr-1" />
                      {t(language, 'planLifetimeBest')}
                    </Badge>
                  </div>
                  <CardContent className="p-6 sm:p-8 pt-8">
                    <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      {t(language, 'planLifetime')}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-extrabold text-foreground">{isMad ? t(language, 'paymobLifetimePrice') : isUsd ? t(language, 'pricingLifetimePriceUsd') : t(language, 'planLifetimePrice')}</span>
                      <span className="text-muted-foreground text-sm">{isMad ? t(language, 'paymobOneTime') : isUsd ? t(language, 'pricingOneTimeUsd') : t(language, 'pricingOneTime')}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">{t(language, 'planLifetimeDesc')}</p>

                    <div className="space-y-3 mb-8">
                      {pricingFeatures.map((feature) => (
                        <div key={feature.key} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t(language, feature.key)}</span>
                          <span className="font-medium text-foreground">
                            {typeof feature.lifetime === 'string' ? (
                              feature.lifetime
                            ) : (
                              <Check className="w-4 h-4 text-emerald-600" />
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full bg-white border border-amber-500 text-amber-700 hover:bg-amber-50 rounded-xl py-5 font-semibold cursor-pointer transition-all"
                      onClick={() => handleCheckout('lifetime')}
                      disabled={checkoutLoading === 'lifetime'}
                    >
                      {checkoutLoading === 'lifetime' ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Zap className="mr-2 w-4 h-4" />}
                      {checkoutLoading === 'lifetime' ? 'Chargement...' : t(language, 'planLifetime')}
                      {!checkoutLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Paymob / Africa Payment Info */}
            {isMad && (
              <motion.div
                className="mt-8 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{t(language, 'paymobAfrica')}</h3>
                        <p className="text-sm text-muted-foreground">{t(language, 'paymobLabel')}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{t(language, 'paymobDesc')}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border">
                        <CreditCard className="w-5 h-5 text-amber-600 shrink-0" />
                        <span className="text-sm font-medium">{t(language, 'paymobCard')}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border">
                        <Smartphone className="w-5 h-5 text-amber-600 shrink-0" />
                        <span className="text-sm font-medium">{t(language, 'paymobWallet')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 lg:p-16"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
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
                  onClick={scrollToPersonas}
                >
                  <FileText className="mr-2 w-5 h-5" />
                  {t(language, 'ctaChooseProfile')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl font-semibold transition-all cursor-pointer"
                  onClick={() => setStep('clForm')}
                >
                  <PenLine className="mr-2 w-5 h-5" />
                  {t(language, 'clCta')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
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
      />

      {/* Footer */}
      <footer className="border-t py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-3 text-sm text-muted-foreground">
          <p>{t(language, 'footerText')} &copy; 2026 HireNova — <span className="font-medium text-foreground">E-Society 2050</span></p>
          <div className="flex items-center gap-4">
            <button onClick={() => { document.dispatchEvent(new CustomEvent('open-legal')) }} className="text-xs text-emerald-600 hover:underline cursor-pointer">Mentions Légales</button>
            <span className="text-xs">·</span>
            <p className="flex items-center gap-1">
              {t(language, 'footerMadeWith')}{' '}
              <span className="text-emerald-600 font-semibold">Z.ai</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
