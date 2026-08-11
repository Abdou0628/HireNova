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
  Mail,
  MessageSquare,
  Linkedin,
  Compass,
  Plane,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Loader2,
  BrainCircuit,
} from 'lucide-react'
import { useCVStore, type CVLanguage } from '@/store/cv-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// ─── Product definitions ───────────────────────────────────────────────────

const PRODUCTS = [
  { slug: 'cv', icon: FileText, color: 'emerald' },
  { slug: 'cover-letter', icon: Mail, color: 'blue' },
  { slug: 'interview', icon: MessageSquare, color: 'violet' },
  { slug: 'linkedin', icon: Linkedin, color: 'sky' },
  { slug: 'career', icon: Compass, color: 'amber' },
  { slug: 'mobility', icon: Plane, color: 'rose' },
] as const

type ProductColor = 'emerald' | 'blue' | 'violet' | 'sky' | 'amber' | 'rose'

const colorMap: Record<
  ProductColor,
  { bg: string; text: string; ring: string; glow: string }
> = {
  emerald: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    ring: 'ring-emerald-400',
    glow: 'shadow-emerald-400/50',
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    ring: 'ring-blue-400',
    glow: 'shadow-blue-400/50',
  },
  violet: {
    bg: 'bg-violet-100',
    text: 'text-violet-600',
    ring: 'ring-violet-400',
    glow: 'shadow-violet-400/50',
  },
  sky: {
    bg: 'bg-sky-100',
    text: 'text-sky-600',
    ring: 'ring-sky-400',
    glow: 'shadow-sky-400/50',
  },
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    ring: 'ring-amber-400',
    glow: 'shadow-amber-400/50',
  },
  rose: {
    bg: 'bg-rose-100',
    text: 'text-rose-600',
    ring: 'ring-rose-400',
    glow: 'shadow-rose-400/50',
  },
}

// ─── i18n ──────────────────────────────────────────────────────────────────

const PRODUCT_NAMES: Record<
  CVLanguage,
  Record<string, string>
> = {
  fr: {
    cv: 'CV IA Professionnel',
    'cover-letter': "Lettre de Motivation IA",
    interview: 'Simulateur Entretien IA',
    linkedin: 'Optimiseur LinkedIn IA',
    career: 'Plan de Carri\u00e8re IA',
    mobility: 'Mobilit\u00e9 Internationale',
  },
  en: {
    cv: 'Professional AI Resume',
    'cover-letter': 'AI Cover Letter',
    interview: 'AI Interview Simulator',
    linkedin: 'LinkedIn AI Optimizer',
    career: 'AI Career Roadmap',
    mobility: 'International Mobility',
  },
  ar: {
    cv: '\u0633\u064a\u0631\u0629 \u0630\u0627\u062a\u064a\u0629 \u0627\u062d\u062a\u0631\u0627\u0641\u064a\u0629 IA',
    'cover-letter': '\u0631\u0633\u0627\u0644\u0629 \u062a\u062d\u0641\u064a\u0632\u064a\u0629 IA',
    interview: '\u0645\u062d\u0627\u0643\u064a \u0645\u0642\u0627\u0628\u0644\u0629 IA',
    linkedin: '\u0645\u062d\u0633\u0651\u0646 \u0644\u064a\u0646\u0643\u062f\u0625\u0646 IA',
    career: '\u062e\u0637\u0629 \u0645\u0633\u0627\u0631 \u0645\u0647\u0646\u064a IA',
    mobility: '\u0627\u0644\u062a\u0646\u0642\u0644 \u0627\u0644\u062f\u0648\u0644\u064a',
  },
  es: {
    cv: 'CV Profesional IA',
    'cover-letter': 'Carta de Presentaci\u00f3n IA',
    interview: 'Simulador de Entrevista IA',
    linkedin: 'Optimizador LinkedIn IA',
    career: 'Plan de Carrera IA',
    mobility: 'Movilidad Internacional',
  },
}

const LABELS: Record<CVLanguage, Record<string, string>> = {
  fr: {
    title: "D\u00e9couvrez nos produits avec l'IA",
    subtitle:
      "L'intelligence artificielle vous pr\u00e9sente chaque outil en d\u00e9tail",
    generating: "L'IA pr\u00e9pare la pr\u00e9sentation...",
    generatingDesc: "G\u00e9n\u00e9ration de l'image et de la voix en cours",
    playVoice: '\u00c9couter la pr\u00e9sentation',
    stopVoice: 'Arr\u00eater',
    next: 'Suivant',
    prev: 'Pr\u00e9c\u00e9dent',
    autoPlay: 'Lecture auto',
    tapToExplore: 'Cliquez sur un produit pour l\'explorer',
  },
  en: {
    title: 'Discover our products with AI',
    subtitle: 'Artificial intelligence presents each tool in detail',
    generating: 'AI is preparing the presentation...',
    generatingDesc: 'Generating image and voice',
    playVoice: 'Listen to presentation',
    stopVoice: 'Stop',
    next: 'Next',
    prev: 'Previous',
    autoPlay: 'Auto play',
    tapToExplore: 'Click a product to explore it',
  },
  ar: {
    title: '\u0627\u0643\u062a\u0634\u0641 \u0645\u0646\u062a\u062c\u0627\u062a\u0646\u0627 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a',
    subtitle:
      '\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u064a\u0642\u062f\u0645 \u0643\u0644 \u0623\u062f\u0627\u0629 \u0628\u0627\u0644\u062a\u0641\u0635\u064a\u0644',
    generating: '\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u064a\u062d\u0636\u0631 \u0627\u0644\u0639\u0631\u0636...',
    generatingDesc: '\u062c\u0627\u0631\u064d \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0635\u0648\u0631\u0629 \u0648\u0627\u0644\u0635\u0648\u062a',
    playVoice: '\u0627\u0633\u062a\u0645\u0639 \u0644\u0644\u0639\u0631\u0636',
    stopVoice: '\u0625\u064a\u0642\u0627\u0641',
    next: '\u0627\u0644\u062a\u0627\u0644\u064a',
    prev: '\u0627\u0644\u0633\u0627\u0628\u0642',
    autoPlay: '\u062a\u0634\u063a\u064a\u0644 \u062a\u0644\u0642\u0627\u0626\u064a',
    tapToExplore: '\u0627\u0646\u0642\u0631 \u0639\u0644\u0649 \u0645\u0646\u062a\u062c \u0644\u0627\u0633\u062a\u0643\u0634\u0627\u0641\u0647',
  },
  es: {
    title: 'Descubre nuestros productos con IA',
    subtitle:
      'La inteligencia artificial presenta cada herramienta en detalle',
    generating: 'La IA est\u00e1 preparando la presentaci\u00f3n...',
    generatingDesc: 'Generando imagen y voz',
    playVoice: 'Escuchar presentaci\u00f3n',
    stopVoice: 'Detener',
    next: 'Siguiente',
    prev: 'Anterior',
    autoPlay: 'Reproducci\u00f3n auto',
    tapToExplore: 'Haz clic en un producto para explorarlo',
  },
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface Presentation {
  description: string
  imageBase64: string
  audioBase64: string
  productName: string
  cached: boolean
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function AIAnimatedShowcase() {
  const language = useCVStore((s) => s.language)
  const isRTL = language === 'ar'
  const labels = LABELS[language]

  // State
  const [activeIndex, setActiveIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [autoPlay, setAutoPlay] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const blobUrlRef = useRef<string | null>(null)
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const generationAbortRef = useRef<AbortController | null>(null)

  const activeProduct = PRODUCTS[activeIndex]
  const colors = colorMap[activeProduct.color as ProductColor]

  // ─── Cleanup helpers ────────────────────────────────────────────────────

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setAudioProgress(0)
  }, [])

  const clearTyping = useCallback(() => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
      typingIntervalRef.current = null
    }
    setDisplayedText('')
  }, [])

  const clearAutoPlayTimer = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current)
      autoPlayTimerRef.current = null
    }
  }, [])

  const revokeBlobUrl = useCallback(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
  }, [])

  // ─── Typing effect ──────────────────────────────────────────────────────

  const startTyping = useCallback(
    (text: string) => {
      clearTyping()
      let idx = 0
      typingIntervalRef.current = setInterval(() => {
        idx++
        setDisplayedText(text.slice(0, idx))
        if (idx >= text.length) {
          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
          typingIntervalRef.current = null
        }
      }, 30)
    },
    [clearTyping],
  )

  // ─── Audio setup ────────────────────────────────────────────────────────

  const setupAudio = useCallback(
    (audioBase64: string) => {
      // Clean up previous
      stopAudio()
      revokeBlobUrl()

      try {
        const binaryStr = atob(audioBase64)
        const bytes = Uint8Array.from(binaryStr, (c) => c.charCodeAt(0))
        const blob = new Blob([bytes], { type: 'audio/mp3' })
        const url = URL.createObjectURL(blob)
        blobUrlRef.current = url

        const audio = new Audio(url)
        audioRef.current = audio

        audio.addEventListener('loadedmetadata', () => {
          setAudioDuration(audio.duration)
        })

        audio.addEventListener('timeupdate', () => {
          if (audio.duration) {
            setAudioProgress(audio.currentTime / audio.duration)
          }
        })

        audio.addEventListener('ended', () => {
          setIsPlaying(false)
          setAudioProgress(0)
        })
      } catch {
        // Audio creation failed, fail silently
      }
    },
    [stopAudio, revokeBlobUrl],
  )

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(() => {
        // Playback failed
      })
      setIsPlaying(true)
    }
  }, [isPlaying])

  // ─── Fetch presentation ─────────────────────────────────────────────────

  const fetchPresentation = useCallback(
    async (index: number) => {
      // Abort previous
      if (generationAbortRef.current) {
        generationAbortRef.current.abort()
      }
      const controller = new AbortController()
      generationAbortRef.current = controller

      stopAudio()
      clearTyping()
      clearAutoPlayTimer()
      setImageLoaded(false)
      setPresentation(null)
      setIsGenerating(true)

      const slug = PRODUCTS[index].slug
      try {
        const res = await fetch('/api/ai/product-presentation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productSlug: slug, language }),
          signal: controller.signal,
        })
        if (!res.ok) throw new Error('Failed to fetch')
        const data: Presentation = await res.json()

        if (controller.signal.aborted) return

        setPresentation(data)
        setIsGenerating(false)
        setImageLoaded(false)
        startTyping(data.description)

        if (data.audioBase64) {
          setupAudio(data.audioBase64)
        }
      } catch {
        if (!controller.signal.aborted) {
          setIsGenerating(false)
        }
      }
    },
    [language, stopAudio, clearTyping, clearAutoPlayTimer, startTyping, setupAudio],
  )

  // ─── Navigation ─────────────────────────────────────────────────────────

  const goTo = useCallback(
    (index: number) => {
      const clamped = ((index % PRODUCTS.length) + PRODUCTS.length) % PRODUCTS.length
      setActiveIndex(clamped)
      fetchPresentation(clamped)
      clearAutoPlayTimer()
    },
    [fetchPresentation, clearAutoPlayTimer],
  )

  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex])
  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex])

  const handleProductClick = useCallback(
    (index: number) => {
      if (index === activeIndex && presentation) return
      goTo(index)
    },
    [goTo, activeIndex, presentation],
  )

  // ─── Auto-play: when audio ends, wait 2s then go next ──────────────────

  useEffect(() => {
    if (!autoPlay || isPlaying || isGenerating) return
    if (!presentation) return

    clearAutoPlayTimer()
    autoPlayTimerRef.current = setTimeout(() => {
      goNext()
    }, 2000)

    return () => {
      clearAutoPlayTimer()
    }
  }, [autoPlay, isPlaying, isGenerating, presentation, goNext, clearAutoPlayTimer])

  // ─── Auto-play audio when presentation is ready ─────────────────────────

  useEffect(() => {
    if (presentation?.audioBase64 && audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // auto-play may be blocked by browser
        })
    }
    // Auto-play is intentionally triggered only by audioBase64 change
  }, [presentation?.audioBase64])

  // ─── Initial load ───────────────────────────────────────────────────────

  useEffect(() => {
    fetchPresentation(0)
    // Initial load on mount + language change
  }, [language])

  // ─── Cleanup on unmount ─────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      stopAudio()
      clearTyping()
      clearAutoPlayTimer()
      revokeBlobUrl()
      if (generationAbortRef.current) {
        generationAbortRef.current.abort()
      }
    }
  }, [stopAudio, clearTyping, clearAutoPlayTimer, revokeBlobUrl])

  // ─── Waveform bars (decorative) ─────────────────────────────────────────

  const waveformBars = 24

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* ── Header ────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 sm:mb-12"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
          <BrainCircuit className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
            {labels.title}
          </h2>
          <div className="absolute -top-2 -right-2 sm:top-0 sm:right-0">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
        </motion.div>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          {labels.subtitle}
        </p>
      </motion.header>

      {/* ── Main Stage ─────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* ── Left: Product Carousel ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:w-48 xl:w-56 flex-shrink-0"
        >
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {PRODUCTS.map((product, idx) => {
              const Icon = product.icon
              const pColors = colorMap[product.color as ProductColor]
              const isActive = idx === activeIndex
              return (
                <motion.button
                  key={product.slug}
                  onClick={() => handleProductClick(idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'relative flex items-center gap-3 rounded-xl p-2.5 transition-colors min-w-[160px] lg:min-w-0',
                    'text-start cursor-pointer border',
                    isActive
                      ? cn(
                          pColors.bg,
                          'border-current/10 shadow-lg',
                          pColors.glow,
                        )
                      : 'bg-card border-transparent hover:bg-muted/50',
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeProduct"
                      className={cn(
                        'absolute inset-0 rounded-xl ring-2',
                        pColors.ring,
                      )}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <div
                    className={cn(
                      'relative z-10 flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0',
                      pColors.bg,
                    )}
                  >
                    <Icon
                      className={cn('w-5 h-5', pColors.text)}
                    />
                  </div>
                  <span
                    className={cn(
                      'relative z-10 text-xs font-medium leading-tight truncate',
                      isActive ? pColors.text : 'text-foreground',
                    )}
                  >
                    {PRODUCT_NAMES[language][product.slug]}
                  </span>
                  {isActive && (
                    <motion.div
                      className={cn(
                        'absolute -top-1 -right-1 w-3 h-3 rounded-full',
                        pColors.bg,
                      )}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
          <p className="hidden lg:block mt-4 text-[11px] text-muted-foreground text-center">
            {labels.tapToExplore}
          </p>
        </motion.div>

        {/* ── Right: Presentation Panel ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 min-w-0"
        >
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card to-card/80">
            <CardContent className="p-4 sm:p-6 space-y-5">
              {/* Product badge */}
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs font-semibold px-3 py-1',
                    colors.bg,
                    colors.text,
                    'border-current/10',
                  )}
                >
                  {PRODUCT_NAMES[language][activeProduct.slug]}
                </Badge>
                {presentation?.cached && (
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                    cached
                  </Badge>
                )}
              </div>

              {/* Image area */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/30">
                {isGenerating ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="relative">
                      <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BrainCircuit className="w-5 h-5 text-emerald-700" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {labels.generating}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {labels.generatingDesc}
                    </p>
                    {/* Shimmer skeleton */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    </div>
                  </div>
                ) : presentation?.imageBase64 ? (
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${activeIndex}-${presentation.productName}`}
                      src={`data:image/png;base64,${presentation.imageBase64}`}
                      alt={presentation.productName}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      onLoad={() => setImageLoaded(true)}
                      className={cn(
                        'w-full h-full object-cover transition-opacity duration-300',
                        imageLoaded ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-muted/50 animate-pulse" />
                    )}
                  </AnimatePresence>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={cn('w-16 h-16 rounded-full', colors.bg, 'flex items-center justify-center')}>
                      {React.createElement(activeProduct.icon, { className: cn('w-8 h-8', colors.text) })}
                    </div>
                  </div>
                )}
              </div>

              {/* Description with typing effect */}
              <div className="min-h-[80px] sm:min-h-[100px]">
                {displayedText ? (
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {displayedText}
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: 'reverse',
                      }}
                      className="inline-block w-0.5 h-4 sm:h-5 bg-emerald-500 ml-0.5 align-middle"
                    />
                  </p>
                ) : isGenerating ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded-md animate-pulse w-full" />
                    <div className="h-4 bg-muted rounded-md animate-pulse w-5/6" />
                    <div className="h-4 bg-muted rounded-md animate-pulse w-4/6" />
                  </div>
                ) : null}
              </div>

              {/* Audio player bar */}
              {presentation?.audioBase64 && !isGenerating && (
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleAudio}
                    className={cn(
                      'h-9 w-9 rounded-full flex-shrink-0',
                      isPlaying
                        ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                        : 'hover:bg-muted',
                    )}
                    aria-label={isPlaying ? labels.stopVoice : labels.playVoice}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ms-0.5" />
                    )}
                  </Button>

                  {/* Waveform visualizer */}
                  <div className="flex-1 flex items-center gap-[2px] h-8 overflow-hidden">
                    {Array.from({ length: waveformBars }).map((_, i) => {
                      const center = waveformBars / 2
                      const dist = Math.abs(i - center) / center
                      const baseHeight = Math.max(15, 100 - dist * 70)
                      return (
                        <motion.div
                          key={i}
                          className={cn(
                            'flex-1 rounded-full min-w-[3px]',
                            isPlaying ? 'bg-emerald-500' : 'bg-muted-foreground/20',
                          )}
                          animate={
                            isPlaying
                              ? {
                                  height: [
                                    `${baseHeight * 0.4}%`,
                                    `${baseHeight * 1.1}%`,
                                    `${baseHeight * 0.6}%`,
                                    `${baseHeight * 0.9}%`,
                                    `${baseHeight * 0.4}%`,
                                  ],
                                }
                              : { height: `${baseHeight * 0.5}%` }
                          }
                          transition={
                            isPlaying
                              ? {
                                  duration: 1.2 + i * 0.05,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                  delay: i * 0.03,
                                }
                              : { duration: 0.3 }
                          }
                        />
                      )
                    })}
                  </div>

                  {/* Volume icon indicator */}
                  <div className="flex-shrink-0 hidden sm:flex">
                    {isPlaying ? (
                      <Volume2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* Time / progress */}
                  <span className="text-[10px] text-muted-foreground tabular-nums flex-shrink-0 w-10 text-end">
                    {audioDuration > 0
                      ? `${Math.floor(audioRef.current?.currentTime ?? 0)}s / ${Math.floor(audioDuration)}s`
                      : '--:--'}
                  </span>
                </div>
              )}

              {/* Progress bar */}
              {audioDuration > 0 && !isGenerating && (
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${audioProgress * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 flex items-center justify-center gap-3 sm:gap-4"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={goPrev}
          disabled={isGenerating}
          className="gap-1.5 rounded-full px-4"
        >
          <ChevronLeft className={cn('w-4 h-4', isRTL ? 'rotate-180' : '')} />
          <span className="hidden sm:inline">{labels.prev}</span>
        </Button>

        {/* Dots indicator */}
        <div className="flex items-center gap-1.5">
          {PRODUCTS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={cn(
                'rounded-full transition-all duration-300 cursor-pointer',
                idx === activeIndex
                  ? 'w-6 h-2 bg-emerald-500'
                  : 'w-2 h-2 bg-muted-foreground/25 hover:bg-muted-foreground/50',
              )}
              aria-label={`Go to product ${idx + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={goNext}
          disabled={isGenerating}
          className="gap-1.5 rounded-full px-4"
        >
          <span className="hidden sm:inline">{labels.next}</span>
          <ChevronRight className={cn('w-4 h-4', isRTL ? 'rotate-180' : '')} />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant={autoPlay ? 'default' : 'outline'}
          size="sm"
          onClick={() => setAutoPlay((v) => !v)}
          className={cn(
            'gap-1.5 rounded-full px-4 transition-colors',
            autoPlay && 'bg-emerald-600 hover:bg-emerald-700 text-white',
          )}
        >
          {autoPlay ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{labels.autoPlay}</span>
        </Button>
      </motion.nav>
    </section>
  )
}
