'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCVStore, type TemplateStyle, type CVLanguage } from '@/store/cv-store'
import { t } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  User,
  Briefcase,
  GraduationCap,
  Code2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Palette,
  Globe,
} from 'lucide-react'
import { toast } from 'sonner'

const stepIcons = [User, Briefcase, GraduationCap, Code2]
const stepTitles = ['step1Title', 'step2Title', 'step3Title', 'step4Title'] as const

const templates: { id: TemplateStyle; labelKey: 'templateModern' | 'templateClassic' | 'templateCreative' }[] = [
  { id: 'modern', labelKey: 'templateModern' },
  { id: 'classic', labelKey: 'templateClassic' },
  { id: 'creative', labelKey: 'templateCreative' },
]

const languages: { id: CVLanguage; flag: string }[] = [
  { id: 'fr', flag: '🇫🇷' },
  { id: 'en', flag: '🇬🇧' },
  { id: 'ar', flag: '🇸🇦' },
]

export default function CVForm() {
  const {
    formStep,
    setFormStep,
    language,
    setLanguage,
    template,
    setTemplate,
    formData,
    updateFormData,
    setStep,
    setIsGenerating,
    setGeneratedCV,
    setError,
  } = useCVStore()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
  }

  function validateStep(step: number): boolean {
    if (step === 0) {
      if (!formData.fullName.trim() || !formData.email.trim()) {
        toast.error(t(language, 'errorFillFields'))
        return false
      }
    }
    if (step === 1) {
      if (!formData.targetJob.trim()) {
        toast.error(t(language, 'errorFillFields'))
        return false
      }
    }
    return true
  }

  function handleNext() {
    if (!validateStep(formStep)) return
    if (formStep < 3) setFormStep(formStep + 1)
  }

  function handlePrevious() {
    if (formStep > 0) setFormStep(formStep - 1)
  }

  async function handleGenerate() {
    if (!validateStep(formStep)) return
    setIsSubmitting(true)
    setStep('generating')
    setIsGenerating(true)
    setError(null)

    try {
      const res = await fetch('/api/generate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la génération')
      }

      setGeneratedCV(data.cv)
      setTimeout(() => {
        setStep('preview')
        setIsGenerating(false)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setIsGenerating(false)
      setStep('form')
      toast.error(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLastStep = formStep === 3

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setStep('landing')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground hidden sm:inline">{t(language, 'siteTitle')}</span>
          </button>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  language === lang.id
                    ? 'bg-white shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="mr-1">{lang.flag}</span>
                <span className="hidden sm:inline">{lang.id.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {stepTitles.map((titleKey, i) => {
                const Icon = stepIcons[i]
                const isActive = i === formStep
                const isCompleted = i < formStep
                return (
                  <button
                    key={titleKey}
                    onClick={() => {
                      if (isCompleted || i === formStep) setFormStep(i)
                    }}
                    className={`flex flex-col items-center gap-1.5 flex-1 cursor-pointer group ${
                      !isCompleted && i !== formStep ? 'opacity-40' : ''
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                          : isCompleted
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-xs font-medium text-center hidden sm:block ${
                        isActive ? 'text-emerald-600' : 'text-muted-foreground'
                      }`}
                    >
                      {t(language, titleKey)}
                    </span>
                  </button>
                )
              })}
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500 rounded-full"
                animate={{ width: `${((formStep + 1) / 4) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-2xl border shadow-sm p-6 sm:p-8 min-h-[400px] relative overflow-hidden">
            <AnimatePresence mode="wait" custom={1}>
              <motion.div
                key={formStep}
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  {(() => {
                    const Icon = stepIcons[formStep]
                    return <Icon className="w-5 h-5 text-emerald-600" />
                  })()}
                  {t(language, stepTitles[formStep])}
                </h2>

                {/* Step 1: Personal Info */}
                {formStep === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Label htmlFor="fullName">{t(language, 'fullName')} *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => updateFormData({ fullName: e.target.value })}
                          placeholder={language === 'fr' ? 'Jean Dupont' : language === 'en' ? 'John Smith' : 'محمد أحمد'}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">{t(language, 'email')} *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData({ email: e.target.value })}
                          placeholder="jean@exemple.com"
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{t(language, 'phone')}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateFormData({ phone: e.target.value })}
                          placeholder="+212 600 000 000"
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">{t(language, 'location')}</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => updateFormData({ location: e.target.value })}
                          placeholder={language === 'fr' ? 'Casablanca, Maroc' : language === 'en' ? 'London, UK' : 'الدار البيضاء، المغرب'}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={formData.linkedin}
                          onChange={(e) => updateFormData({ linkedin: e.target.value })}
                          placeholder="linkedin.com/in/jean-dupont"
                          className="mt-1.5"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="website">{t(language, 'website')}</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => updateFormData({ website: e.target.value })}
                          placeholder="www.monsite.com"
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Career Goals */}
                {formStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="targetJob">{t(language, 'targetJob')} *</Label>
                      <Input
                        id="targetJob"
                        value={formData.targetJob}
                        onChange={(e) => updateFormData({ targetJob: e.target.value })}
                        placeholder={language === 'fr' ? 'Développeur Full-Stack' : language === 'en' ? 'Full-Stack Developer' : 'مطور Full-Stack'}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">{t(language, 'industry')}</Label>
                      <Input
                        id="industry"
                        value={formData.industry}
                        onChange={(e) => updateFormData({ industry: e.target.value })}
                        placeholder={language === 'fr' ? 'Technologie / IT' : language === 'en' ? 'Technology / IT' : 'التكنولوجيا / تكنولوجيا المعلومات'}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Experience & Education */}
                {formStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="experience">{t(language, 'experience')}</Label>
                      <Textarea
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => updateFormData({ experience: e.target.value })}
                        placeholder={t(language, 'experiencePlaceholder')}
                        className="mt-1.5 min-h-[120px] resize-y"
                      />
                    </div>
                    <div>
                      <Label htmlFor="education">{t(language, 'education')}</Label>
                      <Textarea
                        id="education"
                        value={formData.education}
                        onChange={(e) => updateFormData({ education: e.target.value })}
                        placeholder={t(language, 'educationPlaceholder')}
                        className="mt-1.5 min-h-[120px] resize-y"
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Skills, Languages, Template */}
                {formStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="skills">{t(language, 'skills')}</Label>
                      <Textarea
                        id="skills"
                        value={formData.skills}
                        onChange={(e) => updateFormData({ skills: e.target.value })}
                        placeholder={t(language, 'skillsPlaceholder')}
                        className="mt-1.5 min-h-[80px] resize-y"
                      />
                    </div>
                    <div>
                      <Label htmlFor="languages">{t(language, 'languages')}</Label>
                      <Textarea
                        id="languages"
                        value={formData.languages}
                        onChange={(e) => updateFormData({ languages: e.target.value })}
                        placeholder={t(language, 'languagesPlaceholder')}
                        className="mt-1.5 min-h-[80px] resize-y"
                      />
                    </div>
                    <div>
                      <Label htmlFor="summary">{t(language, 'summary')}</Label>
                      <Textarea
                        id="summary"
                        value={formData.summary}
                        onChange={(e) => updateFormData({ summary: e.target.value })}
                        placeholder={t(language, 'summaryPlaceholder')}
                        className="mt-1.5 min-h-[80px] resize-y"
                      />
                    </div>

                    {/* Template Selector */}
                    <div>
                      <Label className="flex items-center gap-2 mb-3">
                        <Palette className="w-4 h-4 text-emerald-600" />
                        {t(language, 'templateLabel')}
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {templates.map((tmpl) => (
                          <button
                            key={tmpl.id}
                            onClick={() => setTemplate(tmpl.id)}
                            className={`relative rounded-xl border-2 p-4 transition-all cursor-pointer ${
                              template === tmpl.id
                                ? 'border-emerald-600 bg-emerald-50'
                                : 'border-muted hover:border-emerald-300 bg-white'
                            }`}
                          >
                            {template === tmpl.id && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                            <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${template === tmpl.id ? 'text-emerald-700' : 'text-muted-foreground'}`}>
                              {t(language, tmpl.labelKey)}
                            </div>
                            {/* Mini template preview */}
                            {tmpl.id === 'modern' && (
                              <div className="space-y-1.5">
                                <div className="flex gap-1.5 h-8">
                                  <div className="w-1/3 bg-emerald-800 rounded-sm" />
                                  <div className="flex-1 bg-stone-100 rounded-sm" />
                                </div>
                                <div className="flex gap-1.5 h-4">
                                  <div className="w-1/3 bg-emerald-800 rounded-sm" />
                                  <div className="flex-1 bg-stone-100 rounded-sm" />
                                </div>
                              </div>
                            )}
                            {tmpl.id === 'classic' && (
                              <div className="space-y-1.5">
                                <div className="h-2 w-1/2 bg-stone-800 rounded-sm mx-auto" />
                                <div className="h-1 w-3/4 bg-stone-200 rounded-sm mx-auto" />
                                <div className="h-4 bg-stone-100 rounded-sm" />
                              </div>
                            )}
                            {tmpl.id === 'creative' && (
                              <div className="space-y-1.5">
                                <div className="h-4 bg-gradient-to-r from-emerald-700 to-teal-600 rounded-sm" />
                                <div className="flex gap-1.5 h-6">
                                  <div className="flex-1 bg-stone-100 rounded-sm" />
                                  <div className="w-1/3 bg-stone-200 rounded-sm" />
                                </div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={formStep === 0}
              className="gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {t(language, 'previous')}
            </Button>

            {isLastStep ? (
              <Button
                onClick={handleGenerate}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-8 cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                {t(language, 'generate')}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 cursor-pointer"
              >
                {t(language, 'next')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground">
          {t(language, 'footerText')} &copy; {new Date().getFullYear()} CV Genius IA
        </div>
      </footer>
    </div>
  )
}