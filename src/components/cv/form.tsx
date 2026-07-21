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
  Camera,
  X,
  Info,
  CalendarDays,
  MapPinned,
  HeartHandshake,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Building2,
  PenLine,
  Zap,
  UserCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { countries, findCountryByDial } from '@/lib/countries'

const stepIcons = [User, Briefcase, GraduationCap, Code2]
const stepTitles = ['step1Title', 'step2TitleNew', 'step3Title', 'step4Title'] as const

const templates: { id: TemplateStyle; labelKey: 'templateModern' | 'templateClassic' | 'templateCreative' }[] = [
  { id: 'modern', labelKey: 'templateModern' },
  { id: 'classic', labelKey: 'templateClassic' },
  { id: 'creative', labelKey: 'templateCreative' },
]

const languages: { id: CVLanguage; flag: string }[] = [
  { id: 'fr', flag: '🇫🇷' },
  { id: 'en', flag: '🇬🇧' },
  { id: 'ar', flag: '🇸🇦' },
  { id: 'es', flag: '🇪🇸' },
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
    updateCLFormData,
    setGeneratedCL,
    setCLGenerating,
    setCLError,
  } = useCVStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>('')

  function handlePhoneCountryChange(code: string) {
    setPhoneCountryCode(code)
    const country = countries.find((c) => c.code === code)
    if (country) {
      // Remove any existing dial code from phone, prepend new one
      const currentNumber = formData.phone.replace(/^[+\d\s\-()]+/, '').trim()
      updateFormData({ phone: currentNumber ? `${country.dial} ${currentNumber}` : country.dial })
    }
  }

  function handlePhoneNumberChange(number: string) {
    const country = countries.find((c) => c.code === phoneCountryCode)
    const dial = country?.dial || ''
    const cleaned = number.replace(/[^\d\s]/g, '').trim()
    updateFormData({ phone: dial ? `${dial} ${cleaned}` : cleaned })
  }

  function getPhoneNumberOnly(): string {
    const country = countries.find((c) => c.code === phoneCountryCode)
    const dial = country?.dial || ''
    return formData.phone.startsWith(dial) ? formData.phone.slice(dial.length).trim() : formData.phone.replace(/^[+\d\s\-()]+/, '').trim()
  }

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
    setCLGenerating(formData.companyName.trim().length > 0)
    setCLError(null)

    const hasCompany = formData.companyName.trim().length > 0

    try {
      // Generate CV
      const res = await fetch('/api/generate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language }),
      })

      const data = await res.json()
      if (!res.ok) {
        if (data.code === 'LIMIT_REACHED') {
          setStep('landing')
          toast.error(data.error, { duration: 6000 })
          return
        }
        throw new Error(data.error || 'Erreur lors de la génération')
      }

      const generatedCV = data.cv
      setGeneratedCV(generatedCV)

      // If company name provided, auto-generate cover letter simultaneously
      if (hasCompany) {
        try {
          // Auto-sync personal info to CL form data
          updateCLFormData({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            location: formData.location,
            companyName: formData.companyName,
            hiringManager: formData.hiringManager,
            jobTitle: formData.targetJob,
            tone: formData.clTone,
          })

          const clRes = await fetch('/api/generate-cover-letter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              location: formData.location,
              companyName: formData.companyName,
              hiringManager: formData.hiringManager,
              jobTitle: formData.targetJob,
              tone: formData.clTone,
              language,
              generatedCVSummary: generatedCV.summary,
              generatedCVExperience: generatedCV.experience,
              generatedCVEducation: generatedCV.education,
              generatedCVSkills: generatedCV.skills,
              generatedCVLanguages: generatedCV.languages,
            }),
          })

          const clData = await clRes.json()
          if (clRes.ok && clData.letter) {
            setGeneratedCL(clData.letter)
          }
        } catch {
          // CL generation failed silently - CV is still valid
          setCLGenerating(false)
        }
      }

      setTimeout(() => {
        setStep('preview')
        setIsGenerating(false)
        setCLGenerating(false)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setIsGenerating(false)
      setCLGenerating(false)
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
                    {/* Photo Upload */}
                    <div>
                      <Label>{t(language, 'photo')}</Label>
                      <div className="mt-1.5">
                        {formData.photo ? (
                          <div className="relative inline-block">
                            <img
                              src={formData.photo}
                              alt="Photo"
                              className="w-24 h-24 rounded-full object-cover border-2 border-emerald-200"
                            />
                            <button
                              type="button"
                              onClick={() => updateFormData({ photo: '' })}
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer shadow-sm"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all group">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                if (file.size > 5 * 1024 * 1024) {
                                  toast.error(language === 'fr' ? 'Image trop volumineuse (max 5 Mo)' : language === 'en' ? 'Image too large (max 5 MB)' : 'الصورة كبيرة جداً (الحد الأقصى 5 ميغابايت)')
                                  return
                                }
                                const reader = new FileReader()
                                reader.onload = () => {
                                  updateFormData({ photo: reader.result as string })
                                }
                                reader.readAsDataURL(file)
                              }}
                            />
                            <Camera className="w-8 h-8 text-muted-foreground/40 group-hover:text-emerald-500 transition-colors" />
                            <span className="text-xs text-muted-foreground/60 mt-1.5 group-hover:text-emerald-600 transition-colors">
                              {t(language, 'photoPlaceholder')}
                            </span>
                          </label>
                        )}
                      </div>
                      <div className="flex items-start gap-1.5 mt-2">
                        <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground">{t(language, 'photoNote')}</p>
                      </div>
                    </div>
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
                      <div className="sm:col-span-2">
                        <Label>{t(language, 'phone')}</Label>
                        <div className="mt-1.5 flex gap-2">
                          <select
                            value={phoneCountryCode}
                            onChange={(e) => handlePhoneCountryChange(e.target.value)}
                            className="h-9 w-[180px] shrink-0 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 appearance-none cursor-pointer"
                            aria-label={t(language, 'phoneCountry')}
                          >
                            <option value="">{t(language, 'phoneCountryPlaceholder')}</option>
                            {countries.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.flag} {c.dial} {c.name}
                              </option>
                            ))}
                          </select>
                          <Input
                            type="tel"
                            value={getPhoneNumberOnly()}
                            onChange={(e) => handlePhoneNumberChange(e.target.value)}
                            placeholder={language === 'fr' ? '600 000 000' : language === 'en' ? '600 000 000' : language === 'ar' ? '600 000 000' : '600 000 000'}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">{t(language, 'address')}</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => updateFormData({ address: e.target.value })}
                          placeholder={language === 'fr' ? '123 Rue Mohammed V' : language === 'en' ? '123 Main Street' : language === 'ar' ? 'شارع محمد الخامس 123' : 'Calle Ejemplo 123'}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">{t(language, 'location')}</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => updateFormData({ location: e.target.value })}
                          placeholder={language === 'fr' ? 'Casablanca, Maroc' : language === 'en' ? 'London, UK' : language === 'ar' ? 'الدار البيضاء، المغرب' : 'Madrid, España'}
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

                    {/* Birth Information */}
                    <div className="mt-6 pt-5 border-t border-stone-100">
                      <Label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-3">
                        <CalendarDays className="w-4 h-4 text-emerald-600" />
                        {t(language, 'personalInfo')}
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dateOfBirth">{t(language, 'dateOfBirth')}</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="birthPlace">{t(language, 'birthPlace')}</Label>
                          <Input
                            id="birthPlace"
                            value={formData.birthPlace}
                            onChange={(e) => updateFormData({ birthPlace: e.target.value })}
                            placeholder={language === 'fr' ? 'Casablanca' : language === 'en' ? 'Casablanca' : language === 'ar' ? 'الدار البيضاء' : 'Madrid'}
                            className="mt-1.5"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor="birthCountry">{t(language, 'birthCountry')}</Label>
                          <Input
                            id="birthCountry"
                            value={formData.birthCountry}
                            onChange={(e) => updateFormData({ birthCountry: e.target.value })}
                            placeholder={t(language, 'birthCountryPlaceholder')}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Career Goals & Cover Letter */}
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

                    {/* Cover Letter section - separated visually */}
                    <div className="relative mt-6">
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
                      <div className="flex items-center gap-2 mt-4 mb-4">
                        <PenLine className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-700">
                          {t(language, 'tabCoverLetter')}
                        </span>
                        <span className="text-xs text-muted-foreground bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {language === 'fr' ? 'Optionnel' : language === 'en' ? 'Optional' : language === 'es' ? 'Opcional' : 'اختياري'}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="companyName" className="text-sm font-medium">
                            {t(language, 'companyNameForCl')}
                          </Label>
                          <Input
                            id="companyName"
                            value={formData.companyName}
                            onChange={(e) => updateFormData({ companyName: e.target.value })}
                            placeholder={t(language, 'companyNameForClPlaceholder')}
                            className="mt-1.5"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {language === 'fr'
                              ? "Renseignez le nom de l'entreprise pour générer automatiquement une lettre de motivation personnalisée en même temps que votre CV."
                              : language === 'en'
                                ? 'Enter the company name to automatically generate a personalized cover letter along with your resume.'
                                : language === 'es'
                                  ? 'Ingrese el nombre de la empresa para generar automáticamente una carta de motivación junto con su currículum.'
                                  : 'أدخل اسم الشركة لإنشاء رسالة دافع مخصصة تلقائياً مع سيرتك الذاتية.'}
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="hiringManager" className="text-sm font-medium">
                            {t(language, 'hiringManagerForCl')}
                          </Label>
                          <Input
                            id="hiringManager"
                            value={formData.hiringManager}
                            onChange={(e) => updateFormData({ hiringManager: e.target.value })}
                            placeholder={t(language, 'hiringManagerForClPlaceholder')}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">{t(language, 'clToneForCl')}</Label>
                          <div className="grid grid-cols-3 gap-2 mt-1.5">
                            {([
                              { id: 'formal' as const, icon: UserCircle, labelKey: 'clToneFormal' as const },
                              { id: 'semi-formal' as const, icon: Building2, labelKey: 'clToneSemiFormal' as const },
                              { id: 'dynamic' as const, icon: Zap, labelKey: 'clToneDynamic' as const },
                            ]).map((tone) => (
                              <button
                                key={tone.id}
                                type="button"
                                onClick={() => updateFormData({ clTone: tone.id })}
                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                                  formData.clTone === tone.id
                                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                                    : 'border-muted bg-white text-muted-foreground hover:border-emerald-300'
                                }`}
                              >
                                <tone.icon className="w-4 h-4" />
                                <span className="text-xs font-medium">{t(language, tone.labelKey)}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
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
                      <Label htmlFor="softSkills">{t(language, 'softSkills')}</Label>
                      <Textarea
                        id="softSkills"
                        value={formData.softSkills}
                        onChange={(e) => updateFormData({ softSkills: e.target.value })}
                        placeholder={t(language, 'softSkillsPlaceholder')}
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

                    {/* Photo Position Selector - only show if user has a photo */}
                    {formData.photo && (
                      <div className="mt-6">
                        <Label className="flex items-center gap-2 mb-3">
                          <ImageIcon className="w-4 h-4 text-emerald-600" />
                          {t(language, 'photoPosition')}
                        </Label>
                        <div className="grid grid-cols-3 gap-3">
                          {(['left', 'center', 'right'] as const).map((pos) => {
                            const key = pos === 'left' ? 'photoPositionLeft' : pos === 'center' ? 'photoPositionCenter' : 'photoPositionRight'
                            const posIcon = pos === 'left' ? AlignLeft : pos === 'center' ? AlignCenter : AlignRight
                            return (
                              <button
                                key={pos}
                                onClick={() => updateFormData({ photoPosition: pos })}
                                className={`relative rounded-xl border-2 p-4 transition-all cursor-pointer ${
                                  formData.photoPosition === pos
                                    ? 'border-emerald-600 bg-emerald-50'
                                    : 'border-muted hover:border-emerald-300 bg-white'
                                }`}
                              >
                                {formData.photoPosition === pos && (
                                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                )}
                                <posIcon className={`w-5 h-5 mx-auto mb-2 ${formData.photoPosition === pos ? 'text-emerald-700' : 'text-muted-foreground'}`} />
                                <div className={`text-xs font-bold uppercase tracking-wider ${formData.photoPosition === pos ? 'text-emerald-700' : 'text-muted-foreground'}`}>
                                  {t(language, key)}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
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