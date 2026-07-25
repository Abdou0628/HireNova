'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Download, FileText, Mail, Sparkles, CheckCircle2,
  AlertTriangle, ArrowRight, PartyPopper, Plane, Globe, RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCVStore } from '@/store/cv-store'

const countryFlags: Record<string, string> = {
  France: '🇫🇷', Canada: '🇨🇦', 'Royaume-Uni': '🇬🇧', 'États-Unis': '🇺🇸',
  Allemagne: '🇩🇪', 'Émirats Arabes Unis': '🇦🇪', Suisse: '🇨🇭',
  Australie: '🇦🇺', Belgique: '🇧🇪', Espagne: '🇪🇸', Italie: '🇮🇹', Japon: '🇯🇵',
}

const adaptationsMap: Record<string, string[]> = {
  France: ['Photo ajoutée (standard français)', 'Sections réordonnées : Formation → Expérience → Compétences', 'Langue traduite en français', 'Format classique appliqué'],
  Canada: ['Photo supprimée (standard nord-américain)', 'Résumé professionnel ajouté', 'Bullet points orientés action', 'Langue traduite en anglais'],
  'Royaume-Uni': ['Photo supprimée (standard UK)', 'Personal Profile ajouté en en-tête', 'Sections réordonnées', 'Langue traduite en anglais britannique'],
  'États-Unis': ['Photo supprimée (standard US)', 'Résumé concis en haut de page', 'Bullet points commençant par des verbes d\'action', 'Format 1 page optimisé'],
  Allemagne: ['Photo ajoutée (bienséant Lebenslauf)', 'Détails personnels étendus inclus', 'Sections Hobbys/Specialités ajoutées', 'Langue traduite en allemand'],
  'Émirats Arabes Unis': ['Photo d\'identité incluse', 'Informations personnelles complètes', 'Format international appliqué', 'Langue traduite en anglais'],
  Suisse: ['Photo obligatoire ajoutée', 'Références professionnelles incluses', 'Format structuré suisse', 'Langue traduite'],
  Australie: ['Photo supprimée (standard australien)', 'Key Skills section ajoutée', 'Selection Criteria intégré', 'Langue traduite en anglais'],
  Belgique: ['Photo optionnelle conservée', 'Format Europass appliqué', 'Sections multilingues', 'Langue traduite'],
  Espagne: ['Photo incluse (standard espagnol)', 'Curriculum Europass format', 'Compétences détaillées', 'Langue traduite en espagnol'],
  Italie: ['Photo incluse', 'Curriculum Europass format', 'Sections standardisées', 'Langue traduite en italien'],
  Japon: ['Photo obligatoire ajoutée', 'Format Rirekisho appliqué', 'Structure très codifiée', 'Langue traduite en japonais'],
}

function getScoreVariant(score: number): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (score >= 80) return 'default'
  if (score >= 60) return 'secondary'
  return 'destructive'
}

export default function MobilityResult() {
  const { stepData, mobilityResult, setStep, reset } = useCVStore()
  const targetCountry = (stepData.targetCountry as string) || 'France'

  const formattedCV = mobilityResult?.formattedCV
  const formattedCL = mobilityResult?.formattedCL
  const score = mobilityResult?.compatibilityScore ?? 72
  const adaptations = adaptationsMap[targetCountry] ?? adaptationsMap['France']

  useEffect(() => {
    if (!mobilityResult || !formattedCV) {
      // If no result, redirect to upload
      setStep('mobilityUpload', { targetCountry })
    }
  }, [mobilityResult, formattedCV, targetCountry, setStep])

  const handleDownload = (type: 'cv' | 'cl') => {
    const content = type === 'cv'
      ? `CV Adapté pour ${targetCountry}\n\n${formattedCV?.summary ?? ''}\n\nExpériences:\n${formattedCV?.experience.map(e => `- ${e.title} chez ${e.company} (${e.period})`).join('\n')}\n\nFormation:\n${formattedCV?.education.map(e => `- ${e.degree} - ${e.school} (${e.period})`).join('\n')}\n\nCompétences: ${formattedCV?.skills.join(', ')}`
      : `Lettre de Motivation Adaptée pour ${targetCountry}\n\n${formattedCL?.subject ?? ''}\n\n${formattedCL?.greeting ?? ''}\n\n${formattedCL?.paragraphs.join('\n\n') ?? ''}\n\n${formattedCL?.signOff ?? ''}`

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = type === 'cv' ? `CV_Adapte_${targetCountry}.txt` : `Lettre_Motivation_${targetCountry}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 border-b border-emerald-100 bg-white/80 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setStep('mobilityProfile')}
            className="text-emerald-700 hover:bg-emerald-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{countryFlags[targetCountry] ?? '🌍'}</span>
            <h1 className="text-lg font-semibold text-emerald-900">Documents Adaptés</h1>
          </div>
          <Badge
            variant={getScoreVariant(score)}
            className="ml-auto text-sm px-3 py-1"
          >
            {score}% compatible
          </Badge>
        </div>
      </motion.header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
            <PartyPopper className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-900">
            Vos documents sont prêts !
          </h2>
          <p className="mt-1 text-gray-500">
            CV et lettre de motivation adaptés pour {targetCountry}
          </p>
        </motion.div>

        {/* Two document cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* CV Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full border-emerald-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                    <FileText className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">CV Adapté</h3>
                    <p className="text-xs text-gray-400">{countryFlags[targetCountry]} {targetCountry}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto max-h-72 pr-1">
                  {formattedCV?.summary && (
                    <p className="text-sm italic text-gray-600">&ldquo;{formattedCV.summary}&rdquo;</p>
                  )}

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">Expérience</p>
                    {formattedCV?.experience.map((exp, i) => (
                      <div key={i} className="mb-2 border-l-2 border-emerald-200 pl-3">
                        <p className="text-sm font-medium text-gray-800">{exp.title}</p>
                        <p className="text-xs text-emerald-600">{exp.company} · {exp.period}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-teal-600">Formation</p>
                    {formattedCV?.education.map((edu, i) => (
                      <div key={i} className="mb-1.5 border-l-2 border-teal-200 pl-3">
                        <p className="text-sm font-medium text-gray-800">{edu.degree}</p>
                        <p className="text-xs text-teal-600">{edu.school} · {edu.period}</p>
                      </div>
                    ))}
                  </div>

                  {formattedCV?.skills && (
                    <div className="flex flex-wrap gap-1">
                      {formattedCV.skills.map((s) => (
                        <Badge key={s} variant="secondary" className="bg-emerald-50 text-emerald-700 text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleDownload('cv')}
                  className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le CV
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cover Letter Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="h-full border-teal-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
                    <Mail className="h-5 w-5 text-teal-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Lettre de Motivation Adaptée</h3>
                    <p className="text-xs text-gray-400">{countryFlags[targetCountry]} {targetCountry}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto max-h-72 pr-1">
                  {formattedCL?.subject && (
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-400">Objet</p>
                      <p className="text-sm font-medium text-gray-800">{formattedCL.subject}</p>
                    </div>
                  )}

                  {formattedCL?.greeting && (
                    <p className="text-sm text-gray-700">{formattedCL.greeting}</p>
                  )}

                  {formattedCL?.paragraphs.map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed text-gray-600">
                      {para}
                    </p>
                  ))}

                  {formattedCL?.signOff && (
                    <p className="text-sm text-gray-700 mt-2">{formattedCL.signOff}</p>
                  )}
                </div>

                <Button
                  onClick={() => handleDownload('cl')}
                  className="mt-4 w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger la Lettre
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Adaptations summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mb-8 border-emerald-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                <Sparkles className="mr-2 inline h-5 w-5 text-emerald-600" />
                Points d&apos;adaptation
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {adaptations.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-start gap-2.5 rounded-lg bg-emerald-50 px-3 py-2.5"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Compatibility score display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-10 flex justify-center"
        >
          <div className="flex items-center gap-4 rounded-2xl bg-white px-8 py-4 shadow-sm border border-emerald-100">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${
              score >= 80 ? 'bg-emerald-100' : score >= 60 ? 'bg-amber-100' : 'bg-red-100'
            }`}>
              <span className={`text-xl font-bold ${
                score >= 80 ? 'text-emerald-700' : score >= 60 ? 'text-amber-600' : 'text-red-600'
              }`}>
                {score}%
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Score de compatibilité</p>
              <p className="text-sm text-gray-500">
                {score >= 80 ? 'Excellent — votre profil est très bien adapté !' :
                 score >= 60 ? 'Bon — quelques ajustements mineurs possibles.' :
                 'Moyen — des améliorations sont recommandées.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-4 pb-8"
        >
          <Button
            size="lg"
            onClick={() => handleDownload('cv')}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 text-white shadow-lg hover:from-emerald-700 hover:to-teal-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger CV
          </Button>
          <Button
            size="lg"
            onClick={() => handleDownload('cl')}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 text-white shadow-lg hover:from-teal-700 hover:to-cyan-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger Lettre
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => reset()}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Retour à l&apos;accueil
          </Button>
        </motion.div>
      </main>
    </div>
  )
}
