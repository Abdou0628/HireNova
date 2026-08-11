'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  CreditCard,
  Lock,
  Eye,
  Activity,
  Users,
  FileText,
  Brain,
  Target,
  BarChart3,
  Star,
  Building2,
  Gift,
  UserPlus,
  Link2,
  Map,
  ScanSearch,
  FileSignature,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Heart,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────────

export interface GrowthDashboardData {
  timestamp: string
  revenue: {
    totalEur: number
    totalByCurrency: { currency: string; amountEur: number; count: number }[]
    totalByProvider: { provider: string; amountEur: number; count: number }[]
    paymentFunnel: { status: string; count: number }[]
    succeededCount: number
    failedCount: number
    refundRate: number
    thisMonthEur: number
    lastMonthEur: number
    momGrowthPct: number
  }
  subscriptions: {
    byPlan: { plan: string; count: number }[]
    paidCount: number
    freeCount: number
    conversionRate: number
    mfaAdoption: number
    activeWithExpiry: number
    inGracePeriod: number
    expiredThisMonth: number
  }
  security: {
    loginSuccess: number
    loginFailure: number
    loginSuccessRate: number
    bruteForceDetected: number
    accountLockouts: number
    currentlyLocked: number
    idorAttempts: number
    rateLimitEvents: number
    suspiciousRequests: number
    paymentFailures: number
    encryptionErrors: number
    totalAuditEvents: number
  }
  engagement: {
    cvsCreated: number
    clsCreated: number
    applicationsSubmitted: number
    totalApplications: number
    interviewPrepSessions: number
    linkedInAnalyses: number
    careerRoadmaps: number
    moduleUsageByType: { module: string; count: number }[]
  }
  pricing: {
    avgRevenuePerPaidUser: number
    aiCostEur: number
    aiCostAsPctOfRevenue: number
    aiGrossMarginPct: number
    aiCostByModule: { module: string; costEur: number; actions: number }[]
    referralStats: { pending: number; completed: number; rewarded: number }
    enterpriseInquiries: { total: number; thisMonth: number }
    satisfactionAvg: number
    satisfactionCount: number
  }
  crossStrategy: {
    revenueAtRisk: number
    securityHealthScore: number
    growthEfficiency: number
    aiGrossMarginPct: number
    topConversionModule: string
    mfaByPlan: { plan: string; total: number; mfaEnabled: number; pct: number }[]
  }
}

// ─── Utility Functions ──────────────────────────────────────────────────────────

function fmtEur(n: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)
}
function fmtNum(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n)
}
function fmtPct(n: number, decimals = 1): string {
  return n.toFixed(decimals).replace('.', ',') + ' %'
}
function humanizePlan(plan: string): string {
  const map: Record<string, string> = {
    free: 'Gratuit',
    starter: 'Start',
    pro: 'Pro',
    career_plus: 'Carrière+',
    employer: 'Employeur',
    enterprise: 'Entreprise',
    annual: 'Annuel',
    api: 'API',
  }
  return map[plan] ?? plan
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

/** Section heading with emerald left border */
function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex items-center gap-3 border-l-4 border-emerald-500 pl-3">
      <span className="text-emerald-600">{icon}</span>
      <div>
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground/70">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

/** Reusable KPI card */
function KpiCard({
  icon,
  iconColor,
  label,
  value,
  subValue,
  subColor,
}: {
  icon: React.ReactNode
  iconColor?: string
  label: string
  value: React.ReactNode
  subValue?: React.ReactNode
  subColor?: string
}) {
  return (
    <Card className="bg-white">
      <CardContent className="flex items-start gap-3 p-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 ${iconColor ?? 'text-emerald-600'}`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-bold leading-tight">{value}</p>
          {subValue && (
            <p className={`mt-0.5 text-xs ${subColor ?? 'text-muted-foreground'}`}>
              {subValue}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/** Color for payment funnel statuses */
function funnelStatusColor(status: string): string {
  const s = status.toLowerCase()
  if (s === 'succeeded' || s === 'captured') return 'bg-emerald-500'
  if (s === 'failed' || s === 'error') return 'bg-red-500'
  if (s === 'refunded' || s === 'cancelled') return 'bg-amber-500'
  if (s === 'authorized' || s === 'authorized_3ds') return 'bg-emerald-400'
  return 'bg-emerald-300'
}

function funnelStatusLabel(status: string): string {
  const map: Record<string, string> = {
    created: 'Créé',
    pending: 'En attente',
    authorized: 'Autorisé',
    authorized_3ds: 'Autorisé (3DS)',
    captured: 'Capturé',
    succeeded: 'Réussi',
    failed: 'Échoué',
    refunded: 'Remboursé',
    cancelled: 'Annulé',
  }
  return map[status.toLowerCase()] ?? status
}

/** Module icon mapping */
function moduleIcon(moduleKey: string) {
  const m = moduleKey.toUpperCase()
  if (m.includes('CV') || m === 'CV_CREATED') return <FileText className="h-5 w-5" />
  if (m.includes('CL') || m === 'CL_CREATED' || m.includes('LETTER'))
    return <FileSignature className="h-5 w-5" />
  if (m.includes('ATS') || m.includes('SCAN')) return <ScanSearch className="h-5 w-5" />
  if (m.includes('INTERVIEW') || m.includes('SESSION'))
    return <MessageSquare className="h-5 w-5" />
  if (m.includes('LINKEDIN') || m.includes('LINKED'))
    return <Link2 className="h-5 w-5" />
  if (m.includes('ROADMAP') || m.includes('CAREER') || m.includes('MAP'))
    return <Map className="h-5 w-5" />
  return <BarChart3 className="h-5 w-5" />
}

function humanizeModule(key: string): string {
  const map: Record<string, string> = {
    CV_CREATED: 'CV Créés',
    CL_CREATED: 'Lettres Créées',
    ATS_ANALYZED: 'Analyses ATS',
    INTERVIEW_SESSION_STARTED: 'Simulations Entretien',
    LINKEDIN_ANALYZED: 'Analyses LinkedIn',
    CAREER_ROADMAP_GENERATED: 'Feuilles de Route',
  }
  return map[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Security health score color */
function securityScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600'
  if (score >= 50) return 'text-amber-500'
  return 'text-red-500'
}

function securityScoreRing(score: number): string {
  if (score >= 80) return 'stroke-emerald-500'
  if (score >= 50) return 'stroke-amber-500'
  return 'stroke-red-500'
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function GrowthTab({ data }: { data: GrowthDashboardData }) {
  const funnelMax = Math.max(...data.revenue.paymentFunnel.map((f) => f.count), 1)
  const totalSubs = data.subscriptions.paidCount + data.subscriptions.freeCount

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 1. 🎯 SCORE CROISÉ — Cross-Strategy KPIs                               */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section>
        <SectionHeading
          icon={<Target className="h-4 w-4" />}
          title="Score Croisé"
          subtitle="Indicateurs transversaux des 3 stratégies"
        />
        <div className="mt-4">
          <Card className="bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {/* Revenu Total */}
                <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4 text-center">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Revenu Total
                  </span>
                  <span className="text-2xl font-bold text-emerald-600 md:text-3xl">
                    {fmtEur(data.revenue.totalEur)}
                  </span>
                </div>

                {/* Score Sécurité */}
                <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4 text-center">
                  <svg
                    viewBox="0 0 36 36"
                    className="h-10 w-10"
                  >
                    <path
                      className="text-muted-foreground/20"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className={securityScoreRing(data.crossStrategy.securityHealthScore)}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${data.crossStrategy.securityHealthScore}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Score Sécurité
                  </span>
                  <span className={`text-2xl font-bold md:text-3xl ${securityScoreColor(data.crossStrategy.securityHealthScore)}`}>
                    {data.crossStrategy.securityHealthScore}
                    <span className="text-sm font-normal text-muted-foreground">/100</span>
                  </span>
                </div>

                {/* Efficacité Croissance */}
                <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4 text-center">
                  <Zap className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Efficacité Croissance
                  </span>
                  <span className="text-2xl font-bold md:text-3xl">
                    {fmtPct(data.crossStrategy.growthEfficiency)}
                  </span>
                </div>

                {/* Marge Brute IA */}
                <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4 text-center">
                  <Brain className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Marge Brute IA
                  </span>
                  <span className="text-2xl font-bold md:text-3xl">
                    {fmtPct(data.crossStrategy.aiGrossMarginPct)}
                  </span>
                </div>

                {/* Revenu à Risque */}
                <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4 text-center col-span-2 sm:col-span-1">
                  {data.crossStrategy.revenueAtRisk > 0 ? (
                    <>
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        Revenu à Risque
                      </span>
                      <span className="text-2xl font-bold text-amber-500 md:text-3xl">
                        {fmtEur(data.crossStrategy.revenueAtRisk)}
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        Revenu à Risque
                      </span>
                      <span className="text-2xl font-bold text-emerald-600 md:text-3xl">
                        {fmtEur(0)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 2. 💰 REVENU & PAIEMENT                                                */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section>
        <SectionHeading
          icon={<DollarSign className="h-4 w-4" />}
          title="Revenu & Paiement"
          subtitle="Analyse des revenus et flux de paiement"
        />
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Card A: Résumé Revenu */}
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Résumé Revenu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Revenu</p>
                  <p className="text-xl font-bold">{fmtEur(data.revenue.totalEur)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ARPU</p>
                  <p className="text-xl font-bold">{fmtEur(data.pricing.avgRevenuePerPaidUser)}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/40 p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Ce Mois</p>
                  <p className="text-sm font-semibold">{fmtEur(data.revenue.thisMonthEur)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Mois Dernier</p>
                  <p className="text-sm font-semibold">{fmtEur(data.revenue.lastMonthEur)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Croissance MoM</p>
                  <div className="flex items-center gap-1">
                    {data.revenue.momGrowthPct >= 0 ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-semibold ${
                        data.revenue.momGrowthPct >= 0 ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {fmtPct(data.revenue.momGrowthPct)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-xs text-muted-foreground">Taux de Remboursement</span>
                <Badge
                  variant={data.revenue.refundRate > 5 ? 'destructive' : 'secondary'}
                  className={
                    data.revenue.refundRate <= 5
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                      : ''
                  }
                >
                  {fmtPct(data.revenue.refundRate)}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Transactions Réussies</p>
                  <p className="text-sm font-semibold text-emerald-600">
                    {fmtNum(data.revenue.succeededCount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Transactions Échouées</p>
                  <p className="text-sm font-semibold text-red-500">
                    {fmtNum(data.revenue.failedCount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card B: Répartition par Devise */}
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Répartition par Devise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Devise</TableHead>
                      <TableHead className="text-right">Montant (€)</TableHead>
                      <TableHead className="text-right">Transactions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.revenue.totalByCurrency.map((row) => (
                      <TableRow key={row.currency}>
                        <TableCell className="font-medium">{row.currency}</TableCell>
                        <TableCell className="text-right">
                          {fmtEur(row.amountEur)}
                        </TableCell>
                        <TableCell className="text-right">{fmtNum(row.count)}</TableCell>
                      </TableRow>
                    ))}
                    {data.revenue.totalByCurrency.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          Aucune donnée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Card C: Répartition par Provider */}
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Répartition par Provider
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead className="text-right">Montant (€)</TableHead>
                      <TableHead className="text-right">Transactions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.revenue.totalByProvider.map((row) => (
                      <TableRow key={row.provider}>
                        <TableCell className="font-medium">{row.provider}</TableCell>
                        <TableCell className="text-right">
                          {fmtEur(row.amountEur)}
                        </TableCell>
                        <TableCell className="text-right">{fmtNum(row.count)}</TableCell>
                      </TableRow>
                    ))}
                    {data.revenue.totalByProvider.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          Aucune donnée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Card D: Entonnoir Paiement */}
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Entonnoir Paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-80">
                <div className="space-y-3">
                  {data.revenue.paymentFunnel.map((step) => (
                    <div key={step.status} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{funnelStatusLabel(step.status)}</span>
                        <span className="text-muted-foreground">{fmtNum(step.count)}</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${funnelStatusColor(step.status)}`}
                          style={{
                            width: `${Math.max((step.count / funnelMax) * 100, 1)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  {data.revenue.paymentFunnel.length === 0 && (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Aucune donnée
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 3. 🛡️ SANTÉ SÉCURITÉ                                                  */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section>
        <SectionHeading
          icon={<Shield className="h-4 w-4" />}
          title="Santé Sécurité"
          subtitle="Métriques HNSA et surveillance des menaces"
        />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Taux de connexion réussie */}
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-emerald-600" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Taux Connexion Réussie
                </span>
              </div>
              <p className="text-2xl font-bold">{fmtPct(data.security.loginSuccessRate)}</p>
              <Progress value={data.security.loginSuccessRate} className="mt-2 h-2" />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Réussies: {fmtNum(data.security.loginSuccess)}</span>
                <span>Échouées: {fmtNum(data.security.loginFailure)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tentatives brute force */}
          <Card className={`bg-white ${data.security.bruteForceDetected > 0 ? 'border-red-200' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`h-4 w-4 ${data.security.bruteForceDetected > 0 ? 'text-red-500' : 'text-emerald-600'}`} />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Tentatives Brute Force
                </span>
              </div>
              <p className={`text-2xl font-bold ${data.security.bruteForceDetected > 0 ? 'text-red-500' : ''}`}>
                {fmtNum(data.security.bruteForceDetected)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Verrouillages total: {fmtNum(data.security.accountLockouts)}
              </p>
            </CardContent>
          </Card>

          {/* Comptes verrouillés */}
          <Card className={`bg-white ${data.security.currentlyLocked > 0 ? 'border-red-200' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className={`h-4 w-4 ${data.security.currentlyLocked > 0 ? 'text-red-500' : 'text-emerald-600'}`} />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Comptes Verrouillés
                </span>
              </div>
              <p className={`text-2xl font-bold ${data.security.currentlyLocked > 0 ? 'text-red-500' : ''}`}>
                {fmtNum(data.security.currentlyLocked)}
              </p>
              {data.security.currentlyLocked > 0 && (
                <Badge variant="destructive" className="mt-1 text-xs">
                  Action requise
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Tentatives IDOR */}
          <Card className={`bg-white ${data.security.idorAttempts > 0 ? 'border-red-200' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className={`h-4 w-4 ${data.security.idorAttempts > 0 ? 'text-red-500' : 'text-emerald-600'}`} />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Tentatives IDOR
                </span>
              </div>
              <p className={`text-2xl font-bold ${data.security.idorAttempts > 0 ? 'text-red-500' : ''}`}>
                {fmtNum(data.security.idorAttempts)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Événements audit total: {fmtNum(data.security.totalAuditEvents)}
              </p>
            </CardContent>
          </Card>

          {/* Événements rate-limit */}
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-emerald-600" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Événements Rate-Limit
                </span>
              </div>
              <p className="text-2xl font-bold">{fmtNum(data.security.rateLimitEvents)}</p>
            </CardContent>
          </Card>

          {/* Requêtes suspectes */}
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-emerald-600" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Requêtes Suspectes
                </span>
              </div>
              <p className="text-2xl font-bold">{fmtNum(data.security.suspiciousRequests)}</p>
            </CardContent>
          </Card>

          {/* Échecs paiement */}
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-amber-500" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Échecs Paiement
                </span>
              </div>
              <p className="text-2xl font-bold text-amber-500">
                {fmtNum(data.security.paymentFailures)}
              </p>
            </CardContent>
          </Card>

          {/* Erreurs chiffrement */}
          <Card className={`bg-white ${data.security.encryptionErrors > 0 ? 'border-red-200' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className={`h-4 w-4 ${data.security.encryptionErrors > 0 ? 'text-red-500' : 'text-emerald-600'}`} />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Erreurs Chiffrement
                </span>
              </div>
              <p className={`text-2xl font-bold ${data.security.encryptionErrors > 0 ? 'text-red-500' : ''}`}>
                {fmtNum(data.security.encryptionErrors)}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 4. 📈 CONVERSION & ABONNEMENTS                                        */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section>
        <SectionHeading
          icon={<Users className="h-4 w-4" />}
          title="Conversion & Abonnements"
          subtitle="Taux de conversion et distribution des plans"
        />
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Card A: Taux de Conversion */}
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Taux de Conversion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-600">
                  {fmtPct(data.subscriptions.conversionRate)}
                </p>
                <Progress value={data.subscriptions.conversionRate} className="mt-3 h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/40 p-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Utilisateurs Payants</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {fmtNum(data.subscriptions.paidCount)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Utilisateurs Gratuits</p>
                  <p className="text-lg font-bold">{fmtNum(data.subscriptions.freeCount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card B: Distribution des Plans */}
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Distribution des Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-80">
                <div className="space-y-3">
                  {data.subscriptions.byPlan.map((plan) => {
                    const pct =
                      totalSubs > 0 ? (plan.count / totalSubs) * 100 : 0
                    return (
                      <div key={plan.plan} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">{humanizePlan(plan.plan)}</span>
                          <span className="text-muted-foreground">
                            {fmtNum(plan.count)} ({fmtPct(pct, 0)})
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all"
                            style={{ width: `${Math.max(pct, 1)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                  {data.subscriptions.byPlan.length === 0 && (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Aucun plan
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Card C: Adoption MFA */}
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Adoption MFA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-600">
                  {fmtPct(data.subscriptions.mfaAdoption)}
                </p>
                <Progress value={data.subscriptions.mfaAdoption} className="mt-3 h-3" />
              </div>
              {/* MFA by plan table */}
              {data.crossStrategy.mfaByPlan.length > 0 && (
                <ScrollArea className="max-h-48">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plan</TableHead>
                        <TableHead className="text-right">MFA Activé</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">%</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.crossStrategy.mfaByPlan.map((row) => (
                        <TableRow key={row.plan}>
                          <TableCell className="font-medium">
                            {humanizePlan(row.plan)}
                          </TableCell>
                          <TableCell className="text-right">
                            {fmtNum(row.mfaEnabled)}
                          </TableCell>
                          <TableCell className="text-right">
                            {fmtNum(row.total)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={
                                row.pct >= 80
                                  ? 'secondary'
                                  : 'destructive'
                              }
                              className={
                                row.pct >= 80
                                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                  : ''
                              }
                            >
                              {fmtPct(row.pct)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Card D: Cycle de Vie Abonnements */}
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Cycle de Vie Abonnements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-emerald-50 p-3 text-center">
                  <Users className="mx-auto h-5 w-5 text-emerald-600" />
                  <p className="mt-1 text-xs text-muted-foreground">Actifs</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {fmtNum(data.subscriptions.activeWithExpiry)}
                  </p>
                </div>
                <div className="rounded-lg border bg-amber-50 p-3 text-center">
                  <Activity className="mx-auto h-5 w-5 text-amber-500" />
                  <p className="mt-1 text-xs text-muted-foreground">En Période de Grâce</p>
                  <p className="text-xl font-bold text-amber-500">
                    {fmtNum(data.subscriptions.inGracePeriod)}
                  </p>
                </div>
                <div className="rounded-lg border bg-red-50 p-3 text-center">
                  <AlertTriangle className="mx-auto h-5 w-5 text-red-500" />
                  <p className="mt-1 text-xs text-muted-foreground">Expirés ce Mois</p>
                  <p className="text-xl font-bold text-red-500">
                    {fmtNum(data.subscriptions.expiredThisMonth)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 5. 🔥 ENGAGEMENT MODULES                                               */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section>
        <SectionHeading
          icon={<BarChart3 className="h-4 w-4" />}
          title="Engagement Modules"
          subtitle="Utilisation des fonctionnalités par les utilisateurs"
        />
        <div className="mt-4">
          <Card className="bg-white">
            <CardContent className="p-4 md:p-6">
              {/* Module tiles grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {data.engagement.moduleUsageByType.map((mod) => (
                  <div
                    key={mod.module}
                    className="flex flex-col items-center gap-2 rounded-lg border bg-muted/30 p-4 text-center transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      {moduleIcon(mod.module)}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground leading-tight">
                      {humanizeModule(mod.module)}
                    </span>
                    <span className="text-xl font-bold">{fmtNum(mod.count)}</span>
                  </div>
                ))}
                {data.engagement.moduleUsageByType.length === 0 && (
                  <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                    Aucune donnée d&apos;engagement
                  </p>
                )}
              </div>

              {/* Summary stats */}
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-muted/30 p-4 sm:grid-cols-4 lg:grid-cols-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">CVs Créés</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {fmtNum(data.engagement.cvsCreated)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Lettres Créées</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {fmtNum(data.engagement.clsCreated)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Candidatures (30j)</p>
                  <p className="text-lg font-bold">{fmtNum(data.engagement.applicationsSubmitted)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Total Candidatures</p>
                  <p className="text-lg font-bold">{fmtNum(data.engagement.totalApplications)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 6. 🤖 INTELLIGENCE ÉCONOMIQUE                                           */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <section>
        <SectionHeading
          icon={<Brain className="h-4 w-4" />}
          title="Intelligence Économique"
          subtitle="Coûts IA, parrainage et satisfaction client"
        />
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Card A: Coût IA */}
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Coût IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Coût Total</p>
                  <p className="text-lg font-bold">{fmtEur(data.pricing.aiCostEur)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">% du Revenu</p>
                  <p className="text-lg font-bold">
                    {fmtPct(data.pricing.aiCostAsPctOfRevenue)}
                  </p>
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Marge Brute IA
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      data.pricing.aiGrossMarginPct >= 0
                        ? 'text-emerald-600'
                        : 'text-red-500'
                    }`}
                  >
                    {fmtPct(data.pricing.aiGrossMarginPct)}
                  </span>
                </div>
              </div>
              {/* AI Cost by Module table */}
              {data.pricing.aiCostByModule.length > 0 && (
                <ScrollArea className="max-h-48">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Module</TableHead>
                        <TableHead className="text-right">Coût (€)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.pricing.aiCostByModule.map((row) => (
                        <TableRow key={row.module}>
                          <TableCell className="font-medium">
                            {humanizeModule(row.module)}
                          </TableCell>
                          <TableCell className="text-right">
                            {fmtEur(row.costEur)}
                          </TableCell>
                          <TableCell className="text-right">
                            {fmtNum(row.actions)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Card B: Parrainage */}
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Parrainage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Pending */}
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">En Attente</span>
                    </div>
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                      {fmtNum(data.pricing.referralStats.pending)}
                    </Badge>
                  </div>
                </div>
                {/* Completed */}
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium">Complétés</span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      {fmtNum(data.pricing.referralStats.completed)}
                    </Badge>
                  </div>
                </div>
                {/* Rewarded */}
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm font-medium">Récompensés</span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      {fmtNum(data.pricing.referralStats.rewarded)}
                    </Badge>
                  </div>
                </div>

                {/* Conversion funnel */}
                <div className="rounded-lg bg-muted/40 p-3">
                  <p className="mb-2 text-xs text-muted-foreground">Taux de conversion</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-emerald-600">
                      {data.pricing.referralStats.pending > 0
                        ? fmtPct(
                            (data.pricing.referralStats.completed /
                              data.pricing.referralStats.pending) *
                              100
                          )
                        : '0,0 %'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      (complétés / en attente)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card C: Entreprise & Satisfaction */}
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Entreprise & Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Enterprise Inquiries */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium">Demandes Entreprise</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-xl font-bold">{fmtNum(data.pricing.enterpriseInquiries.total)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ce Mois</p>
                    <p className="text-xl font-bold text-emerald-600">
                      {fmtNum(data.pricing.enterpriseInquiries.thisMonth)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Satisfaction */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Satisfaction Client</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold">
                    {data.pricing.satisfactionAvg.toFixed(1)}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.round(data.pricing.satisfactionAvg)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {fmtNum(data.pricing.satisfactionCount)} avis
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
