'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, Target, TrendingUp, FileText, CheckCircle2, AlertTriangle,
  ChevronRight, ChevronLeft, Clock, Star, Loader2, Award,
  RotateCcw, BarChart3, Sparkles, Brain, Briefcase, GraduationCap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useCVStore } from '@/store/cv-store'
import { useSession } from 'next-auth/react'

// ─── Types ────────────────────────────────────────────────

interface InterviewQuestion {
  index: number
  question: string
}

interface InterviewSetup {
  jobTitle: string
  industry: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  interviewType: 'behavioral' | 'technical' | 'mixed'
}

interface AnswerResult {
  score: number
  feedback: string
  tips: string[]
  followUp: string
  isLast: boolean
}

interface FinalReport {
  averageScore: number
  strengths: string[]
  weaknesses: string[]
  improvementPlan: string[]
  recommendation: string
  totalQuestions: number
  jobTitle: string
  industry: string
  difficulty: string
}

type Screen = 'setup' | 'loading' | 'question' | 'evaluating' | 'feedback' | 'report'

const INDUSTRIES = [
  'Technologie / IT',
  'Finance / Banque',
  'Marketing / Communication',
  'Ressources Humaines',
  'Santé / Médical',
  'Éducation / Formation',
  'Ingénierie',
  'Commerce / Vente',
  'Juridique / Droit',
  'Design / Créatif',
  'Logistique / Supply Chain',
  'Administration / Gestion',
  'Autre',
]

const DIFFICULTIES = [
  { value: 'beginner', label: 'Débutant', desc: 'Premier entretien, questions simples', icon: GraduationCap },
  { value: 'intermediate', label: 'Intermédiaire', desc: 'Expérience professionnelle confirmée', icon: Briefcase },
  { value: 'advanced', label: 'Avancé', desc: 'Poste senior / management', icon: Award },
]

const INTERVIEW_TYPES = [
  { value: 'behavioral', label: 'Comportemental', desc: 'Situations, comportements, soft skills' },
  { value: 'technical', label: 'Technique', desc: 'Compétences techniques du métier' },
  { value: 'mixed', label: 'Mixte', desc: 'Combinaison comportemental + technique' },
]

// ─── Component ────────────────────────────────────────────

export default function InterviewSimulator() {
  const { language } = useCVStore()
  const { data: session } = useSession()

  const [screen, setScreen] = useState<Screen>('setup')
  const [setup, setSetup] = useState<InterviewSetup>({
    jobTitle: '',
    industry: '',
    difficulty: 'intermediate',
    interviewType: 'behavioral',
  })
  const [sessionId, setSessionId] = useState<string>('')
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<AnswerResult | null>(null)
  const [report, setReport] = useState<FinalReport | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if user has active plan
  const userPlan = (session?.user as { plan?: string } | undefined)?.plan ?? 'free'
  const paidPlans = ['starter', 'pro', 'career_plus', 'employer', 'annual', 'lifetime']
  const hasPlan = paidPlans.includes(userPlan)

  const startInterview = useCallback(async () => {
    if (!setup.jobTitle.trim() || !setup.industry) {
      toast.error('Veuillez remplir le titre du poste et le secteur')
      return
    }
    if (!hasPlan) {
      toast.warning('Abonnement requis pour le simulateur entretien IA', { duration: 4000 })
      return
    }

    setScreen('loading')
    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setup),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur')
      }

      setSessionId(data.sessionId)
      setQuestions(data.questions)
      setCurrentIndex(0)
      setAnswer('')
      setScreen('question')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur de connexion')
      setScreen('setup')
    }
  }, [setup, hasPlan])

  const submitAnswer = useCallback(async () => {
    if (!answer.trim()) {
      toast.error('Veuillez rédiger votre réponse')
      return
    }

    setIsSubmitting(true)
    setScreen('evaluating')
    try {
      const res = await fetch('/api/interview/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionIndex: questions[currentIndex].index,
          answer,
        }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erreur')

      setResult(data)
      setScreen('feedback')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
      setScreen('question')
    } finally {
      setIsSubmitting(false)
    }
  }, [answer, sessionId, questions, currentIndex])

  const nextQuestion = useCallback(() => {
    if (result?.isLast) {
      completeInterview()
    } else {
      setCurrentIndex((prev) => prev + 1)
      setAnswer('')
      setResult(null)
      setScreen('question')
    }
  }, [result])

  const completeInterview = useCallback(async () => {
    setScreen('loading')
    try {
      const res = await fetch('/api/interview/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erreur')

      setReport(data.report)
      setScreen('report')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
      setScreen('feedback')
    }
  }, [sessionId])

  const restart = () => {
    setScreen('setup')
    setQuestions([])
    setCurrentIndex(0)
    setAnswer('')
    setResult(null)
    setReport(null)
    setSessionId('')
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600'
    if (score >= 50) return 'text-amber-600'
    return 'text-red-500'
  }

  const getScoreBg = (score: number) => {
    if (score >= 75) return 'bg-emerald-500'
    if (score >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/20 to-white">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold">
              <Sparkles className="w-3 h-3 mr-1" />
              IA
            </Badge>
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Simulateur d&apos;Entretien IA
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Pratiquez vos entretiens avec une IA experte. Recevez un feedback instantané
            et un plan d&apos;amélioration personnalisé.
          </p>
        </div>

        {/* Progress bar during interview */}
        {['question', 'evaluating', 'feedback'].includes(screen) && questions.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Question {currentIndex + 1} sur {questions.length}</span>
              <span>{Math.round(((currentIndex + (screen === 'feedback' ? 1 : 0)) / questions.length) * 100)}%</span>
            </div>
            <Progress
              value={((currentIndex + (screen === 'feedback' ? 1 : 0)) / questions.length) * 100}
              className="h-2"
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ===== SETUP SCREEN ===== */}
          {screen === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card className="border-2 border-emerald-200 shadow-lg shadow-emerald-100/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    Configurer votre entretien
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Job Title */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Titre du poste *
                    </label>
                    <input
                      type="text"
                      value={setup.jobTitle}
                      onChange={(e) => setSetup({ ...setup, jobTitle: e.target.value })}
                      placeholder="ex: Développeur Frontend, Chef de projet, Analyste marketing..."
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Secteur d&apos;activité *
                    </label>
                    <select
                      value={setup.industry}
                      onChange={(e) => setSetup({ ...setup, industry: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    >
                      <option value="">Sélectionner un secteur...</option>
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Niveau de difficulté
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {DIFFICULTIES.map((d) => (
                        <button
                          key={d.value}
                          onClick={() => setSetup({ ...setup, difficulty: d.value as InterviewSetup['difficulty'] })}
                          className={`p-3 rounded-lg border-2 text-center transition-all cursor-pointer ${
                            setup.difficulty === d.value
                              ? 'border-emerald-600 bg-emerald-50 shadow-sm'
                              : 'border-muted hover:border-emerald-300'
                          }`}
                        >
                          <d.icon className={`w-5 h-5 mx-auto mb-1 ${setup.difficulty === d.value ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                          <p className="text-xs font-semibold">{d.label}</p>
                          <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{d.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interview Type */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Type d&apos;entretien
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {INTERVIEW_TYPES.map((t) => (
                        <button
                          key={t.value}
                          onClick={() => setSetup({ ...setup, interviewType: t.value as InterviewSetup['interviewType'] })}
                          className={`p-3 rounded-lg border-2 text-center transition-all cursor-pointer ${
                            setup.interviewType === t.value
                              ? 'border-emerald-600 bg-emerald-50 shadow-sm'
                              : 'border-muted hover:border-emerald-300'
                          }`}
                        >
                          <p className="text-xs font-semibold">{t.label}</p>
                          <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {!hasPlan && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Abonnement requis pour le simulateur entretien IA. <button onClick={() => {}} className="underline font-semibold cursor-pointer">Voir les tarifs</button></span>
                    </div>
                  )}

                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 text-sm font-semibold cursor-pointer shadow-md shadow-emerald-600/30"
                    onClick={startInterview}
                    disabled={!setup.jobTitle.trim() || !setup.industry || !hasPlan}
                  >
                    <Mic className="mr-2 w-4 h-4" />
                    Commencer l&apos;entretien
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ===== LOADING SCREEN ===== */}
          {screen === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4 animate-pulse">
                <Brain className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {report ? 'Génération du rapport final...' : "L'IA prépare vos questions..."}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Cela peut prendre quelques secondes</p>
            </motion.div>
          )}

          {/* ===== QUESTION SCREEN ===== */}
          {screen === 'question' && questions[currentIndex] && (
            <motion.div
              key={`question-${currentIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-2 border-emerald-200 shadow-lg">
                <CardContent className="p-6">
                  {/* Question number badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1">
                      Question {currentIndex + 1}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {setup.difficulty === 'beginner' ? 'Débutant' : setup.difficulty === 'advanced' ? 'Avancé' : 'Intermédiaire'}
                    </Badge>
                  </div>

                  {/* Question */}
                  <h2 className="text-lg font-semibold text-foreground mb-1 leading-relaxed">
                    {questions[currentIndex].question}
                  </h2>
                  <p className="text-xs text-muted-foreground mb-6">
                    Poste : {setup.jobTitle} • {setup.industry}
                  </p>

                  {/* Answer textarea */}
                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Rédigez votre réponse comme si vous étiez en entretien réel..."
                    className="min-h-[160px] text-sm resize-y rounded-lg border-input focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-muted-foreground">
                      {answer.length} caractères
                    </p>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-2.5 text-sm font-semibold cursor-pointer shadow-md shadow-emerald-600/20"
                      onClick={submitAnswer}
                      disabled={!answer.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      )}
                      Valider ma réponse
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ===== EVALUATING SCREEN ===== */}
          {screen === 'evaluating' && (
            <motion.div
              key="evaluating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4 animate-pulse">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                L&apos;IA évalue votre réponse...
              </p>
            </motion.div>
          )}

          {/* ===== FEEDBACK SCREEN ===== */}
          {screen === 'feedback' && result && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-2 shadow-lg overflow-hidden">
                {/* Score header */}
                <div className="p-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-emerald-100 mb-1">Score obtenu</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold">{result.score}</span>
                        <span className="text-emerald-200">/100</span>
                      </div>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      {result.score >= 75 ? (
                        <Star className="w-8 h-8 text-yellow-300" />
                      ) : result.score >= 50 ? (
                        <TrendingUp className="w-8 h-8 text-white" />
                      ) : (
                        <AlertTriangle className="w-8 h-8 text-red-300" />
                      )}
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  {/* Feedback */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      Feedback
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{result.feedback}</p>
                  </div>

                  {/* Tips */}
                  {result.tips && result.tips.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        Conseils d&apos;amélioration
                      </h3>
                      <ul className="space-y-1.5">
                        {result.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Follow-up */}
                  {result.followUp && (
                    <div className="p-3 rounded-lg bg-slate-50 border">
                      <p className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <ChevronRight className="w-3 h-3" />
                        Pour aller plus loin
                      </p>
                      <p className="text-sm text-slate-600">{result.followUp}</p>
                    </div>
                  )}

                  {/* Next button */}
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 text-sm font-semibold cursor-pointer"
                    onClick={nextQuestion}
                  >
                    {result.isLast ? (
                      <>
                        <BarChart3 className="mr-2 w-4 h-4" />
                        Voir le rapport final
                      </>
                    ) : (
                      <>
                        Question suivante
                        <ChevronRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ===== REPORT SCREEN ===== */}
          {screen === 'report' && report && (
            <motion.div
              key="report"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="border-2 border-emerald-300 shadow-xl overflow-hidden">
                {/* Report header */}
                <div className="p-6 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white text-center">
                  <Award className="w-10 h-10 mx-auto mb-2 text-yellow-300" />
                  <h2 className="text-xl font-bold">Rapport d&apos;Évaluation</h2>
                  <p className="text-emerald-100 text-sm mt-1">
                    {report.jobTitle} • {report.industry} • {report.totalQuestions} questions
                  </p>
                  <div className="mt-4 inline-flex items-center gap-3">
                    <div className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center bg-white/10">
                      <span className="text-3xl font-extrabold">{report.averageScore}</span>
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold">{report.averageScore}/100</p>
                      <p className="text-emerald-100 text-xs">
                        {report.averageScore >= 75 ? 'Excellent !' : report.averageScore >= 50 ? 'Bon potentiel' : 'Besoin de travail'}
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 space-y-5">
                  {/* Recommendation */}
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-sm font-semibold text-emerald-800 mb-1">Recommandation</p>
                    <p className="text-sm text-emerald-700">{report.recommendation}</p>
                  </div>

                  {/* Strengths */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-emerald-600" />
                      Points forts
                    </h3>
                    <div className="space-y-1.5">
                      {report.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weaknesses */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Axes d&apos;amélioration
                    </h3>
                    <div className="space-y-1.5">
                      {report.weaknesses.map((w, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <ChevronRight className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                          {w}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Improvement Plan */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-teal-600" />
                      Plan d&apos;action
                    </h3>
                    <div className="space-y-1.5">
                      {report.improvementPlan.map((p, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-xs font-bold shrink-0">
                            {i + 1}
                          </span>
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl py-2.5 text-sm font-semibold cursor-pointer"
                      onClick={restart}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Nouvel entretien
                    </Button>
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 text-sm font-semibold cursor-pointer"
                      onClick={() => {
                        toast.success('Rapport sauvegardé !')
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Télécharger PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
