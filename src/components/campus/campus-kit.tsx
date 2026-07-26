'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Users,
  Award,
  TrendingUp,
  CheckCircle2,
  Download,
  Mail,
  Phone,
  Globe,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Building2,
  FileText,
} from 'lucide-react'
import { useCVStore } from '@/store/cv-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { events } from '@/lib/analytics'

interface CampusStats {
  totalResumes: number
  totalCoverLetters: number
  totalAtsAnalyses: number
  totalJobApplications: number
  totalLocalJobs: number
  totalGlobalJobs: number
  totalUsers: number
  totalCampusTickets: number
  supportedCountries: number
  totalDocuments: number
}

export default function CampusKit() {
  const { setStep } = useCVStore()
  const [contactForm, setContactForm] = useState({
    university: '',
    contactName: '',
    email: '',
    phone: '',
    studentsCount: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [liveStats, setLiveStats] = useState<CampusStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  // Fetch live platform counters
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/campus/stats')
        const json = await res.json()
        if (!cancelled && json.success) {
          setLiveStats(json.data)
        }
      } catch (e) {
 console.error('[campus] stats fetch failed:', e)
      } finally {
        if (!cancelled) setStatsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Format a number with thousands separator (fr-FR)
  const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)

  const benefits = [
    {
      icon: FileText,
      title: 'CV IA gratuit',
      desc: '5 000 comptes étudiants gratuits par université partenaire',
      color: 'emerald',
    },
    {
      icon: Award,
      title: 'Ateliers carrière',
      desc: 'Webinaires mensuels "CV & entretien" par nos experts IA',
      color: 'blue',
    },
    {
      icon: TrendingUp,
      title: 'Statistiques',
      desc: 'Dashboard d\'analyse : taux d\'employabilité, CV générés, scores ATS',
      color: 'purple',
    },
    {
      icon: Users,
      title: 'Réseau employeurs',
      desc: 'Accès direct à notre marketplace Jobs + Global (40+ pays)',
      color: 'amber',
    },
  ]

  const programSteps = [
    {
      num: '01',
      title: 'Signature du partenariat',
      desc: 'Convention gratuite entre votre université et E-Society 2050. Aucun engagement financier.',
    },
    {
      num: '02',
      title: 'Onboarding étudiants',
      desc: 'Création des comptes en masse via domaine email universitaire. Accès immédiat à HireNova CV.',
    },
    {
      num: '03',
      title: 'Ateliers & webinaires',
      desc: 'Sessions mensuelles (présentiel ou visio) sur la création de CV, ATS, et mobilité internationale.',
    },
    {
      num: '04',
      title: 'Suivi & impact',
      desc: 'Rapport trimestriel : nombre de CV créés, scores ATS moyens, candidatures envoyées.',
    },
  ]

  const stats = [
    { value: '5 000+', label: 'Étudiants/université' },
    { value: '4', label: 'Langues supportées' },
    { value: '40+', label: 'Pays (HireNova Global)' },
    { value: '0€', label: 'Coût pour l\'université' },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/campus/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Demande envoyée ! Nous vous contacterons sous 48h.')
        setContactForm({
          university: '',
          contactName: '',
          email: '',
          phone: '',
          studentsCount: '',
          message: '',
        })
      } else {
        toast.error(data.error?.message || 'Erreur lors de l\'envoi')
      }
    } catch {
      toast.error('Erreur de connexion')
    } finally {
      setSubmitting(false)
    }
  }

  function downloadBrochure() {
    events.track('campus_brochure_downloaded')
    // Generate brochure content as downloadable HTML
    const brochure = `HireNova Campus — Programme Universités Partenaires

E-Society 2050 — HireNova
© 2026

AVEC HIRENOVA, VOS ÉTUDIANTS DÉCROCHENT LEUR PREMIER EMPLOI.

HireNova est la plateforme tout-en-un de gestion de carrière internationale.
6 modules intégrés : CV IA, ATS, Jobs, Global (40+ pays), Mobilité, API.

PROGRAMME CAMPUS — AVANTAGES UNIVERSITAIRES :
✅ 5 000 comptes étudiants gratuits par université
✅ Ateliers carrière mensuels (CV, ATS, entretien)
✅ Dashboard statistiques d'employabilité
✅ Accès au réseau employeurs HireNova Jobs + Global
✅ Webinaires mobilité internationale
✅ Support dédié (chat + email)

ÉTAPE DE PARTENARIAT :
1. Signature convention (gratuite, sans engagement)
2. Onboarding étudiants (domaine email universitaire)
3. Ateliers & webinaires mensuels
4. Rapport trimestriel d'impact

CONTACT :
Email : campus@hirenova.com
Tel : +212 (0) 5 22 00 00 00
Web : https://hirenova.com

E-Society 2050 — Casablanca, Maroc
`
    const blob = new Blob([brochure], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'HireNova-Campus-Brochure.txt'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Brochure téléchargée')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep('landing')}
              className="-ml-2 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-base leading-tight truncate">HireNova Campus</h1>
              <p className="text-[10px] text-muted-foreground leading-tight">Programme Universités Partenaires</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadBrochure}
            className="gap-2 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Brochure</span>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16"
        >
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 mb-4 gap-1">
            <Sparkles className="w-3 h-3" />
            Programme exclusif universités
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
            Accompagnez vos étudiants vers <span className="text-emerald-600">l'employabilité internationale</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            HireNova Campus offre gratuitement notre écosystème de carrière IA à vos étudiants.
            CV professionnels, score ATS, jobs internationaux — tout au même endroit.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={downloadBrochure} className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer gap-2">
              <Download className="w-4 h-4" />
              Télécharger la brochure
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="cursor-pointer gap-2"
            >
              Devenir partenaire
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 sm:mb-16"
        >
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white">
              <CardContent className="p-4 sm:p-6">
                <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.section>

        {/* Benefits */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Avantages pour votre université
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        benefit.color === 'emerald' ? 'bg-emerald-100' :
                        benefit.color === 'blue' ? 'bg-sky-100' :
                        benefit.color === 'purple' ? 'bg-purple-100' : 'bg-amber-100'
                      }`}>
                        <benefit.icon className={`w-6 h-6 ${
                          benefit.color === 'emerald' ? 'text-emerald-600' :
                          benefit.color === 'blue' ? 'text-sky-600' :
                          benefit.color === 'purple' ? 'text-purple-600' : 'text-amber-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base mb-1">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Comment devenir partenaire
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {programSteps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-5xl font-bold text-emerald-100">
                    {step.num}
                  </div>
                  <CardContent className="p-6 relative">
                    <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Live platform counters — Cas d'usage type */}
        <section className="mb-12 sm:mb-16">
          <Card className="bg-gradient-to-br from-emerald-50/50 to-white border-emerald-200">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Cas d'usage type</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Une université marocaine de 3 000 étudiants signe le partenariat Campus.
                    Voici les compteurs en temps réel de la plateforme HireNova :
                  </p>
                </div>
              </div>

              {/* Compteurs dynamiques temps réel */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg border border-emerald-100 p-3 sm:p-4 text-center">
                  <FileText className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-xl sm:text-2xl font-bold text-emerald-700">
                    {statsLoading ? (
                      <span className="inline-block w-8 h-6 bg-emerald-100 rounded animate-pulse align-middle" />
                    ) : (
                      fmt(liveStats?.totalResumes ?? 0)
                    )}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">CV générés</p>
                </div>

                <div className="bg-white rounded-lg border border-emerald-100 p-3 sm:p-4 text-center">
                  <Award className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-xl sm:text-2xl font-bold text-emerald-700">
                    {statsLoading ? (
                      <span className="inline-block w-8 h-6 bg-emerald-100 rounded animate-pulse align-middle" />
                    ) : (
                      fmt(liveStats?.totalAtsAnalyses ?? 0)
                    )}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Analyses ATS</p>
                </div>

                <div className="bg-white rounded-lg border border-emerald-100 p-3 sm:p-4 text-center">
                  <Mail className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-xl sm:text-2xl font-bold text-emerald-700">
                    {statsLoading ? (
                      <span className="inline-block w-8 h-6 bg-emerald-100 rounded animate-pulse align-middle" />
                    ) : (
                      fmt(liveStats?.totalCoverLetters ?? 0)
                    )}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Lettres motivation</p>
                </div>

                <div className="bg-white rounded-lg border border-emerald-100 p-3 sm:p-4 text-center">
                  <Users className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-xl sm:text-2xl font-bold text-emerald-700">
                    {statsLoading ? (
                      <span className="inline-block w-8 h-6 bg-emerald-100 rounded animate-pulse align-middle" />
                    ) : (
                      fmt(liveStats?.totalJobApplications ?? 0)
                    )}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Candidatures envoyées</p>
                </div>

                <div className="bg-white rounded-lg border border-emerald-100 p-3 sm:p-4 text-center">
                  <Globe className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-xl sm:text-2xl font-bold text-emerald-700">
                    {statsLoading ? (
                      <span className="inline-block w-8 h-6 bg-emerald-100 rounded animate-pulse align-middle" />
                    ) : (
                      `${fmt(liveStats?.supportedCountries ?? 0)}+`
                    )}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Pays (Global)</p>
                </div>

                <div className="bg-white rounded-lg border border-emerald-100 p-3 sm:p-4 text-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-xl sm:text-2xl font-bold text-emerald-700">
                    {statsLoading ? (
                      <span className="inline-block w-8 h-6 bg-emerald-100 rounded animate-pulse align-middle" />
                    ) : (
                      fmt(liveStats?.totalUsers ?? 0)
                    )}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Utilisateurs inscrits</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                <Badge variant="outline" className="gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ROI mesurable
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Zéro coût université
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Impact direct employabilité
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Compteurs temps réel
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact form */}
        <section id="contact" className="mb-12 scroll-mt-20">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-600" />
                Demande de partenariat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="university">Université / École *</Label>
                    <Input
                      id="university"
                      required
                      value={contactForm.university}
                      onChange={(e) => setContactForm({ ...contactForm, university: e.target.value })}
                      placeholder="Ex: Université Hassan II Casablanca"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactName">Nom du contact *</Label>
                    <Input
                      id="contactName"
                      required
                      value={contactForm.contactName}
                      onChange={(e) => setContactForm({ ...contactForm, contactName: e.target.value })}
                      placeholder="Ex: Dr. Mohamed Alami"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email professionnel *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="contact@université.ma"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="+212 6 00 00 00 00"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentsCount">Nombre d'étudiants</Label>
                    <Input
                      id="studentsCount"
                      type="number"
                      value={contactForm.studentsCount}
                      onChange={(e) => setContactForm({ ...contactForm, studentsCount: e.target.value })}
                      placeholder="Ex: 3000"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Parlez-nous de vos besoins en accompagnement carrière..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Envoyer la demande
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Contact info */}
        <section className="text-center py-8 border-t">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              campus@hirenova.com
            </span>
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              +212 (0) 5 22 00 00 00
            </span>
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              hirenova.com
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            © 2026 E-Society 2050 — HireNova Campus. Casablanca, Maroc.
          </p>
        </section>
      </main>
    </div>
  )
}
