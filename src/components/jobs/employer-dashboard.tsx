'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, LayoutDashboard, Briefcase, Users, TrendingUp, Eye, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCVStore } from '@/store/cv-store'
import { useSession } from 'next-auth/react'

export default function EmployerDashboardView() {
  const { setStep } = useCVStore()
  const { data: session } = useSession()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/employer/dashboard')
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Offres publiées', value: stats?.postedJobs || 0, icon: Briefcase, color: 'emerald' },
    { label: 'Candidatures reçues', value: stats?.totalApplications || 0, icon: Users, color: 'teal' },
    { label: 'Score moyen', value: stats?.avgMatchScore ? `${stats.avgMatchScore}%` : '—', icon: TrendingUp, color: 'amber' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => setStep('landing')} className="cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="text-emerald-600" /> Dashboard Employeur
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${s.color}-100 flex items-center justify-center`}>
                    <s.icon className={`w-6 h-6 text-${s.color}-600`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Mes offres</h2>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer" onClick={() => setStep('employerPostJob')}>
            + Publier une offre
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}
          </div>
        ) : !stats?.postedJobs ? (
          <Card className="text-center p-12">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">Aucune offre publiée</p>
            <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700 cursor-pointer" onClick={() => setStep('employerPostJob')}>
              Publier votre première offre
            </Button>
          </Card>
        ) : (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        )}
      </div>
    </div>
  )
}
