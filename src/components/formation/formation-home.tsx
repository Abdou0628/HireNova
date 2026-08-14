'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen, GraduationCap, Award, Clock,
  ArrowRight, ChevronLeft, Sparkles, Play,
  Loader2, CheckCircle, TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useCVStore } from '@/store/cv-store'
import { t } from '@/lib/i18n'
import { toast } from 'sonner'

type AppStep = 'formationHome' | 'formationCatalog' | 'formationCourse' | 'formationCert'

interface Course {
  id: string
  title: string
  description: string
  category: string
  level: string
  duration: number
  language: string
  rating: number
  enrollCount: number
  featured: boolean
}

interface Enrollment {
  id: string
  courseId: string
  progress: number
  completed: boolean
  startedAt: string
  course: Course
}

interface Stats {
  enrolled: number
  completed: number
  certificates: number
  hoursLearned: number
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
}

const CATEGORY_COLORS: Record<string, string> = {
  tech: 'bg-cyan-100 text-cyan-700',
  marketing: 'bg-amber-100 text-amber-700',
  finance: 'bg-emerald-100 text-emerald-700',
  design: 'bg-rose-100 text-rose-700',
  'soft-skills': 'bg-violet-100 text-violet-700',
  languages: 'bg-sky-100 text-sky-700',
  general: 'bg-gray-100 text-gray-700',
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  tech: 'from-cyan-500 to-blue-600',
  marketing: 'from-amber-500 to-orange-600',
  finance: 'from-emerald-500 to-teal-600',
  design: 'from-rose-500 to-pink-600',
  'soft-skills': 'from-violet-500 to-purple-600',
  languages: 'from-sky-500 to-indigo-600',
  general: 'from-gray-500 to-slate-600',
}

const DEMO_COURSES = [
  {
    title: 'Introduction à React & Next.js',
    description: 'Apprenez les fondamentaux de React et Next.js pour créer des applications web modernes et performantes. Couvre les hooks, le SSR, et le routing.',
    category: 'tech',
    level: 'beginner',
    duration: 8,
    language: 'fr',
    rating: 4.8,
    featured: true,
    modules: JSON.stringify([
      { title: 'Introduction à React', type: 'video', content: 'Découvrez React, son écosystème et pourquoi il domine le développement frontend.' },
      { title: 'JSX et Composants', type: 'text', content: 'Le JSX est la syntaxe utilisée par React pour décrire l\'interface utilisateur. Les composants sont les briques de base d\'une app React.' },
      { title: 'Quiz : Les bases de React', type: 'quiz', content: 'Testez vos connaissances sur les fondamentaux de React.' },
      { title: 'Hooks : useState & useEffect', type: 'video', content: 'Maîtrisez les deux hooks les plus utilisés pour gérer l\'état et les effets de bord.' },
      { title: 'Introduction à Next.js', type: 'text', content: 'Next.js étend React avec le SSR, le routing et l\'optimisation automatique.' },
      { title: 'Projet pratique', type: 'text', content: 'Créez une application complète avec React et Next.js en suivant un cas réel.' },
    ]),
  },
  {
    title: 'Marketing Digital Avancé',
    description: 'Maîtrisez les stratégies SEO, SEA, social media et content marketing pour maximiser la visibilité de votre entreprise en ligne.',
    category: 'marketing',
    level: 'advanced',
    duration: 12,
    language: 'fr',
    rating: 4.6,
    featured: true,
    modules: JSON.stringify([
      { title: 'Stratégie SEO avancée', type: 'video', content: 'Optimisation technique, sémantique et netlinking pour un référencement performant.' },
      { title: 'Google Ads & SEA', type: 'text', content: 'Créez et optimisez vos campagnes publicitaires sur Google Ads.' },
      { title: 'Quiz : Marketing Digital', type: 'quiz', content: 'Évaluez votre compréhension des stratégies marketing digital.' },
      { title: 'Social Media Marketing', type: 'video', content: 'Développez votre stratégie sur les réseaux sociaux.' },
      { title: 'Content Marketing & Inbound', type: 'text', content: 'Créez du contenu engageant qui attire et convertit vos prospects.' },
    ]),
  },
  {
    title: 'Finance pour Non-Financiers',
    description: 'Comprenez les états financiers, la gestion de trésorerie et les indicateurs clés de performance pour prendre de meilleures décisions business.',
    category: 'finance',
    level: 'beginner',
    duration: 6,
    language: 'fr',
    rating: 4.5,
    featured: true,
    modules: JSON.stringify([
      { title: 'Lire un bilan comptable', type: 'video', content: 'Les fondamentaux du bilan, du compte de résultat et du tableau de flux de trésorerie.' },
      { title: 'Indicateurs financiers clés', type: 'text', content: 'ROE, ROA, marge brute, EBITDA : comprendre les KPI financiers essentiels.' },
      { title: 'Quiz : Bases de la finance', type: 'quiz', content: 'Testez vos connaissances en finance d\'entreprise.' },
      { title: 'Gestion de trésorerie', type: 'text', content: 'Optimisez votre BFR et gérez efficacement votre trésorerie.' },
    ]),
  },
  {
    title: 'UI/UX Design avec Figma',
    description: 'Apprenez à créer des interfaces utilisateur modernes et intuitives avec Figma. Du wireframe au prototype interactif.',
    category: 'design',
    level: 'intermediate',
    duration: 10,
    language: 'fr',
    rating: 4.7,
    featured: true,
    modules: JSON.stringify([
      { title: 'Principes du design UI', type: 'video', content: 'Les principes fondamentaux du design d\'interface utilisateur.' },
      { title: 'Figma : les bases', type: 'text', content: 'Prise en main de Figma, outils essentiels et raccourcis.' },
      { title: 'Wireframing & Prototypage', type: 'video', content: 'Créez des wireframes et des prototypes interactifs.' },
      { title: 'Quiz : UI/UX Design', type: 'quiz', content: 'Vérifiez votre compréhension des principes UI/UX.' },
      { title: 'Design System', type: 'text', content: 'Créez un design system cohérent et réutilisable.' },
    ]),
  },
  {
    title: 'Leadership & Management',
    description: 'Développez vos compétences en leadership, communication et gestion d\'équipe pour devenir un manager efficace.',
    category: 'soft-skills',
    level: 'intermediate',
    duration: 7,
    language: 'fr',
    rating: 4.4,
    featured: false,
    modules: JSON.stringify([
      { title: 'Les styles de leadership', type: 'video', content: 'Découvrez les différents styles de leadership et trouvez le vôtre.' },
      { title: 'Communication efficace', type: 'text', content: 'Maîtrisez la communication interpersonnelle et la gestion des conflits.' },
      { title: 'Quiz : Leadership', type: 'quiz', content: 'Évaluez vos compétences en leadership.' },
      { title: 'Gestion d\'équipe', type: 'text', content: 'Motivation, délégation et feedback pour des équipes performantes.' },
    ]),
  },
  {
    title: 'Anglais Professionnel B2',
    description: 'Améliorez votre anglais professionnel : rédaction d\'emails, réunions, présentations et négociations en anglais.',
    category: 'languages',
    level: 'intermediate',
    duration: 15,
    language: 'en',
    rating: 4.3,
    featured: false,
    modules: JSON.stringify([
      { title: 'Emails professionnels', type: 'video', content: 'Rédigez des emails clairs et professionnels en anglais.' },
      { title: 'Vocabulaire des affaires', type: 'text', content: 'Les termes essentiels pour le monde de l\'entreprise.' },
      { title: 'Quiz : Business English', type: 'quiz', content: 'Testez votre vocabulaire anglais professionnel.' },
      { title: 'Réunions & Présentations', type: 'video', content: 'Participez activement aux réunions en anglais.' },
      { title: 'Négociation en anglais', type: 'text', content: 'Techniques de négociation en contexte international.' },
    ]),
  },
  {
    title: 'Python pour la Data Science',
    description: 'Maîtrisez Python, Pandas, NumPy et les bases du Machine Learning pour analyser et visualiser vos données.',
    category: 'tech',
    level: 'intermediate',
    duration: 16,
    language: 'fr',
    rating: 4.9,
    featured: true,
    modules: JSON.stringify([
      { title: 'Python avancé', type: 'video', content: 'List comprehensions, décorateurs, générateurs et gestion des erreurs.' },
      { title: 'Pandas & manipulation de données', type: 'text', content: 'Chargement, nettoyage et transformation de données avec Pandas.' },
      { title: 'Quiz : Python Data Science', type: 'quiz', content: 'Évaluez vos compétences en Python pour la data.' },
      { title: 'Visualisation avec Matplotlib', type: 'video', content: 'Créez des graphiques professionnels pour présenter vos analyses.' },
      { title: 'Introduction au Machine Learning', type: 'text', content: 'Les concepts fondamentaux du ML et la bibliothèque scikit-learn.' },
      { title: 'Projet : Analyse de données réelles', type: 'text', content: 'Mettez en pratique vos compétences sur un dataset réel.' },
    ]),
  },
  {
    title: 'Intelligence Émotionnelle',
    description: 'Développez votre intelligence émotionnelle pour mieux gérer le stress, les relations professionnelles et la prise de décision.',
    category: 'soft-skills',
    level: 'beginner',
    duration: 4,
    language: 'fr',
    rating: 4.6,
    featured: false,
    modules: JSON.stringify([
      { title: 'Qu\'est-ce que l\'IE ?', type: 'video', content: 'Les 5 composantes de l\'intelligence émotionnelle selon Goleman.' },
      { title: 'Auto-connaissance', type: 'text', content: 'Identifiez et comprenez vos émotions et leur impact.' },
      { title: 'Quiz : Intelligence Émotionnelle', type: 'quiz', content: 'Mesurez votre niveau d\'intelligence émotionnelle.' },
    ]),
  },
  {
    title: 'Excel Avancé pour Business',
    description: 'Tableaux croisés dynamiques, formules avancées, macros VBA et Power Query pour les professionnels de la finance.',
    category: 'finance',
    level: 'advanced',
    duration: 14,
    language: 'fr',
    rating: 4.5,
    featured: false,
    modules: JSON.stringify([
      { title: 'Fonctions avancées', type: 'video', content: 'RECHERCHEV, INDEX/EQUIV, SOMME.SI et fonctions matricielles.' },
      { title: 'Tableaux croisés dynamiques', type: 'text', content: 'Créez et personnalisez des TCD pour analyser vos données.' },
      { title: 'Quiz : Excel Avancé', type: 'quiz', content: 'Testez vos compétences Excel avancées.' },
      { title: 'Macros VBA', type: 'video', content: 'Automatisez vos tâches récurrentes avec VBA.' },
      { title: 'Power Query', type: 'text', content: 'Importez et transformez vos données avec Power Query.' },
    ]),
  },
  {
    title: 'Growth Hacking & Startup',
    description: 'Les techniques de growth hacking pour acquérir vos premiers utilisateurs et scaler votre startup rapidement.',
    category: 'marketing',
    level: 'intermediate',
    duration: 9,
    language: 'en',
    rating: 4.7,
    featured: true,
    modules: JSON.stringify([
      { title: 'Mindset Growth Hacker', type: 'video', content: 'Les principes fondamentaux du growth hacking et l\'approche expérimentale.' },
      { title: 'Acquisition Channel', type: 'text', content: 'Identifiez et optimisez vos canaux d\'acquisition.' },
      { title: 'Quiz : Growth Hacking', type: 'quiz', content: 'Vérifiez votre compréhension des techniques de growth.' },
      { title: 'Metrics & Analytics', type: 'video', content: 'Les métriques essentielles : AARRR, CAC, LTV et churn rate.' },
      { title: 'Case Studies', type: 'text', content: 'Analyse de cas réels de startups ayant utilisé le growth hacking.' },
    ]),
  },
]

export default function FormationHome() {
  const { language, setStep, stepData, setStepData } = useCVStore()
  const isRTL = language === 'ar'
  const [stats, setStats] = useState<Stats>({ enrolled: 0, completed: 0, certificates: 0, hoursLearned: 0 })
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<(Course & { reason?: string })[]>([])
  const [loadingRec, setLoadingRec] = useState(false)

  function navigateTo(step: AppStep, data?: Record<string, unknown>) {
    if (data) setStepData(data)
    setStep(step)
  }

  const seedCourses = useCallback(async () => {
    try {
      await fetch('/api/formation/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed: DEMO_COURSES }),
      })
    } catch {
      // silent
    }
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const [enrollRes, courseRes, certRes] = await Promise.all([
        fetch('/api/formation/enroll'),
        fetch('/api/formation/courses?featured=true'),
        fetch('/api/formation/certification'),
      ])

      const enrollData = enrollRes.ok ? await enrollRes.json() : { enrollments: [] }
      const courseData = courseRes.ok ? await courseRes.json() : { courses: [] }
      const certData = certRes.ok ? await certRes.json() : { certifications: [] }

      const ens: Enrollment[] = enrollData.enrollments || []
      setEnrollments(ens)
      setFeaturedCourses(courseData.courses || [])

      setStats({
        enrolled: ens.length,
        completed: ens.filter((e: Enrollment) => e.completed).length,
        certificates: (certData.certifications || []).length,
        hoursLearned: ens.reduce((acc: number, e: Enrollment) => acc + (e.course?.duration || 0) * Math.floor(e.progress / 20), 0),
      })
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      await seedCourses()
      await fetchData()
    }
    init()
  }, [seedCourses, fetchData])

  const getRecommendation = async () => {
    setLoadingRec(true)
    try {
      const res = await fetch('/api/formation/certification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'recommend', language }),
      })
      if (res.ok) {
        const data = await res.json()
        setRecommendations(data.recommendations || [])
      }
    } catch {
      toast.error(t(language, 'formationFailedRecommendation'))
    } finally {
      setLoadingRec(false)
    }
  }

  const statsCards = [
    { label: t(language, 'formationEnrolled'), value: stats.enrolled, icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: t(language, 'formationCompleted'), value: stats.completed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: t(language, 'formationCertificates'), value: stats.certificates, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: t(language, 'formationHoursLearned'), value: stats.hoursLearned, icon: Clock, color: 'text-sky-600', bg: 'bg-sky-50' },
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-b from-teal-50/40 via-white to-white ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-teal-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setStep('landing')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            {t(language, 'previous')}
          </button>
          <h1 className="text-lg font-semibold text-teal-700">{t(language, 'formationHeaderTitle')}</h1>
          <div className="w-20" />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t(language, 'formationHomeWelcome')}</h2>
          <p className="text-muted-foreground mt-1">{t(language, 'formationHomeSubtitle')}</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsCards.map((stat, i) => (
            <motion.div key={stat.label} custom={i} variants={cardVariants} initial="hidden" animate="visible">
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Continue Learning */}
        {enrollments.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Play className="w-5 h-5 text-teal-600" />
                  {t(language, 'formationContinueLearning')}
                </h3>
                <p className="text-sm text-muted-foreground">{t(language, 'formationContinueDesc')}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {enrollments.slice(0, 4).map((enrollment, i) => (
                <motion.div key={enrollment.id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
                  <Card
                    className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => navigateTo('formationCourse', { courseId: enrollment.courseId })}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${CATEGORY_GRADIENTS[enrollment.course.category] || CATEGORY_GRADIENTS.general} flex-shrink-0 flex items-center justify-center`}>
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 truncate">{enrollment.course.title}</h4>
                          <div className="mt-2">
                            <Progress value={enrollment.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">{enrollment.progress}%</p>
                          </div>
                        </div>
                        {enrollment.completed ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <ArrowRight className={`w-5 h-5 text-muted-foreground group-hover:text-teal-600 transition-colors flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* AI Recommendation */}
        <section>
          <Card className="border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 border">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-600" />
                    {t(language, 'formationAiRecommendation')}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{t(language, 'formationAiRecommendDesc')}</p>
                </div>
                <Button
                  onClick={getRecommendation}
                  disabled={loadingRec}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {loadingRec && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {t(language, 'formationGetRecommendation')}
                </Button>
              </div>
              {recommendations.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-3 mt-4">
                  {recommendations.map((rec) => (
                    <Card key={rec.id} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigateTo('formationCourse', { courseId: rec.id })}
                    >
                      <CardContent className="p-4">
                        <Badge className={`mb-2 text-xs ${CATEGORY_COLORS[rec.category] || CATEGORY_COLORS.general}`}>
                          {t(language, `formationCategory${rec.category.charAt(0).toUpperCase() + rec.category.slice(1).replace('-', '')}` as Parameters<typeof t>[1]) || rec.category}
                        </Badge>
                        <h4 className="font-medium text-sm text-gray-900">{rec.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{rec.reason}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Featured Courses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              {t(language, 'formationFeatured')}
            </h3>
            <Button variant="ghost" size="sm" className="text-teal-600" onClick={() => navigateTo('formationCatalog')}>
              {t(language, 'formationCatalog')}
              <ArrowRight className={`w-4 h-4 ml-1 ${isRTL ? 'rotate-180 mr-1' : ''}`} />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{t(language, 'formationFeaturedDesc')}</p>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-teal-600 animate-spin" /></div>
          ) : featuredCourses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.slice(0, 6).map((course, i) => (
                <motion.div key={course.id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
                  <Card
                    className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group overflow-hidden"
                    onClick={() => navigateTo('formationCourse', { courseId: course.id })}
                  >
                    <div className={`h-32 bg-gradient-to-br ${CATEGORY_GRADIENTS[course.category] || CATEGORY_GRADIENTS.general} flex items-center justify-center`}>
                      <BookOpen className="w-12 h-12 text-white/80" />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`text-xs ${CATEGORY_COLORS[course.category] || CATEGORY_COLORS.general}`}>
                          {t(language, `formationCategory${course.category.charAt(0).toUpperCase() + course.category.slice(1).replace('-', '')}` as Parameters<typeof t>[1]) || course.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{t(language, `formationLevel${course.level.charAt(0).toUpperCase() + course.level.slice(1)}` as Parameters<typeof t>[1]) || course.level}</Badge>
                      </div>
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-2">{course.title}</h4>
                      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}h</span>
                        <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{course.enrollCount}</span>
                        {course.rating > 0 && <span className="flex items-center gap-1">★ {course.rating}</span>}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">{t(language, 'formationNoEnrollments')}</p>
                <Button className="mt-4 bg-teal-600 hover:bg-teal-700" onClick={() => navigateTo('formationCatalog')}>
                  {t(language, 'formationExploreCatalog')}
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Bottom CTAs */}
        <div className="grid sm:grid-cols-2 gap-4 pb-8">
          <Card
            className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow group"
            onClick={() => navigateTo('formationCatalog')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-teal-100">
                <BookOpen className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{t(language, 'formationCatalog')}</h4>
                <p className="text-sm text-muted-foreground">{t(language, 'formationExploreCatalog')}</p>
              </div>
              <ArrowRight className={`w-5 h-5 text-muted-foreground group-hover:text-teal-600 transition-colors ${isRTL ? 'rotate-180' : ''}`} />
            </CardContent>
          </Card>
          <Card
            className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow group"
            onClick={() => navigateTo('formationCert')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-100">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{t(language, 'formationCertTitle')}</h4>
                <p className="text-sm text-muted-foreground">{t(language, 'formationMyCertifications')}</p>
              </div>
              <ArrowRight className={`w-5 h-5 text-muted-foreground group-hover:text-amber-600 transition-colors ${isRTL ? 'rotate-180' : ''}`} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
