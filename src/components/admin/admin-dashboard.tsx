'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Users,
  FileText,
  PenLine,
  Crown,
  Zap,
  TrendingUp,
  Calendar,
  BarChart3,
  RefreshCw,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSession } from 'next-auth/react'

interface AdminData {
  overview: {
    totalUsers: number
    proUsers: number
    lifetimeUsers: number
    totalCVs: number
    totalCLs: number
    totalDocuments: number
    monthlyRevenuePro: number
    totalRevenueLifetime: number
    estimatedMonthlyRevenue: number
  }
  last30days: {
    newUsers: number
    newCVs: number
    newCLs: number
  }
  dailySignups: Record<string, number>
  planDistribution: {
    free: number
    pro: number
    lifetime: number
  }
  recentUsers: Array<{
    name: string | null
    email: string
    plan: string
    createdAt: string
    cvCountThisMonth: number
    clCountThisMonth: number
  }>
  recentCVs: Array<{
    fullName: string
    targetJob: string
    language: string
    createdAt: string
    templateStyle: string
  }>
  recentCLs: Array<{
    fullName: string
    jobTitle: string
    companyName: string
    language: string
    createdAt: string
  }>
}

interface AdminDashboardProps {
  isOpen: boolean
  onClose: () => void
}

function MetricCard({ icon: Icon, label, value, subValue, color }: { icon: React.ElementType; label: string; value: string | number; subValue?: string; color: string }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">{label}</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{typeof value === 'number' ? value.toLocaleString('fr-FR') : value}</p>
            {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MiniBarChart({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]))
  const maxVal = Math.max(...entries.map(([, v]) => v), 1)

  return (
    <div className="flex items-end gap-1.5 h-32">
      {entries.map(([date, count]) => {
        const height = Math.max((count / maxVal) * 100, 4)
        const day = date.split('-').slice(1).join('/')
        return (
          <div key={date} className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <span className="text-[10px] font-semibold text-foreground">{count}</span>
            <div
              className="w-full bg-emerald-500 rounded-t-sm transition-all hover:bg-emerald-600"
              style={{ height: `${height}%` }}
            />
            <span className="text-[9px] text-muted-foreground truncate w-full text-center">{day}</span>
          </div>
        )
      })}
      {entries.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Aucune donnée
        </div>
      )}
    </div>
  )
}

function PlanChart({ data }: { data: { free: number; pro: number; lifetime: number } }) {
  const total = data.free + data.pro + data.lifetime || 1
  const freePct = Math.round((data.free / total) * 100)
  const proPct = Math.round((data.pro / total) * 100)
  const lifetimePct = 100 - freePct - proPct

  return (
    <div className="space-y-3">
      {/* Visual bar */}
      <div className="flex h-4 rounded-full overflow-hidden bg-muted">
        <div className="bg-stone-400 transition-all" style={{ width: `${freePct}%` }} />
        <div className="bg-emerald-500 transition-all" style={{ width: `${proPct}%` }} />
        <div className="bg-amber-500 transition-all" style={{ width: `${lifetimePct}%` }} />
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-stone-400" />
          <span className="text-muted-foreground">Free: <strong className="text-foreground">{data.free}</strong> ({freePct}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Pro: <strong className="text-foreground">{data.pro}</strong> ({proPct}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-muted-foreground">Lifetime: <strong className="text-foreground">{data.lifetime}</strong> ({lifetimePct}%)</span>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const { data: session } = useSession()
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'cvs'>('overview')

  async function fetchStats() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        setData(await res.json())
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) fetchStats()
  }, [isOpen])

  if (!isOpen) return null

  const o = data?.overview
  const l30 = data?.last30days

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        className="fixed inset-2 sm:inset-4 lg:inset-6 z-[101] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-white" />
            <div>
              <h2 className="text-lg font-bold text-white">Dashboard Admin</h2>
              <p className="text-xs text-emerald-100">CV Genius IA — {session?.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchStats}
              disabled={loading}
              className="text-white hover:bg-white/20 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Rafraîchir
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 cursor-pointer">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-4 sm:px-6 bg-muted/30">
          {([['overview', BarChart3, 'Vue d\'ensemble'], ['users', Users, 'Utilisateurs'], ['cvs', FileText, 'Documents']] as const).map(
            ([tab, Icon, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            )
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!data ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <RefreshCw className={`w-6 h-6 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Chargement des données...
            </div>
          ) : (
            <>
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Revenue Highlight */}
                  <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-semibold text-foreground">Revenu estimé</h3>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Revenu mensuel (Pro)</p>
                          <p className="text-2xl font-bold text-emerald-700">{o.monthlyRevenuePro.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Revenue Lifetime (total)</p>
                          <p className="text-2xl font-bold text-amber-600">{o.totalRevenueLifetime.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <p className="text-xs text-muted-foreground">Revenue total estimé</p>
                          <p className="text-2xl font-bold text-foreground">
                            {(o.monthlyRevenuePro + o.totalRevenueLifetime).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <MetricCard icon={Users} label="Utilisateurs" value={o.totalUsers} subValue={`${l30.newUsers} ce mois`} color="bg-blue-50 text-blue-600" />
                    <MetricCard icon={Crown} label="Abonnés Pro" value={o.proUsers} color="bg-emerald-50 text-emerald-600" />
                    <MetricCard icon={FileText} label="CVs générés" value={o.totalCVs} subValue={`${l30.newCVs} ce mois`} color="bg-violet-50 text-violet-600" />
                    <MetricCard icon={PenLine} label="Lettres générées" value={o.totalCLs} subValue={`${l30.newCLs} ce mois`} color="bg-rose-50 text-rose-600" />
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          Inscriptions (14 derniers jours)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <MiniBarChart data={data.dailySignups} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-emerald-600" />
                          Distribution des plans
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <PlanChart data={data.planDistribution} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Last 30 days summary */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold">Activité des 30 derniers jours</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{l30.newUsers}</p>
                          <p className="text-xs text-muted-foreground">Nouveaux utilisateurs</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-violet-600">{l30.newCVs}</p>
                          <p className="text-xs text-muted-foreground">CVs générés</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-rose-600">{l30.newCLs}</p>
                          <p className="text-xs text-muted-foreground">Lettres générées</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* USERS TAB */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Derniers utilisateurs inscrits</h3>
                  <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium text-muted-foreground">Nom</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Plan</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">CVs/CLs</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Inscription</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentUsers.length === 0 ? (
                          <tr><td colSpan={5} className="text-center p-8 text-muted-foreground">Aucun utilisateur inscrit</td></tr>
                        ) : (
                          data.recentUsers.map((u) => (
                            <tr key={u.email} className="border-t hover:bg-muted/30">
                              <td className="p-3 font-medium">{u.name || '—'}</td>
                              <td className="p-3 text-muted-foreground">{u.email}</td>
                              <td className="p-3">
                                <Badge variant={u.plan !== 'free' ? 'default' : 'secondary'} className={`text-xs ${u.plan === 'pro' ? 'bg-emerald-600' : u.plan === 'lifetime' ? 'bg-amber-500' : ''}`}>
                                  {u.plan}
                                </Badge>
                              </td>
                              <td className="p-3 text-muted-foreground">{u.cvCountThisMonth} / {u.clCountThisMonth}</td>
                              <td className="p-3 text-muted-foreground text-xs">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CVS TAB */}
              {activeTab === 'cvs' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Derniers CVs générés</h3>
                    <div className="overflow-x-auto rounded-xl border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left p-3 font-medium text-muted-foreground">Nom</th>
                            <th className="text-left p-3 font-medium text-muted-foreground">Poste visé</th>
                            <th className="text-left p-3 font-medium text-muted-foreground">Langue</th>
                            <th className="text-left p-3 font-medium text-muted-foreground">Template</th>
                            <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.recentCVs.length === 0 ? (
                            <tr><td colSpan={5} className="text-center p-8 text-muted-foreground">Aucun CV généré</td></tr>
                          ) : (
                            data.recentCVs.map((cv, i) => (
                              <tr key={i} className="border-t hover:bg-muted/30">
                                <td className="p-3 font-medium">{cv.fullName}</td>
                                <td className="p-3 text-muted-foreground">{cv.targetJob}</td>
                                <td className="p-3"><Badge variant="outline" className="text-xs">{cv.language.toUpperCase()}</Badge></td>
                                <td className="p-3 text-muted-foreground">{cv.templateStyle}</td>
                                <td className="p-3 text-muted-foreground text-xs">{new Date(cv.createdAt).toLocaleDateString('fr-FR')}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Dernières lettres de motivation</h3>
                    <div className="overflow-x-auto rounded-xl border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left p-3 font-medium text-muted-foreground">Nom</th>
                            <th className="text-left p-3 font-medium text-muted-foreground">Poste</th>
                            <th className="text-left p-3 font-medium text-muted-foreground">Entreprise</th>
                            <th className="text-left p-3 font-medium text-muted-foreground">Langue</th>
                            <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.recentCLs.length === 0 ? (
                            <tr><td colSpan={5} className="text-center p-8 text-muted-foreground">Aucune lettre générée</td></tr>
                          ) : (
                            data.recentCLs.map((cl, i) => (
                              <tr key={i} className="border-t hover:bg-muted/30">
                                <td className="p-3 font-medium">{cl.fullName}</td>
                                <td className="p-3 text-muted-foreground">{cl.jobTitle}</td>
                                <td className="p-3 text-muted-foreground">{cl.companyName}</td>
                                <td className="p-3"><Badge variant="outline" className="text-xs">{cl.language.toUpperCase()}</Badge></td>
                                <td className="p-3 text-muted-foreground text-xs">{new Date(cl.createdAt).toLocaleDateString('fr-FR')}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
