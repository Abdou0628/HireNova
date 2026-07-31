'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Users,
  FileText,
  DollarSign,
  Crown,
  TrendingUp,
  RefreshCw,
  Shield,
  Globe,
  ArrowLeft,
  Star,
  MessageSquare,
  GraduationCap,
  Link2,
  Plane,
  KeyRound,
  TicketCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  BarChart3,
  Activity,
  Briefcase,
  UserPlus,
  FileCheck2,
  Receipt,
  ArrowUpRight,
  Wifi,
  Gift,
  Building2,
  HeadphonesIcon,
  Zap,
  CircleDollarSign,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { useCVStore } from '@/store/cv-store'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ComprehensiveStats {
  overview: {
    totalUsers: number
    proUsers: number
    annualUsers: number
    freeUsers: number
    employerUsers: number
    totalResumes: number
    totalCoverLetters: number
    totalAtsAnalyses: number
    totalDocuments: number
    avgRating: number
  }
  last30days: {
    newUsers: number
    newResumes: number
    newCoverLetters: number
  }
  planDistribution: {
    free: number
    pro: number
    annual: number
  }
  jobs: {
    totalJobs: number
    activeJobs: number
    totalApplications: number
    totalEmployers: number
  }
  global: {
    totalGlobalJobs: number
    activeGlobalJobs: number
    totalGlobalApplications: number
    visaSponsorshipJobs: number
    supportedCountries: number
    countries: string[]
  }
  mobility: {
    totalMobilityProfiles: number
    completedMobility: number
    mobilityThisMonth: number
  }
  api: {
    totalApiSubscribers: number
    activeApiSubscribers: number
    totalApiCalls: number
    apiCallsThisMonth: number
    apiPlans: Array<{ name: string; subscribers: number; calls: number }>
  }
  referral: {
    totalReferrals: number
    completedReferrals: number
    rewardedReferrals: number
    pendingReferrals: number
  }
  campus: {
    totalTickets: number
    openTickets: number
  }
  support: {
    openTickets: number
    resolvedTickets: number
    totalTickets: number
  }
  security: {
    critical: number
    high: number
    total: number
    recent: number
    recentAlerts: Array<{
      id: string
      type: string
      severity: 'critical' | 'high' | 'medium' | 'low'
      ip: string
      path: string
      method: string
      email: string | null
      details: string | null
      createdAt: string
    }>
  }
  financial: {
    proMonthlyRevenue: number
    annualRevenue: number
    lifetimeRevenue: number
    apiRevenue: number
    totalMonthlyRevenue: number
    totalAnnualRevenue: number
    estimatedLifetimeValue: number
    currency: string
    revenueBreakdown: Array<{
      source: string
      amount: number
      type: 'recurring' | 'annual' | 'one-time'
    }>
  }
  recent: {
    users: Array<{
      id: string
      name: string | null
      email: string
      plan: string
      role: string
      createdAt: string
    }>
    resumes: Array<{
      id: string
      fullName: string
      targetJob: string
      language: string
      createdAt: string
    }>
    applications: Array<{
      id: string
      candidateName: string
      candidateEmail: string
      status: string
      createdAt: string
      job: { title: string; company: string }
    }>
  }
  dailySignups: Record<string, number>
  timestamp: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number): string => new Intl.NumberFormat('fr-FR').format(n)
const fmtEur = (n: number): string => `${new Intl.NumberFormat('fr-FR').format(n)} €`
const fmtDate = (d: string): string =>
  new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
const fmtDateShort = (d: string): string =>
  new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  })

const planColor = (plan: string) => {
  switch (plan) {
    case 'pro':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    case 'annual':
      return 'bg-amber-100 text-amber-700 border-amber-200'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

const severityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-700 border-red-200'
    case 'high':
      return 'bg-orange-100 text-orange-700 border-orange-200'
    default:
      return 'bg-yellow-100 text-yellow-700 border-yellow-200'
  }
}

const revenueTypeLabel = (type: string) => {
  switch (type) {
    case 'recurring':
      return 'Récurrent'
    case 'annual':
      return 'Annuel'
    case 'one-time':
      return 'Ponctuel'
    default:
      return type
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = 'emerald',
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color?: 'emerald' | 'amber' | 'rose' | 'sky'
}) {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
    sky: 'bg-sky-50 text-sky-600 border-sky-200',
  }
  const iconBg = {
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    rose: 'bg-rose-100 text-rose-700',
    sky: 'bg-sky-100 text-sky-700',
  }

  return (
    <Card className={`border ${colorMap[color]} transition-all hover:shadow-md`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">
              {value}
            </p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className={`p-2.5 rounded-xl ${iconBg[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatSkeleton() {
  return (
    <Card className="border">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  )
}

function LoadingGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <StatSkeleton key={i} />
      ))}
    </div>
  )
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="p-4 rounded-full bg-rose-100">
        <AlertTriangle className="w-8 h-8 text-rose-600" />
      </div>
      <p className="text-muted-foreground text-center max-w-md">
        {message}
      </p>
      <Button
        variant="outline"
        onClick={onRetry}
        className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
      >
        <RefreshCw className="w-4 h-4" />
        Réessayer
      </Button>
    </div>
  )
}

// ─── Tab Content Components ──────────────────────────────────────────────────

function OverviewTab({ stats }: { stats: ComprehensiveStats }) {
  const { overview, last30days, dailySignups } = stats

  const today = new Date()
  const barData = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (13 - i))
    const key = d.toISOString().split('T')[0]
    return {
      date: d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
      count: dailySignups[key] ?? 0,
    }
  })
  const maxBar = Math.max(...barData.map((b) => b.count), 1)

  return (
    <div className="space-y-6">
      {/* Primary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Utilisateurs totaux"
          value={fmt(overview.totalUsers)}
          sub={`${fmt(overview.proUsers)} Pro · ${fmt(overview.annualUsers)} Annuel`}
          color="emerald"
        />
        <StatCard
          icon={FileText}
          label="CVs créés"
          value={fmt(overview.totalResumes)}
          sub={`${fmt(overview.totalCoverLetters)} lettres de motivation`}
          color="amber"
        />
        <StatCard
          icon={FileCheck2}
          label="Documents totaux"
          value={fmt(overview.totalDocuments)}
          sub={`${fmt(overview.totalAtsAnalyses)} analyses ATS`}
          color="sky"
        />
        <StatCard
          icon={DollarSign}
          label="Revenu mensuel"
          value={fmtEur(stats.financial.totalMonthlyRevenue)}
          sub={`${fmt(overview.totalUsers)} utilisateurs`}
          color="emerald"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Crown}
          label="Utilisateurs Pro"
          value={fmt(overview.proUsers)}
          sub={`${((overview.proUsers / Math.max(overview.totalUsers, 1)) * 100).toFixed(1)}% du total`}
          color="amber"
        />
        <StatCard
          icon={Zap}
          label="Abonnés annuels"
          value={fmt(overview.annualUsers)}
          sub={`${((overview.annualUsers / Math.max(overview.totalUsers, 1)) * 100).toFixed(1)}% du total`}
          color="emerald"
        />
        <StatCard
          icon={BarChart3}
          label="Analyses ATS"
          value={fmt(overview.totalAtsAnalyses)}
          sub="Analyses de CV effectuées"
          color="sky"
        />
        <StatCard
          icon={Star}
          label="Note moyenne"
          value={overview.avgRating.toFixed(1)}
          sub="Sur l'ensemble de la plateforme"
          color="amber"
        />
      </div>

      {/* Last 30 days + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-emerald-700 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Derniers 30 jours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Nouveaux utilisateurs</span>
              <span className="font-semibold">{fmt(last30days.newUsers)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Nouveaux CVs</span>
              <span className="font-semibold">{fmt(last30days.newResumes)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Nouvelles lettres</span>
              <span className="font-semibold">{fmt(last30days.newCoverLetters)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-emerald-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Inscriptions quotidiennes (14 jours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1.5 h-40">
              {barData.map((bar, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {bar.count > 0 ? bar.count : ''}
                  </span>
                  <div
                    className="w-full bg-emerald-500 rounded-t-sm transition-all duration-500 min-h-[2px]"
                    style={{
                      height: `${Math.max((bar.count / maxBar) * 100, 2)}%`,
                      opacity: bar.count > 0 ? 1 : 0.15,
                    }}
                  />
                  <span className="text-[9px] text-muted-foreground leading-tight text-center">
                    {bar.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function UsersTab({ stats }: { stats: ComprehensiveStats }) {
  const { overview, planDistribution, recent } = stats
  const totalUsers = Math.max(overview.totalUsers, 1)

  return (
    <div className="space-y-6">
      <Card className="border border-emerald-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Répartition des plans
          </CardTitle>
          <CardDescription>Distribution des utilisateurs par type d'abonnement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-400" />
                Gratuit
              </span>
              <span className="font-medium">
                {fmt(planDistribution.free)} ({((planDistribution.free / totalUsers) * 100).toFixed(1)}%)
              </span>
            </div>
            <Progress
              value={(planDistribution.free / totalUsers) * 100}
              className="h-2.5 [&>div]:bg-gray-400"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                Pro
              </span>
              <span className="font-medium">
                {fmt(planDistribution.pro)} ({((planDistribution.pro / totalUsers) * 100).toFixed(1)}%)
              </span>
            </div>
            <Progress
              value={(planDistribution.pro / totalUsers) * 100}
              className="h-2.5 [&>div]:bg-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                Annuel
              </span>
              <span className="font-medium">
                {fmt(planDistribution.annual)} ({((planDistribution.annual / totalUsers) * 100).toFixed(1)}%)
              </span>
            </div>
            <Progress
              value={(planDistribution.annual / totalUsers) * 100}
              className="h-2.5 [&>div]:bg-amber-500"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total utilisateurs" value={fmt(overview.totalUsers)} color="emerald" />
        <StatCard icon={Crown} label="Utilisateurs Pro" value={fmt(overview.proUsers)} color="amber" />
        <StatCard icon={Zap} label="Abonnés annuels" value={fmt(overview.annualUsers)} color="emerald" />
        <StatCard icon={Building2} label="Employeurs" value={fmt(overview.employerUsers)} color="sky" />
      </div>

      <Card className="border border-emerald-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-600" />
            Utilisateurs récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Aucun utilisateur récent
                    </TableCell>
                  </TableRow>
                )}
                {recent.users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name || '—'}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={planColor(u.plan)}>
                        {u.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize text-sm">{u.role}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {fmtDateShort(u.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

function FinancesTab({ stats }: { stats: ComprehensiveStats }) {
  const { financial } = stats

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CircleDollarSign}
          label="Revenu mensuel récurrent"
          value={fmtEur(financial.totalMonthlyRevenue)}
          sub="MRR (Monthly Recurring Revenue)"
          color="emerald"
        />
        <StatCard
          icon={Receipt}
          label="Revenu annuel"
          value={fmtEur(financial.totalAnnualRevenue)}
          sub="Projections annuelles"
          color="amber"
        />
        <StatCard
          icon={KeyRound}
          label="Revenu API"
          value={fmtEur(financial.apiRevenue)}
          sub="Abonnements API"
          color="sky"
        />
        <StatCard
          icon={TrendingUp}
          label="Valeur vie totale estimée"
          value={fmtEur(financial.estimatedLifetimeValue)}
          sub="Lifetime Value (LTV)"
          color="emerald"
        />
      </div>

      <Card className="border border-emerald-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Résumé financier
          </CardTitle>
          <CardDescription>Synthèse des mouvements financiers de la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">
                Revenu mensuel total
              </p>
              <p className="text-2xl font-bold text-emerald-700">
                {fmtEur(financial.totalMonthlyRevenue)}
              </p>
              <p className="text-xs text-emerald-600/70 mt-1">
                Pro : {fmtEur(financial.proMonthlyRevenue)} · API : {fmtEur(financial.apiRevenue)}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
              <p className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-1">
                Revenu annuel projeté
              </p>
              <p className="text-2xl font-bold text-amber-700">
                {fmtEur(financial.totalAnnualRevenue)}
              </p>
              <p className="text-xs text-amber-600/70 mt-1">
                Basé sur les abonnements actifs
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Revenu cumulé vie
              </p>
              <p className="text-2xl font-bold text-gray-700">
                {fmtEur(financial.lifetimeRevenue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Depuis le lancement
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-emerald-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            Détail des revenus
          </CardTitle>
          <CardDescription>Décomposition par source et type</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financial.revenueBreakdown.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      Aucune donnée financière
                    </TableCell>
                  </TableRow>
                )}
                {financial.revenueBreakdown.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{row.source}</TableCell>
                    <TableCell className="font-semibold text-emerald-700">
                      {fmtEur(row.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          row.type === 'recurring'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : row.type === 'annual'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-gray-50 text-gray-600 border-gray-200'
                        }
                      >
                        {revenueTypeLabel(row.type)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

function JobsTab({ stats }: { stats: ComprehensiveStats }) {
  const { jobs, global, recent } = stats

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Briefcase}
          label="Emplois actifs"
          value={fmt(jobs.activeJobs)}
          sub={`sur ${fmt(jobs.totalJobs)} au total`}
          color="emerald"
        />
        <StatCard
          icon={FileCheck2}
          label="Candidatures totales"
          value={fmt(jobs.totalApplications)}
          sub={`${fmt(jobs.totalEmployers)} employeurs`}
          color="amber"
        />
        <StatCard
          icon={Globe}
          label="Offres globales actives"
          value={fmt(global.activeGlobalJobs)}
          sub={`${fmt(global.totalGlobalJobs)} au total`}
          color="emerald"
        />
        <StatCard
          icon={Plane}
          label="Offres avec visa"
          value={fmt(global.visaSponsorshipJobs)}
          sub="Visa Sponsorship"
          color="sky"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border border-emerald-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              Recrutement international
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Candidatures globales</span>
              <span className="font-semibold">{fmt(global.totalGlobalApplications)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pays supportés</span>
              <span className="font-semibold">{global.supportedCountries}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Offres avec relocation</span>
              <span className="font-semibold">{fmt(global.visaSponsorshipJobs)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-emerald-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              Pays couverts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {global.countries.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucun pays configuré</p>
              )}
              {global.countries.map((c) => (
                <Badge
                  key={c}
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  {c}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-emerald-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            Candidatures récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidat</TableHead>
                  <TableHead>Emploi</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.applications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Aucune candidature récente
                    </TableCell>
                  </TableRow>
                )}
                {recent.applications.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{a.candidateName}</p>
                        <p className="text-xs text-muted-foreground">{a.candidateEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{a.job.title}</p>
                        <p className="text-xs text-muted-foreground">{a.job.company}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          a.status === 'accepted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : a.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : a.status === 'interview'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-gray-50 text-gray-600 border-gray-200'
                        }
                      >
                        {a.status === 'accepted'
                          ? 'Accepté'
                          : a.status === 'rejected'
                            ? 'Refusé'
                            : a.status === 'interview'
                              ? 'Entretien'
                              : a.status === 'pending'
                                ? 'En attente'
                                : a.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {fmtDateShort(a.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

function MobilityTab({ stats }: { stats: ComprehensiveStats }) {
  const { mobility } = stats

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={Plane}
          label="Profils mobilité"
          value={fmt(mobility.totalMobilityProfiles)}
          sub="Profils OCR/NLP créés"
          color="emerald"
        />
        <StatCard
          icon={CheckCircle2}
          label="Profils complétés"
          value={fmt(mobility.completedMobility)}
          sub={
            mobility.totalMobilityProfiles > 0
              ? `${((mobility.completedMobility / mobility.totalMobilityProfiles) * 100).toFixed(1)}% de complétion`
              : undefined
          }
          color="amber"
        />
        <StatCard
          icon={Activity}
          label="Ce mois"
          value={fmt(mobility.mobilityThisMonth)}
          sub="Nouveaux profils ce mois"
          color="emerald"
        />
      </div>

      <Card className="border border-emerald-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Plane className="w-5 h-5 text-emerald-600" />
            Pipeline OCR + NLP
          </CardTitle>
          <CardDescription>
            Statistiques du module de mobilité internationale
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Taux de complétion</p>
                <p className="text-xs text-emerald-600/70 mt-1">
                  Profils entièrement traités par le pipeline OCR/NLP
                </p>
              </div>
              <span className="text-2xl font-bold text-emerald-700">
                {mobility.totalMobilityProfiles > 0
                  ? `${((mobility.completedMobility / mobility.totalMobilityProfiles) * 100).toFixed(1)}%`
                  : '—'}
              </span>
            </div>
            <Progress
              value={
                mobility.totalMobilityProfiles > 0
                  ? (mobility.completedMobility / mobility.totalMobilityProfiles) * 100
                  : 0
              }
              className="h-2.5 mt-3 [&>div]:bg-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
              <p className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-1">
                En cours
              </p>
              <p className="text-xl font-bold text-amber-700">
                {fmt(mobility.totalMobilityProfiles - mobility.completedMobility)}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">
                Croissance mensuelle
              </p>
              <p className="text-xl font-bold text-emerald-700">
                +{fmt(mobility.mobilityThisMonth)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ApiTab({ stats }: { stats: ComprehensiveStats }) {
  const { api } = stats

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={KeyRound}
          label="Abonnés API"
          value={fmt(api.totalApiSubscribers)}
          sub={`${fmt(api.activeApiSubscribers)} actifs`}
          color="emerald"
        />
        <StatCard
          icon={Wifi}
          label="Appels API totaux"
          value={fmt(api.totalApiCalls)}
          sub={`${fmt(api.apiCallsThisMonth)} ce mois`}
          color="amber"
        />
        <StatCard
          icon={Activity}
          label="Appels ce mois"
          value={fmt(api.apiCallsThisMonth)}
          sub="Volume mensuel"
          color="emerald"
        />
        <StatCard
          icon={DollarSign}
          label="Revenu API"
          value={fmtEur(stats.financial.apiRevenue)}
          sub="Abonnements API"
          color="sky"
        />
      </div>

      <Card className="border border-emerald-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-emerald-600" />
            Plans API
          </CardTitle>
          <CardDescription>Détail des forfaits API et leur utilisation</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Abonnés</TableHead>
                  <TableHead>Appels</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {api.apiPlans.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      Aucun plan API configuré
                    </TableCell>
                  </TableRow>
                )}
                {api.apiPlans.map((plan, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{fmt(plan.subscribers)}</TableCell>
                    <TableCell>{fmt(plan.calls)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

function ReferralTab({ stats }: { stats: ComprehensiveStats }) {
  const { referral } = stats

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Link2}
          label="Parrainages totaux"
          value={fmt(referral.totalReferrals)}
          sub="Toutes les invitations"
          color="emerald"
        />
        <StatCard
          icon={CheckCircle2}
          label="Parrainages complétés"
          value={fmt(referral.completedReferrals)}
          sub="Inscriptions confirmées"
          color="emerald"
        />
        <StatCard
          icon={Gift}
          label="Parrainages récompensés"
          value={fmt(referral.rewardedReferrals)}
          sub="Récompenses distribuées"
          color="amber"
        />
        <StatCard
          icon={Clock}
          label="Parrainages en attente"
          value={fmt(referral.pendingReferrals)}
          sub="En cours de validation"
          color="sky"
        />
      </div>

      <Card className="border border-emerald-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Link2 className="w-5 h-5 text-emerald-600" />
            Programme de parrainage
          </CardTitle>
          <CardDescription>Performance du programme de parrainage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">
                Taux de conversion
              </p>
              <p className="text-2xl font-bold text-emerald-700">
                {referral.totalReferrals > 0
                  ? `${((referral.completedReferrals / referral.totalReferrals) * 100).toFixed(1)}%`
                  : '—'}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
              <p className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-1">
                Taux de récompense
              </p>
              <p className="text-2xl font-bold text-amber-700">
                {referral.completedReferrals > 0
                  ? `${((referral.rewardedReferrals / referral.completedReferrals) * 100).toFixed(1)}%`
                  : '—'}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                En attente
              </p>
              <p className="text-2xl font-bold text-gray-700">
                {referral.pendingReferrals}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CampusTab({ stats }: { stats: ComprehensiveStats }) {
  const { campus } = stats

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 max-w-2xl">
        <StatCard
          icon={GraduationCap}
          label="Demandes campus totales"
          value={fmt(campus.totalTickets)}
          sub="Candidatures universités"
          color="emerald"
        />
        <StatCard
          icon={TicketCheck}
          label="Demandes ouvertes"
          value={fmt(campus.openTickets)}
          sub="En attente de traitement"
          color="amber"
        />
      </div>

      <Card className="border border-emerald-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            HireNova IA CAMPUS SaaS
          </CardTitle>
          <CardDescription>
            Partenariats universitaires et demandes d'accès campus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Taux de résolution</p>
                <p className="text-xs text-emerald-600/70 mt-1">
                  Demandes traitées sur le total
                </p>
              </div>
              <span className="text-2xl font-bold text-emerald-700">
                {campus.totalTickets > 0
                  ? `${(((campus.totalTickets - campus.openTickets) / campus.totalTickets) * 100).toFixed(1)}%`
                  : '—'}
              </span>
            </div>
            <Progress
              value={
                campus.totalTickets > 0
                  ? ((campus.totalTickets - campus.openTickets) / campus.totalTickets) * 100
                  : 0
              }
              className="h-2.5 mt-3 [&>div]:bg-emerald-500"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SupportTab({ stats }: { stats: ComprehensiveStats }) {
  const { support } = stats

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={MessageSquare}
          label="Tickets ouverts"
          value={fmt(support.openTickets)}
          sub="En attente de réponse"
          color="amber"
        />
        <StatCard
          icon={CheckCircle2}
          label="Tickets résolus"
          value={fmt(support.resolvedTickets)}
          sub="Support terminé"
          color="emerald"
        />
        <StatCard
          icon={HeadphonesIcon}
          label="Tickets totaux"
          value={fmt(support.totalTickets)}
          sub="Toutes les demandes"
          color="sky"
        />
      </div>

      <Card className="border border-emerald-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <HeadphonesIcon className="w-5 h-5 text-emerald-600" />
            Performance du support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Taux de résolution</p>
                <p className="text-xs text-emerald-600/70 mt-1">
                  Tickets résolus sur le total
                </p>
              </div>
              <span className="text-2xl font-bold text-emerald-700">
                {support.totalTickets > 0
                  ? `${((support.resolvedTickets / support.totalTickets) * 100).toFixed(1)}%`
                  : '—'}
              </span>
            </div>
            <Progress
              value={
                support.totalTickets > 0
                  ? (support.resolvedTickets / support.totalTickets) * 100
                  : 0
              }
              className="h-2.5 mt-3 [&>div]:bg-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
              <p className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-1">
                En attente
              </p>
              <p className="text-xl font-bold text-amber-700">{fmt(support.openTickets)}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">
                Taux d'ouverts
              </p>
              <p className="text-xl font-bold text-emerald-700">
                {support.totalTickets > 0
                  ? `${((support.openTickets / support.totalTickets) * 100).toFixed(1)}%`
                  : '—'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SecurityTab({ stats }: { stats: ComprehensiveStats }) {
  const { security } = stats

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={AlertTriangle}
          label="Alertes critiques"
          value={fmt(security.critical)}
          sub="Nécessitent une action immédiate"
          color="rose"
        />
        <StatCard
          icon={Shield}
          label="Alertes élevées"
          value={fmt(security.high)}
          sub="À surveiller"
          color="amber"
        />
        <StatCard
          icon={Shield}
          label="Total alertes"
          value={fmt(security.total)}
          sub="Tous niveaux confondus"
          color="sky"
        />
      </div>

      <Card className="border border-emerald-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            Alertes de sécurité récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-96">
            {security.recentAlerts.length === 0 && (
              <div className="flex flex-col items-center py-12 gap-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                <p className="text-sm text-muted-foreground">
                  Aucune alerte de sécurité — tout est normal
                </p>
              </div>
            )}
            <div className="space-y-3">
              {security.recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-lg border p-3 ${severityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase ${severityColor(alert.severity)}`}
                        >
                          {alert.severity}
                        </Badge>
                        <span className="text-xs font-medium">{alert.type}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.method} {alert.path} · IP: {alert.ip}
                        {alert.email && ` · ${alert.email}`}
                      </p>
                    </div>
                    <span className="text-[11px] whitespace-nowrap">
                      {fmtDate(alert.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminDashboardFull() {
  const { setStep } = useCVStore()
  const [stats, setStats] = useState<ComprehensiveStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [currentTime, setCurrentTime] = useState(new Date())

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/admin/comprehensive-stats')
      if (!res.ok) {
        throw new Error(`Erreur serveur (${res.status})`)
      }
      const data: ComprehensiveStats = await res.json()
      setStats(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de charger les données du dashboard.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats()
    }, 60_000)
    return () => clearInterval(interval)
  }, [fetchStats])

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      {/* ─── Sticky Header ─── */}
      <header className="sticky top-0 z-50 bg-white border-b border-emerald-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep('landing')}
                className="gap-2 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Retour à l'accueil</span>
              </Button>
              <div className="h-6 w-px bg-emerald-200" />
              <div>
                <h1 className="text-lg font-bold text-emerald-800 leading-tight">
                  Dashboard Admin
                </h1>
                <p className="text-xs text-muted-foreground leading-tight">
                  HireNova — E-Society 2050
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground hidden md:inline">
                {currentTime.toLocaleDateString('fr-FR', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchStats}
                disabled={loading}
                className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualiser</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-h-[calc(100vh-80px)] overflow-y-auto pr-1">
          {error && !stats ? (
            <ErrorState
              message={error}
              onRetry={fetchStats}
            />
          ) : loading && !stats ? (
            <div className="space-y-6">
              <LoadingGrid count={8} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border">
                    <CardHeader>
                      <Skeleton className="h-4 w-40" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : stats ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-transparent p-0 mb-6 border-b border-emerald-100 rounded-none">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 data-[state=active]:shadow-none rounded-b-none border-b-2 border-transparent data-[state=active]:border-emerald-600 text-sm"
                >
                  Vue d'ensemble
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 data-[state=active]:shadow-none rounded-b-none border-b-2 border-transparent data-[state=active]:border-emerald-600 text-sm"
                >
                  Utilisateurs
                </TabsTrigger>
                <TabsTrigger
                  value="finances"
                  className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 data-[state=active]:shadow-none rounded-b-none border-b-2 border-transparent data-[state=active]:border-emerald-600 text-sm"
                >
                  Finances
                </TabsTrigger>
                <TabsTrigger
                  value="jobs"
                  className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 data-[state=active]:shadow-none rounded-b-none border-b-2 border-transparent data-[state=active]:border-emerald-600 text-sm"
                >
                  Jobs & Global
                </TabsTrigger>
                <TabsTrigger
                  value="mobility"
                  className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 data-[state=active]:shadow-none rounded-b-none border-b-2 border-transparent data-[state=active]:border-emerald-600 text-sm"
                >
                  Mobilité
                </TabsTrigger>
                <TabsTrigger
                  value="api"
                  className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 data-[state=active]:shadow-none rounded-b-none border-b-2 border-transparent data-[state=active]:border-emerald-600 text-sm"
                >
                  API
                </TabsTrigger>
                <TabsTrigger
                  value="referral"
                  className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 data-[state=active]:shadow-none rounded-b-none border-b-2 border-transparent data-[state=active]:border-emerald-600 text-sm"
                >
                  Parrainage
                </TabsTrigger>
                <TabsTrigger
                  value="campus"
                  className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 data-[state=active]:shadow-none rounded-b-none border-b-2 border-transparent data-[state=active]:border-emerald-600 text-sm"
                >
                  Campus
                </TabsTrigger>
                <TabsTrigger
                  value="support"
                  className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 data-[state=active]:shadow-none rounded-b-none border-b-2 border-transparent data-[state=active]:border-emerald-600 text-sm"
                >
                  Support
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 data-[state=active]:shadow-none rounded-b-none border-b-2 border-transparent data-[state=active]:border-emerald-600 text-sm"
                >
                  Sécurité
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <OverviewTab stats={stats} />
              </TabsContent>
              <TabsContent value="users">
                <UsersTab stats={stats} />
              </TabsContent>
              <TabsContent value="finances">
                <FinancesTab stats={stats} />
              </TabsContent>
              <TabsContent value="jobs">
                <JobsTab stats={stats} />
              </TabsContent>
              <TabsContent value="mobility">
                <MobilityTab stats={stats} />
              </TabsContent>
              <TabsContent value="api">
                <ApiTab stats={stats} />
              </TabsContent>
              <TabsContent value="referral">
                <ReferralTab stats={stats} />
              </TabsContent>
              <TabsContent value="campus">
                <CampusTab stats={stats} />
              </TabsContent>
              <TabsContent value="support">
                <SupportTab stats={stats} />
              </TabsContent>
              <TabsContent value="security">
                <SecurityTab stats={stats} />
              </TabsContent>
            </Tabs>
          ) : null}

          {/* Data timestamp */}
          {stats && (
            <div className="mt-8 pb-4 text-center">
              <p className="text-xs text-muted-foreground">
                Dernière mise à jour : {fmtDate(stats.timestamp)}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
