'use client'

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  BrainCircuit,
  User,
  UserCheck,
  Loader2,
  Mic,
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { useCVStore, type CVLanguage } from '@/store/cv-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { t } from '@/lib/i18n'
import { track } from '@/lib/analytics'
import { marketingProducts } from '@/lib/marketing/products'
import { toast } from 'sonner'

// ─── Dynamic icon resolver ────────────────────────────────────────────────

function getIcon(iconName: string): React.ElementType {
  return (LucideIcons as Record<string, React.ElementType>)[iconName] || FileText
}

// ─── Product colors (expanded for all 15 products) ────────────────────────

type ProductColor =
  | 'emerald' | 'violet' | 'sky' | 'amber' | 'rose' | 'blue'
  | 'teal' | 'orange' | 'indigo' | 'pink' | 'cyan' | 'lime'
  | 'fuchsia' | 'yellow' | 'red'

const colorMap: Record<ProductColor, { bg: string; text: string; ring: string; glow: string }> = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', ring: 'ring-emerald-400', glow: 'shadow-emerald-400/50' },
  violet:  { bg: 'bg-violet-100', text: 'text-violet-600', ring: 'ring-violet-400', glow: 'shadow-violet-400/50' },
  sky:     { bg: 'bg-sky-100', text: 'text-sky-600', ring: 'ring-sky-400', glow: 'shadow-sky-400/50' },
  amber:   { bg: 'bg-amber-100', text: 'text-amber-600', ring: 'ring-amber-400', glow: 'shadow-amber-400/50' },
  rose:    { bg: 'bg-rose-100', text: 'text-rose-600', ring: 'ring-rose-400', glow: 'shadow-rose-400/50' },
  blue:    { bg: 'bg-blue-100', text: 'text-blue-600', ring: 'ring-blue-400', glow: 'shadow-blue-400/50' },
  teal:    { bg: 'bg-teal-100', text: 'text-teal-600', ring: 'ring-teal-400', glow: 'shadow-teal-400/50' },
  orange:  { bg: 'bg-orange-100', text: 'text-orange-600', ring: 'ring-orange-400', glow: 'shadow-orange-400/50' },
  indigo:  { bg: 'bg-indigo-100', text: 'text-indigo-600', ring: 'ring-indigo-400', glow: 'shadow-indigo-400/50' },
  pink:    { bg: 'bg-pink-100', text: 'text-pink-600', ring: 'ring-pink-400', glow: 'shadow-pink-400/50' },
  cyan:    { bg: 'bg-cyan-100', text: 'text-cyan-600', ring: 'ring-cyan-400', glow: 'shadow-cyan-400/50' },
  lime:    { bg: 'bg-lime-100', text: 'text-lime-600', ring: 'ring-lime-400', glow: 'shadow-lime-400/50' },
  fuchsia: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-600', ring: 'ring-fuchsia-400', glow: 'shadow-fuchsia-400/50' },
  yellow:  { bg: 'bg-yellow-100', text: 'text-yellow-600', ring: 'ring-yellow-400', glow: 'shadow-yellow-400/50' },
  red:     { bg: 'bg-red-100', text: 'text-red-600', ring: 'ring-red-400', glow: 'shadow-red-400/50' },
}

// Web Speech API language codes
const SPEECH_LANG: Record<CVLanguage, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  ar: 'ar-SA',
  es: 'es-ES',
}

// Language-specific image paths: /showcase/images/{lang}/{slug}.png
const getImageSrc = (slug: string, lang: CVLanguage) => `/showcase/images/${lang}/${slug}.png`

// Voice gender matchers
const FEMALE_KEYWORDS = ['female', 'woman', 'zira', 'samantha', 'amelie', 'helena', 'paulina', 'alice']
const MALE_KEYWORDS = ['male', 'man', 'david', 'thomas', 'daniel', 'jorge', 'paul', 'james']

// ─── Component ─────────────────────────────────────────────────────────────

export default function AIAnimatedShowcase() {
  const { language } = useCVStore()
  const isRTL = language === 'ar'

  const [activeIndex, setActiveIndex] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [speechProgress, setSpeechProgress] = useState(0)
  const [speechSupported, setSpeechSupported] = useState(true)
  const [voiceReady, setVoiceReady] = useState(false)
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('female')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiDescriptions, setAiDescriptions] = useState<Record<string, Record<CVLanguage, string>>>({})

  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])

  const activeProduct = marketingProducts[activeIndex]
  const colors = colorMap[activeProduct.color as ProductColor]
  const ActiveIcon = getIcon(activeProduct.icon)
  const description = (aiDescriptions[activeProduct.slug]?.[language])
    || activeProduct.descriptions[language]

  // ─── Analytics: track product view ─────────────────────────────────────
  useEffect(() => {
    track('marketing_product_view', {
      product_slug: activeProduct.slug,
      language,
    })
  }, [activeIndex, activeProduct.slug, language])

  // ─── Check speech support + preload voices ─────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSpeechSupported(false)
      return
    }
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length > 0) {
        voicesRef.current = v
        setVoiceReady(true)
      }
    }
    // Try immediately
    loadVoices()
    // Chrome loads voices async — listen for the event
    const onVoicesChanged = () => loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged)
    }
  }, [])

  // ─── Typing effect ─────────────────────────────────────────────────────

  const clearTyping = useCallback(() => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
      typingIntervalRef.current = null
    }
    setDisplayedText('')
  }, [])

  const startTyping = useCallback(
    (text: string) => {
      clearTyping()
      // For Arabic: type word-by-word to avoid broken glyph rendering
      if (language === 'ar') {
        const words = text.split(' ')
        let wordIdx = 0
        typingIntervalRef.current = setInterval(() => {
          wordIdx++
          if (wordIdx <= words.length) {
            setDisplayedText(words.slice(0, wordIdx).join(' '))
          } else {
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
            typingIntervalRef.current = null
          }
        }, 80)
      } else {
        // For LTR languages: character-by-character
        let i = 0
        typingIntervalRef.current = setInterval(() => {
          i++
          if (i <= text.length) {
            setDisplayedText(text.slice(0, i))
          } else {
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
            typingIntervalRef.current = null
          }
        }, 25)
      }
    },
    [clearTyping, language]
  )

  // ─── Voice gender matching helper ──────────────────────────────────────

  const pickVoiceByGender = useCallback(
    (lang: CVLanguage, gender: 'male' | 'female'): SpeechSynthesisVoice | undefined => {
      const voices = voicesRef.current.length > 0
        ? voicesRef.current
        : (typeof window !== 'undefined' && window.speechSynthesis ? window.speechSynthesis.getVoices() : [])

      const langCode = SPEECH_LANG[lang].split('-')[0]
      const localeVariants: Record<string, string[]> = {
        ar: ['ar-SA', 'ar-AE', 'ar-EG', 'ar-KW', 'ar-QA', 'ar-BH', 'ar-OM', 'ar-JO', 'ar-LB', 'ar-SY', 'ar-IQ', 'ar-MA', 'ar-DZ', 'ar-TN', 'ar-YE', 'ar'],
        fr: ['fr-FR', 'fr-CA', 'fr-BE', 'fr-CH', 'fr'],
        en: ['en-US', 'en-GB', 'en-AU', 'en-IN', 'en-CA', 'en'],
        es: ['es-ES', 'es-MX', 'es-AR', 'es-CO', 'es-CL', 'es'],
      }
      const variants = localeVariants[langCode] || [langCode]
      const keywords = gender === 'female' ? FEMALE_KEYWORDS : MALE_KEYWORDS

      // Build candidate voices: first locale match, then prefix match
      let candidates: SpeechSynthesisVoice[] = []
      for (const variant of variants) {
        const match = voices.find((v) => v.lang === variant && v.localService)
        if (match) { candidates.push(match); break }
      }
      if (candidates.length === 0) {
        const match = voices.find((v) => v.lang.startsWith(langCode) && v.localService)
        if (match) candidates.push(match)
      }
      if (candidates.length === 0) {
        for (const variant of variants) {
          const match = voices.find((v) => v.lang === variant)
          if (match) { candidates.push(match); break }
        }
      }
      if (candidates.length === 0) {
        const match = voices.find((v) => v.lang.startsWith(langCode))
        if (match) candidates.push(match)
      }

      // Try to find one that matches gender keywords in name
      for (const candidate of candidates) {
        const nameLower = candidate.name.toLowerCase()
        if (keywords.some((k) => nameLower.includes(k))) return candidate
      }
      // Fallback to first candidate
      return candidates[0]
    },
    []
  )

  // ─── Speech control (Web Speech API) ────────────────────────────────────

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
    setSpeechProgress(0)
  }, [])

  const speak = useCallback(
    (text: string, lang: CVLanguage) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return

      stopSpeech()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = SPEECH_LANG[lang]
      utterance.rate = lang === 'ar' ? 0.85 : 0.95

      // Voice gender pitch adjustment
      const matchedVoice = pickVoiceByGender(lang, voiceGender)
      if (matchedVoice) {
        utterance.voice = matchedVoice
        const nameLower = matchedVoice.name.toLowerCase()
        const genderKeywords = voiceGender === 'female' ? FEMALE_KEYWORDS : MALE_KEYWORDS
        const isGenderMatch = genderKeywords.some((k) => nameLower.includes(k))
        // Only adjust pitch if no gender match was found in voice name
        if (!isGenderMatch) {
          utterance.pitch = voiceGender === 'female' ? 1.1 : 0.85
        } else {
          utterance.pitch = 1.0
        }
        console.log(`[Speech] Using voice: ${matchedVoice.name} (${matchedVoice.lang}), gender: ${voiceGender}`)
      } else {
        utterance.pitch = voiceGender === 'female' ? 1.1 : 0.85
        console.warn(`[Speech] No voice found for ${SPEECH_LANG[lang]}. Using pitch fallback.`)
      }

      // Track voice play
      track('marketing_voice_play', {
        product_slug: activeProduct.slug,
        language: lang,
        voice_gender: voiceGender,
      })

      // Simulate progress during speech
      const estimatedDuration = text.length * 60
      let progressInterval: ReturnType<typeof setInterval> | null = null

      utterance.onstart = () => {
        setIsSpeaking(true)
        setSpeechProgress(0)
        progressInterval = setInterval(() => {
          setSpeechProgress((prev) => {
            if (prev >= 95) return prev
            return prev + 2
          })
        }, estimatedDuration / 50)
      }
      utterance.onend = () => {
        setIsSpeaking(false)
        setSpeechProgress(100)
        if (progressInterval) clearInterval(progressInterval)
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
        setSpeechProgress(0)
        if (progressInterval) clearInterval(progressInterval)
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [stopSpeech, voiceGender, pickVoiceByGender, activeProduct.slug]
  )

  const toggleSpeech = useCallback(() => {
    if (isSpeaking) {
      stopSpeech()
    } else {
      speak(description, language)
    }
  }, [isSpeaking, stopSpeech, speak, description, language])

  // ─── AI Generate ───────────────────────────────────────────────────────

  const handleAIGenerate = useCallback(async () => {
    if (isGenerating) return
    setIsGenerating(true)

    track('marketing_ai_generate', {
      product_slug: activeProduct.slug,
      language,
    })

    try {
      const res = await fetch('/api/marketing/generate?XTransformPort=3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: activeProduct.slug,
          language,
          tone: 'premium',
          objective: 'conversion',
        }),
      })

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const data = await res.json()
      if (data?.description) {
        setAiDescriptions((prev) => ({
          ...prev,
          [activeProduct.slug]: {
            ...prev[activeProduct.slug],
            [language]: data.description,
          },
        }))
        toast.success(t(language, 'mktShowcaseAiGenerate'))
      } else {
        throw new Error('No description in response')
      }
    } catch (err) {
      console.warn('[AI Generate] Failed:', err)
      toast.error(t(language, 'mktShowcaseStaticMode'))
    } finally {
      setIsGenerating(false)
    }
  }, [isGenerating, activeProduct.slug, language])

  // ─── Auto-play timer ──────────────────────────────────────────────────

  const clearAutoPlayTimer = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current)
      autoPlayTimerRef.current = null
    }
  }, [])

  // ─── Navigation ────────────────────────────────────────────────────────

  const goTo = useCallback(
    (index: number) => {
      const clamped = ((index % marketingProducts.length) + marketingProducts.length) % marketingProducts.length
      setActiveIndex(clamped)
      setImageLoaded(false)
      stopSpeech()
      clearTyping()
      clearAutoPlayTimer()
    },
    [stopSpeech, clearTyping, clearAutoPlayTimer]
  )

  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex])
  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex])

  const handleProductClick = useCallback(
    (index: number) => goTo(index),
    [goTo]
  )

  // ─── When language changes, reset image loaded state ────────────────
  useEffect(() => {
    setImageLoaded(false)
  }, [language])

  // ─── When activeIndex changes, start typing ────────────────────────────

  useEffect(() => {
    const product = marketingProducts[activeIndex]
    const desc = (aiDescriptions[product.slug]?.[language]) || product.descriptions[language]
    startTyping(desc)
  }, [activeIndex, language, startTyping, aiDescriptions])

  // ─── Auto-play: after typing finishes + 2s, go next ────────────────────

  useEffect(() => {
    if (!autoPlay || isSpeaking) return

    const product = marketingProducts[activeIndex]
    const desc = (aiDescriptions[product.slug]?.[language]) || product.descriptions[language]
    if (displayedText.length < desc.length) return

    clearAutoPlayTimer()
    autoPlayTimerRef.current = setTimeout(() => {
      goNext()
    }, 2500)

    return clearAutoPlayTimer
  }, [autoPlay, isSpeaking, displayedText.length, activeIndex, language, goNext, clearAutoPlayTimer, aiDescriptions])

  // ─── Cleanup on unmount ────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      stopSpeech()
      clearTyping()
      clearAutoPlayTimer()
    }
  }, [stopSpeech, clearTyping, clearAutoPlayTimer])

  // ─── Render ────────────────────────────────────────────────────────────

  const waveformBars = 24

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* ── Header ────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 sm:mb-10"
      >
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="relative">
            <BrainCircuit className="w-7 h-7 text-emerald-500" />
            <motion.div
              className="absolute -inset-1 rounded-full bg-emerald-400/30 blur-sm"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 gap-1 px-3 py-1">
            <Sparkles className="w-3 h-3" /> IA
          </Badge>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
          {t(language, 'mktShowcaseTitle')}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          {t(language, 'mktShowcaseSubtitle')}
        </p>
      </motion.header>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

        {/* ── Left: Product Carousel ───────────────────────────────────── */}
        <div className="lg:col-span-4">
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 lg:max-h-[520px] lg:overflow-y-auto">
            {marketingProducts.map((product, idx) => {
              const isActive = idx === activeIndex
              const c = colorMap[product.color as ProductColor]
              const Icon = getIcon(product.icon)

              return (
                <motion.button
                  key={product.slug}
                  onClick={() => handleProductClick(idx)}
                  className={cn(
                    'relative flex-shrink-0 flex items-center gap-3 p-3 sm:p-4 rounded-xl transition-all duration-300 cursor-pointer w-full min-w-[180px] lg:min-w-0',
                    isActive
                      ? cn('bg-white shadow-lg', c.glow, 'shadow-lg')
                      : 'bg-white/50 hover:bg-white hover:shadow-md'
                  )}
                  whileHover={{ scale: isActive ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-showcase-ring"
                      className={cn('absolute inset-0 rounded-xl ring-2', c.ring)}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}

                  <div
                    className={cn(
                      'w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300',
                      c.bg, c.text,
                      isActive && 'scale-110'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className={cn(
                    'text-sm font-medium truncate',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {product.names[language]}
                  </span>

                  {isActive && (
                    <motion.div
                      className={cn('w-2 h-2 rounded-full shrink-0', c.bg.replace('100', '500'))}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* ── Right: Presentation Panel ─────────────────────────────────── */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 flex flex-col gap-4">

            {/* Product badge + AI generate button */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={cn('text-xs font-semibold px-3 py-1', colors.bg, colors.text, 'border-current/10')}
              >
                {activeProduct.names[language]}
              </Badge>
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                AI Powered
              </Badge>
              {aiDescriptions[activeProduct.slug]?.[language] && (
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-emerald-300 text-emerald-600">
                  <Sparkles className="w-3 h-3 mr-1" /> AI
                </Badge>
              )}
              <div className="flex-1" />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className="gap-1.5 text-xs cursor-pointer"
              >
                {isGenerating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {isGenerating
                  ? t(language, 'mktShowcaseGenerating')
                  : t(language, 'mktShowcaseAiGenerate')}
              </Button>
            </div>

            {/* Image area */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/30">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${activeIndex}-${getImageSrc(activeProduct.slug, language)}`}
                  src={getImageSrc(activeProduct.slug, language)}
                  alt={activeProduct.names[language]}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.5 }}
                  onLoad={() => setImageLoaded(true)}
                  className={cn(
                    'w-full h-full object-cover transition-opacity duration-300',
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </AnimatePresence>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-muted/50 animate-pulse flex items-center justify-center">
                  <ActiveIcon className={cn('w-10 h-10 animate-pulse', colors.text)} />
                </div>
              )}
            </div>

            {/* Description with typing effect */}
            <div className="min-h-[80px] sm:min-h-[100px]">
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {displayedText}
                {displayedText.length < description.length && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                    className={cn(
                      'inline-block w-0.5 h-4 sm:h-5 bg-emerald-500 align-middle',
                      isRTL ? 'mr-0.5' : 'ml-0.5'
                    )}
                  />
                )}
              </p>
            </div>

            {/* Audio player bar — Web Speech API */}
            {speechSupported && (
              <div dir="ltr" className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                {/* Voice gender toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setVoiceGender((g) => g === 'female' ? 'male' : 'female')}
                  className="h-9 w-9 rounded-full flex-shrink-0 hover:bg-muted"
                  aria-label={voiceGender === 'female'
                    ? t(language, 'mktShowcaseFemaleVoice')
                    : t(language, 'mktShowcaseMaleVoice')}
                  title={voiceGender === 'female'
                    ? t(language, 'mktShowcaseFemaleVoice')
                    : t(language, 'mktShowcaseMaleVoice')}
                >
                  {voiceGender === 'female'
                    ? <User className="w-4 h-4 text-pink-500" />
                    : <UserCheck className="w-4 h-4 text-blue-500" />}
                </Button>

                {/* Play/Stop button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSpeech}
                  className={cn(
                    'h-9 w-9 rounded-full flex-shrink-0',
                    isSpeaking
                      ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                      : 'hover:bg-muted'
                  )}
                  aria-label={isSpeaking
                    ? t(language, 'mktShowcaseStopVoice')
                    : t(language, 'mktShowcasePlayVoice')}
                >
                  {isSpeaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>

                {/* Waveform visualizer */}
                <div className="flex-1 flex items-center gap-[2px] h-8 overflow-hidden">
                  {Array.from({ length: waveformBars }).map((_, i) => {
                    const barProgress = i / waveformBars
                    const isActiveBar = barProgress <= speechProgress / 100
                    return (
                      <motion.div
                        key={i}
                        className={cn(
                          'flex-1 rounded-full min-w-[2px]',
                          isActiveBar
                            ? 'bg-emerald-500'
                            : 'bg-muted-foreground/20'
                        )}
                        animate={
                          isSpeaking
                            ? { height: ['30%', `${30 + Math.random() * 70}%`] }
                            : { height: '40%' }
                        }
                        transition={
                          isSpeaking
                            ? {
                                duration: 0.3 + (i % 3) * 0.1,
                                repeat: Infinity,
                                repeatType: 'reverse',
                                ease: 'easeInOut',
                              }
                            : { duration: 0.3 }
                        }
                      />
                    )
                  })}
                </div>

                {/* Volume icon */}
                <div className="flex items-center gap-2 flex-shrink-0 text-xs text-muted-foreground">
                  {isSpeaking ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span className="tabular-nums">{Math.round(speechProgress)}%</span>
                </div>
              </div>
            )}

            {/* TTS backend indicator */}
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
              <Mic className="w-3 h-3" />
              <span>Web Speech API {voiceReady && '· ' + (voiceGender === 'female' ? '♀' : '♂')}</span>
            </div>

          </div>

          {/* ── Navigation bar ──────────────────────────────────────────── */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={goPrev}
              className="gap-1.5 cursor-pointer"
            >
              {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              {t(language, 'mktShowcasePrev')}
            </Button>

            {/* Dot indicators */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {marketingProducts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={cn(
                    'rounded-full transition-all duration-300 cursor-pointer',
                    idx === activeIndex
                      ? 'w-5 h-2 bg-emerald-500'
                      : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  )}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goNext}
              className="gap-1.5 cursor-pointer"
            >
              {t(language, 'mktShowcaseNext')}
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>

          {/* Auto-play toggle */}
          <div className="flex justify-center mt-3">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={cn(
                'flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
                autoPlay
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              <motion.div
                className={cn(
                  'w-8 h-4 rounded-full relative transition-colors',
                  autoPlay ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                )}
              >
                <motion.div
                  className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm"
                  animate={{ [isRTL ? 'right' : 'left']: autoPlay ? '16px' : '2px' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.div>
              {t(language, 'mktShowcaseAutoPlay')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
