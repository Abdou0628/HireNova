'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Briefcase, Users, Eye, TrendingUp, PlusCircle, Globe, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCVStore } from '@/store/cv-store'

interface Stats { totalJobs: number; totalApplications: number; totalViews: number; avgMatchScore: number }
interface EmployerJob { id: string; title: string; location: string; country: string; region: string; applicationsCount: number; viewsCount: number; status: string }

export default function GlobalEmployerDashboardView() {
  const { setStep } = useCVStore()
  const [stats, setStats] = useState<Stats>({ totalJobs: 0, totalApplications: 0, totalViews: 0, avgMatchScore: 0 })
  const [jobs, setJobs] = useState<EmployerJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/global-jobs/employer?employerId=demo')
      .then(r => r.json())
      .then(data => { setStats(data.stats || {}); setJobs(data.jobs || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { icon: Briefcase, label: 'Offres publiées', value: stats.totalJobs, color: 'text-teal-600' },
    { icon: Users, label: 'Candidatures', value: stats.totalApplications, color: 'text-emerald-600' },
    { icon: Eye, label: 'Vues totales', value: stats.totalViews, color: 'text-blue-600' },
    { icon: TrendingUp, label: 'Score moyen', value: `${stats.avgMatchScore}%`, color: 'text-purple-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setStep('landing')} className="cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-1" /> Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Globe className="text-teal-600" /> Dashboard Global
              </h1>
              <p className="text-sm text-muted-foreground">Vue d&apos;ensemble de vos offres internationales</p>
            </div>
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700 cursor-pointer" onClick={() => setStep('globalPostJob')}>
            <PlusCircle className="w-4 h-4 mr-2" /> Nouvelle offre
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {statCards.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card><CardContent className="p-4">
                <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent></Card>
            </motion.div>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}</div>
        ) : jobs.length === 0 ? (
          <Card className="p-8 text-center">
            <Briefcase className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="font-medium text-muted-foreground">Aucune offre publiée</p>
            <Button className="mt-4 bg-teal-600 hover:bg-teal-700 cursor-pointer" onClick={() => setStep('globalPostJob')}>
              Publier votre première offre
            </Button>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">Poste</th>
                      <th className="text-left p-3 font-medium hidden sm:table-cell">Localisation</th>
                      <th className="text-left p-3 font-medium hidden md:table-cell">Région</th>
                      <th className="text-center p-3 font-medium">Candidatures</th>
                      <th className="text-center p-3 font-medium">Vues</th>
                      <th className="text-center p-3 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((j) => (
                      <tr key={j.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => setStep('globalJobDetail', { jobId: j.id })}>
                        <td className="p-3 font-medium">{j.title}</td>
                        <td className="p-3 text-muted-foreground hidden sm:table-cell">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {j.location}, {j.country}</span>
                        </td>
                        <td className="p-3 hidden md:table-cell"><Badge variant="outline" className="text-xs">{j.region}</Badge></td>
                        <td className="p-3 text-center">{j.applicationsCount}</td>
                        <td className="p-3 text-center">{j.viewsCount}</td>
                        <td className="p-3 text-center">
                          <Badge className={`text-xs ${j.status === 'active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-100'}`}>
                            {j.status === 'active' ? 'Active' : j.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
