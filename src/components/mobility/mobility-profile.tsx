'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, User, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Globe, CheckCircle2, AlertTriangle, Lightbulb, ChevronRight,
  FileImage, FileText, Languages, Ruler, Sparkles, Shield, X as XIcon, Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCVStore, type ExtractedProfile, type MobilityResult } from '@/store/cv-store'

const countryFlags: Record<string, string> = {
  France: '🇫🇷', Canada: '🇨🇦', 'Royaume-Uni': '🇬🇧', 'États-Unis': '🇺🇸',
  Allemagne: '🇩🇪', 'Émirats Arabes Unis': '🇦🇪', Suisse: '🇨🇭',
  Australie: '🇦🇺', Belgique: '🇧🇪', Espagne: '🇪🇸', Italie: '🇮🇹', Japon: '🇯🇵',
}

const countryNormsData: Record<string, MobilityResult['countryNorms']> = {
  France: { cvFormat: 'Classique français', requiredSections: ['État civil', 'Formation', 'Expérience', 'Compétences', 'Langues'], forbiddenSections: ['Âge', 'Situation familiale'], photoRequired: true, maxPages: 2, language: 'Français', tips: ['Inclure une photo d\'identité', 'Ordre chronologique inverse'] },
  Canada: { cvFormat: 'Nord-américain', requiredSections: ['Résumé professionnel', 'Expérience', 'Formation', 'Compétences'], forbiddenSections: ['Photo', 'Âge', 'Nationalité', 'Situation familiale'], photoRequired: false, maxPages: 2, language: 'Anglais / Français', tips: ['Action-oriented bullet points', 'Pas de données personnelles sensibles'] },
  'Royaume-Uni': { cvFormat: 'UK Standard', requiredSections: ['Personal Profile', 'Employment', 'Education', 'Skills'], forbiddenSections: ['Photo', 'Âge', 'Nationalité', 'Loisirs non pertinents'], photoRequired: false, maxPages: 2, language: 'Anglais', tips: ['Personal profile au début', 'Pas de photo ni données personnelles'] },
  'États-Unis': { cvFormat: 'US Resume', requiredSections: ['Summary', 'Experience', 'Education', 'Skills'], forbiddenSections: ['Photo', 'Âge', 'Nationalité', 'Adresse complète', 'Statut marital'], photoRequired: false, maxPages: 1, language: 'Anglais', tips: ['1 page max pour < 10 ans exp', 'Bullet points commençant par un verbe d\'action'] },
  Allemagne: { cvFormat: 'Lebenslauf', requiredSections: ['Persönliche Daten', 'Bildungsweg', 'Beruflicher Werdegang', 'Kenntnisse', 'Hobbys'], forbiddenSections: ['Références sans autorisation'], photoRequired: true, maxPages: 2, language: 'Allemand / Anglais', tips: ['Photo obligatoire (bienséant)', 'Détails personnels étendus'] },
  'Émirats Arabes Unis': { cvFormat: 'International Moyen-Orient', requiredSections: ['Personal Info', 'Photo', 'Summary', 'Experience', 'Education', 'Skills'], forbiddenSections: [], photoRequired: true, maxPages: 2, language: 'Anglais', tips: ['Photo d\'identité obligatoire', 'Informations personnelles complètes'] },
  Suisse: { cvFormat: 'Suisse structuré', requiredSections: ['Données personnelles', 'Formation', 'Expérience', 'Compétences', 'Références'], forbiddenSections: [], photoRequired: true, maxPages: 2, language: 'Allemand / Français / Anglais', tips: ['Photo obligatoire', 'Références requises'] },
  Australie: { cvFormat: 'Aussie Resume', requiredSections: ['Profile', 'Key Skills', 'Employment History', 'Education', 'Referees'], forbiddenSections: ['Photo', 'Âge', 'Nationalité', 'Adresse complète'], photoRequired: false, maxPages: 3, language: 'Anglais', tips: ['Selection Criteria response possible', '2-3 pages acceptable'] },
  Belgique: { cvFormat: 'Europass', requiredSections: ['Informations personnelles', 'Formation', 'Expérience', 'Compétences', 'Langues'], forbiddenSections: ['Photo (optionnelle)'], photoRequired: false, maxPages: 2, language: 'Français / Néerlandais', tips: ['Format Europass recommandé', 'Photo optionnelle'] },
  Espagne: { cvFormat: 'Currículum Europass', requiredSections: ['Datos personales', 'Formación', 'Experiencia', 'Competencias'], forbiddenSections: ['Données sensibles'], photoRequired: true, maxPages: 2, language: 'Espagnol', tips: ['Format Europass recommandé', 'Photo généralement incluse'] },
  Italie: { cvFormat: 'Curriculum Vitae', requiredSections: ['Dati personali', 'Istruzione', 'Esperienza', 'Competenze'], forbiddenSections: ['Données sensibles non pertinentes'], photoRequired: true, maxPages: 2, language: 'Italien', tips: ['Curriculum Europass recommandé', 'Photo incluse'] },
  Japon: { cvFormat: 'Rirekisho / English Resume', requiredSections: ['Personal Data', 'Education', 'Work Experience', 'Skills'], forbiddenSections: [], photoRequired: true, maxPages: 2, language: 'Japonais / Anglais', tips: ['Format Rirekisho standard', 'Photo obligatoire', 'Structure très codifiée'] },
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-amber-500'
  return 'text-red-500'
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-amber-500'
  return 'bg-red-500'
}

export default function MobilityProfile() {
  const { stepData, extractedProfile, setStep, setMobilityResult } = useCVStore()
  const targetCountry = (stepData.targetCountry as string) || 'France'
  const [compatibilityScore] = useState(68)
  const [skillsGap] = useState<string[]>(['LinkedIn profil détaillé', 'Certification cloud avancée'])
  const [recommendations] = useState<string[]>([
    'Supprimer la photo pour le marché canadien',
    'Ajouter un résumé professionnel de 3 lignes',
    'Traduire les intitulés de poste en anglais',
    'Reformuler les descriptions en bullet points orientés action',
    'Ajouter des mots-clés spécifiques au secteur visé',
  ])

  useEffect(() => {
    if (extractedProfile) {
      const norms = countryNormsData[targetCountry] ?? countryNormsData['France']
      setMobilityResult({
        targetCountry,
        countryNorms: norms,
        formattedCV: {
          summary: extractedProfile.summary,
          experience: extractedProfile.experience,
          education: extractedProfile.education,
          skills: extractedProfile.skills,
          languages: extractedProfile.languages,
        },
        formattedCL: { subject: '', greeting: '', paragraphs: [], signOff: '' },
        compatibilityScore,
        skillsGap,
        recommendations,
      })
    }
  }, [extractedProfile, targetCountry, compatibilityScore, skillsGap, recommendations, setMobilityResult])

  const profile = extractedProfile
  const norms = countryNormsData[targetCountry] ?? countryNormsData['France']

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
            onClick={() => setStep('mobilityUpload', { targetCountry })}
            className="text-emerald-700 hover:bg-emerald-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-emerald-900">Profil Structuré</h1>
          <Badge variant="secondary" className="ml-auto bg-emerald-100 text-emerald-700">
            {countryFlags[targetCountry] ?? '🌍'} {targetCountry}
          </Badge>
        </div>
      </motion.header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT: Original extracted profile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              <User className="mr-2 inline h-5 w-5 text-emerald-600" />
              Profil original extrait
            </h2>

            <Card className="border-emerald-200 bg-white shadow-sm">
              <CardContent className="space-y-5 p-5">
                {/* Personal info */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Informations personnelles</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      { icon: User, label: profile?.fullName ?? '—' },
                      { icon: Mail, label: profile?.email ?? '—' },
                      { icon: Phone, label: profile?.phone ?? '—' },
                      { icon: MapPin, label: profile?.location ?? '—' },
                    ].map((item, i) => {
                      const Icon = item.icon
                      return (
                        <div key={i} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                          <Icon className="h-4 w-4 shrink-0 text-emerald-600" />
                          <span className="truncate text-sm text-gray-700">{item.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Compétences</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {profile?.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="bg-emerald-50 text-emerald-700">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                    <Briefcase className="mr-1 inline h-3.5 w-3.5" /> Expérience
                  </h3>
                  <div className="space-y-3">
                    {profile?.experience.map((exp, i) => (
                      <div key={i} className="relative pl-4 border-l-2 border-emerald-200">
                        <p className="text-sm font-medium text-gray-800">{exp.title}</p>
                        <p className="text-xs text-emerald-600">{exp.company} · {exp.period}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                    <GraduationCap className="mr-1 inline h-3.5 w-3.5" /> Formation
                  </h3>
                  <div className="space-y-3">
                    {profile?.education.map((edu, i) => (
                      <div key={i} className="relative pl-4 border-l-2 border-teal-200">
                        <p className="text-sm font-medium text-gray-800">{edu.degree}</p>
                        <p className="text-xs text-teal-600">{edu.school} · {edu.period}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* RIGHT: Reformatted for target country */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              <Globe className="mr-2 inline h-5 w-5 text-teal-600" />
              Adapté pour {targetCountry}
            </h2>

            {/* Country norms */}
            <Card className="mb-4 border-teal-200 bg-white shadow-sm">
              <CardContent className="p-5">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Normes du pays
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <FileImage className={`h-4 w-4 ${norms.photoRequired ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <span className="text-sm text-gray-700">Photo {norms.photoRequired ? 'requise' : 'non requise'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-teal-600" />
                    <span className="text-sm text-gray-700">{norms.maxPages} page(s) max</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-teal-600" />
                    <span className="text-sm text-gray-700">{norms.language}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-teal-600" />
                    <span className="text-sm text-gray-700">{norms.cvFormat}</span>
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <p className="text-xs font-medium text-emerald-700">Sections requises :</p>
                  <div className="flex flex-wrap gap-1">
                    {norms.requiredSections.map((s) => (
                      <Badge key={s} variant="outline" className="border-emerald-300 text-xs text-emerald-700">
                        <CheckCircle2 className="mr-0.5 h-2.5 w-2.5" /> {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                {norms.forbiddenSections.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium text-red-600">Sections à éviter :</p>
                    <div className="flex flex-wrap gap-1">
                      {norms.forbiddenSections.map((s) => (
                        <Badge key={s} variant="outline" className="border-red-300 text-xs text-red-600">
                          <XIcon className="mr-0.5 h-2.5 w-2.5" /> {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Compatibility score */}
            <Card className="mb-4 border-emerald-200 bg-white shadow-sm">
              <CardContent className="flex items-center gap-6 p-5">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                  <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className={getScoreBg(compatibilityScore)}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray={`${compatibilityScore}, 100`}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={`absolute text-lg font-bold ${getScoreColor(compatibilityScore)}`}>
                    {compatibilityScore}%
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Score de compatibilité</p>
                  <p className="text-xs text-gray-500">
                    {compatibilityScore >= 80
                      ? 'Votre CV est très bien adapté.'
                      : compatibilityScore >= 60
                        ? 'Quelques ajustements recommandés.'
                        : 'Des modifications importantes sont nécessaires.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Skills gap */}
            <Card className="mb-4 border-amber-200 bg-white shadow-sm">
              <CardContent className="p-5">
                <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-amber-600">
                  <AlertTriangle className="h-4 w-4" /> Compétences manquantes
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skillsGap.map((s) => (
                    <Badge key={s} variant="outline" className="border-amber-300 text-amber-700">
                      {s}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-emerald-200 bg-white shadow-sm">
              <CardContent className="p-5">
                <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-emerald-600">
                  <Lightbulb className="h-4 w-4" /> Recommandations
                </h3>
                <ul className="space-y-2">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={() => setStep('mobilityResult')}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 text-white shadow-lg hover:from-emerald-700 hover:to-teal-700"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Générer CV & Lettre adaptés
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setStep('mobilityUpload', { targetCountry })}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <Eye className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </motion.div>
      </main>
    </div>
  )
}
