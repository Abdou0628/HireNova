'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Building2, DollarSign, Globe, Plane, Shield, Wifi, Briefcase, Clock, CheckCircle2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCVStore } from '@/store/cv-store'

interface GlobalJob {
  id: string; title: string; company: string; location: string; country: string
  region: string; type: string; salaryMin?: number; salaryMax?: number; currency: string
  description: string; requirements: string; skills?: string; language: string
  visaSponsorship: boolean; relocationPackage: boolean; isRemote: boolean
  viewsCount: number; applicationsCount: number; createdAt: string
}

export default function GlobalJobDetailView() {
  const { setStep, stepData } = useCVStore()
  const [job, setJob] = useState<GlobalJob | null>(null)
  const [loading, setLoading] = useState(true)
  const jobId = stepData?.jobId as string

  useEffect(() => {
    if (!jobId) return
    fetch(`/api/global-jobs/${jobId}`)
      .then(r => r.json())
      .then(data => setJob(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [jobId])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" /></div>
  if (!job) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Offre introuvable</p></div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => setStep('globalMarket')} className="cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Button>
          <Globe className="text-teal-600 w-6 h-6" />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{job.title}</h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> {job.company}
                <span className="text-xs">•</span>
                <MapPin className="w-4 h-4" /> {job.location}, {job.country}
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">{job.region}</Badge>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100">{job.type}</Badge>
            {job.visaSponsorship && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"><Shield className="w-3 h-3 mr-1" /> Visa Sponsorship</Badge>}
            {job.relocationPackage && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100"><Plane className="w-3 h-3 mr-1" /> Relocation Package</Badge>}
            {job.isRemote && <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100"><Wifi className="w-3 h-3 mr-1" /> Télétravail</Badge>}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { icon: DollarSign, label: 'Salaire', value: job.salaryMin && job.salaryMax ? `${job.salaryMin}-${job.salaryMax} ${job.currency}` : 'Non spécifié' },
              { icon: Briefcase, label: 'Type', value: job.type },
              { icon: Users, label: 'Candidatures', value: String(job.applicationsCount) },
              { icon: Clock, label: 'Langue', value: job.language.toUpperCase() }
            ].map((s, i) => (
              <Card key={i}><CardContent className="p-3 text-center">
                <s.icon className="w-4 h-4 mx-auto text-teal-600 mb-1" />
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-sm font-medium">{s.value}</p>
              </CardContent></Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-5">
                  <h2 className="font-semibold mb-3">Description</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{job.description}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <h2 className="font-semibold mb-3">Exigences</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              {job.skills && (
                <Card>
                  <CardContent className="p-5">
                    <h2 className="font-semibold mb-3 text-sm">Compétences</h2>
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.split(',').map((s, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{s.trim()}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              <Card className="bg-teal-50 border-teal-200">
                <CardContent className="p-5 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-teal-600" />
                  <p className="font-semibold text-sm">Prêt à postuler ?</p>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 cursor-pointer" onClick={() => setStep('globalApply', { jobId: job.id })}>
                    Postuler maintenant
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
