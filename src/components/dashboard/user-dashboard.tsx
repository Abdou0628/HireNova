'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import {
  ArrowLeft, FileText, Mail, Briefcase, Globe, Plane, CreditCard, Gift,
  Users, BarChart3, TrendingUp, Clock, Star, Award, Download,
  ChevronRight, Edit3, Save, X, Loader2, Shield, Crown,
  GraduationCap, Building2, MapPin, Calendar, Sparkles, CircleCheck,
  AlertCircle, FileCheck, Receipt, FileSignature, PieChart
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { useCVStore } from '@/store/cv-store'
import { t } from '@/lib/i18n'

// ─── Types ──────────────────────────────────────────────

interface DashboardUser {
  id: string
  email: string
  name: string | null
  image: string | null
  plan: string
  role: string
  companyName: string | null
  industry: string | null
  companyWebsite: string | null
  cvCountThisMonth: number
  clCountThisMonth: number
  referralCode: string | null
  createdAt: string
  updatedAt: string
}

interface DashboardStats {
  totalResumes: number
  totalCoverLetters: number
  totalApplications: number
  pendingApplications: number
  averageMatch: number | null
  totalJobsPosted: number
  totalApplicationsReceived: number
  totalDocuments: number
  totalSpent: number
  completedReferrals: number
  totalMobilityProfiles: number
  joinDays: number
}

interface ResumeItem {
  id: string
  fullName: string
  targetJob: string
  industry: string | null
  language: string
  templateStyle: string
  createdAt: string
}

interface CoverLetterItem {
  id: string
  fullName: string
  companyName: string
  jobTitle: string
  language: string
  tone: string
  createdAt: string
}

interface ApplicationItem {
  id: string
  status: string
  matchScore: number | null
  createdAt: string
  job: { title: string; company: string; location: string; country?: string } | null
}

interface DocumentItem {
  id: string
  type: string
  number: string
  subject: string
  currency: string
  total: number
  status: string
  issueDate: string
  paidAt: string | null
  createdAt: string
}

interface ReferralItem {
  id: string
  referralCode: string
  referredEmail: string
  status: string
  rewardType: string
  createdAt: string
  completedAt: string | null
}

interface MobilityItem {
  id: string
  originCountry: string
  targetCountry: string
  targetRole: string
  matchScore: number | null
  status: string
  createdAt: string
}

interface DashboardData {
  user: DashboardUser
  stats: DashboardStats
  resumes: ResumeItem[]
  coverLetters: CoverLetterItem[]
  localApplications: ApplicationItem[]
  globalApplications: ApplicationItem[]
  localJobsPosted: unknown[]
  globalJobsPosted: unknown[]
  documents: DocumentItem[]
  referralStats: ReferralItem[]
  mobilityProfiles: MobilityItem[]
  satisfactionRatings: unknown[]
  emailLogs: unknown[]
}

// ─── Helpers ────────────────────────────────────────────

const planConfig: Record<string, { label: string; color: string; icon: typeof Crown }> = {
  free: { label: 'Gratuit', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Gift },
  starter: { label: 'Starter', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Sparkles },
  pro: { label: 'Pro', color: 'bg-emerald-600 text-white border-emerald-700', icon: Crown },
  career_plus: { label: 'Career+', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Sparkles },
  employer: { label: 'Employeur', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Building2 },
  enterprise: { label: 'Enterprise', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Building2 },
  annual: { label: 'Annuel', color: 'bg-teal-100 text-teal-700 border-teal-200', icon: Crown },
  api: { label: 'API', color: 'bg-sky-100 text-sky-700 border-sky-200', icon: FileText },
}

const docTypeMeta: Record<string, { label: string; icon: typeof FileText; color: string }> = {
  invoice: { label: 'Facture', icon: FileSignature, color: 'text-emerald-600 bg-emerald-50' },
  quote: { label: 'Devis', icon: FileText, color: 'text-sky-600 bg-sky-50' },
  agreement: { label: 'Contrat', icon: FileCheck, color: 'text-purple-600 bg-purple-50' },
  receipt: { label: 'Reçu', icon: Receipt, color: 'text-amber-600 bg-amber-50' },
  credit_note: { label: 'Avoir', icon: FileText, color: 'text-red-600 bg-red-50' },
  accounting_statement: { label: 'Bilan', icon: PieChart, color: 'text-slate-600 bg-slate-50' },
}

const statusMeta: Record<string, { label: string; color: string }> = {
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-600' },
  sent: { label: 'Envoyé', color: 'bg-sky-100 text-sky-700' },
  paid: { label: 'Payé', color: 'bg-emerald-100 text-emerald-700' },
  accepted: { label: 'Accepté', color: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Rejeté', color: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Annulé', color: 'bg-gray-200 text-gray-500' },
  expired: { label: 'Expiré', color: 'bg-amber-100 text-amber-700' },
  finalized: { label: 'Finalisé', color: 'bg-emerald-200 text-emerald-800' },
  pending: { label: 'En attente', color: 'bg-amber-100 text-amber-700' },
  viewed: { label: 'Vu', color: 'bg-sky-100 text-sky-600' },
  shortlisted: { label: 'Sélectionné', color: 'bg-emerald-100 text-emerald-700' },
  active: { label: 'Actif', color: 'bg-emerald-100 text-emerald-700' },
  closed: { label: 'Fermé', color: 'bg-gray-100 text-gray-600' },
  completed: { label: 'Terminé', color: 'bg-emerald-100 text-emerald-700' },
  processing: { label: 'Traitement', color: 'bg-sky-100 text-sky-700' },
  error: { label: 'Erreur', color: 'bg-red-100 text-red-700' },
}

const langFlags: Record<string, string> = { fr: '🇫🇷', en: '🇬🇧', ar: '🇲🇦', es: '🇪🇸' }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency || 'EUR' }).format(amount)
}

function StatCard({ icon: Icon, label, value, sub, color, onClick }: {
  icon: typeof FileText
  label: string
  value: string | number
  sub?: string
  color: string
  onClick?: () => void
}) {
  return (
    <Card className={`${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`} onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground font-medium truncate">{label}</p>
            <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color === 'text-emerald-600' ? 'bg-emerald-50' : color === 'text-amber-600' ? 'bg-amber-50' : color === 'text-purple-600' ? 'bg-purple-50' : color === 'text-sky-600' ? 'bg-sky-50' : color === 'text-teal-600' ? 'bg-teal-50' : 'bg-gray-50'}`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ icon: Icon, message }: { icon: typeof FileText; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────

export default function UserDashboard() {
  const { data: session } = useSession()
  const { language, setStep } = useCVStore()
  const lang = language
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: '', companyName: '', industry: '', companyWebsite: '' })
  const [savingProfile, setSavingProfile] = useState(false)

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/user/dashboard')
      const json = await res.json()
      if (json.success) {
        setData(json.data)
        setProfileForm({
          name: json.data.user.name || '',
          companyName: json.data.user.companyName || '',
          industry: json.data.user.industry || '',
          companyWebsite: json.data.user.companyWebsite || '',
        })
      } else {
        setError(json.error?.message || 'Erreur de chargement')
      }
    } catch {
      setError('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true)
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Profil mis à jour avec succès')
        setEditingProfile(false)
        fetchDashboard()
      } else {
        toast.error(json.error?.message || 'Erreur de mise à jour')
      }
    } catch {
      toast.error('Erreur réseau')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleDownloadDoc = async (docId: string) => {
    try {
      const res = await fetch(`/api/documents/${docId}`)
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement('a')
      a.href = url
      a.download = `hirenova-document-${docId}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Erreur lors du téléchargement')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-sm text-muted-foreground">Chargement de votre espace...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-sm text-red-600">{error || 'Données indisponibles'}</p>
            <Button variant="outline" onClick={fetchDashboard}>Réessayer</Button>
          </div>
        </div>
      </div>
    )
  }

  const user = data.user
  const stats = data.stats
  const plan = planConfig[user.plan] || planConfig.free
  const PlanIcon = plan.icon
  const isEmployer = user.role === 'employer'
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email.slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setStep('landing')} className="gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Accueil</span>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-lg font-bold text-slate-800">Mon Espace</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchDashboard} className="gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Actualiser</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Profile Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-6 py-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-white/20" />
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold bg-emerald-800 ring-4 ring-white/30">
                  {user.image ? (
                    <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold">{user.name || 'Utilisateur'}</h2>
                  <Badge className={`${plan.color} border text-xs gap-1`}>
                    <PlanIcon className="w-3 h-3" />
                    {plan.label}
                  </Badge>
                  {isEmployer && (
                    <Badge className="bg-amber-400 text-amber-900 border-amber-500 text-xs gap-1">
                      <Building2 className="w-3 h-3" />
                      Employeur
                    </Badge>
                  )}
                </div>
                <p className="text-emerald-100 mt-1">{user.email}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-emerald-200">
                  {user.companyName && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {user.companyName}
                    </span>
                  )}
                  {user.industry && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {user.industry}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Membre depuis {stats.joinDays} jour{stats.joinDays > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => setEditingProfile(!editingProfile)}
              >
                {editingProfile ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4 mr-1.5" />}
                {editingProfile ? 'Annuler' : 'Modifier'}
              </Button>
            </div>
          </div>

          {/* Profile Edit Form */}
          <AnimatePresence>
            {editingProfile && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-4 border-t bg-slate-50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Nom complet</Label>
                      <Input
                        value={profileForm.name}
                        onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Votre nom"
                        className="h-9"
                      />
                    </div>
                    {isEmployer && (
                      <>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">Entreprise</Label>
                          <Input
                            value={profileForm.companyName}
                            onChange={e => setProfileForm(p => ({ ...p, companyName: e.target.value }))}
                            placeholder="Nom de l'entreprise"
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">Secteur d'activité</Label>
                          <Input
                            value={profileForm.industry}
                            onChange={e => setProfileForm(p => ({ ...p, industry: e.target.value }))}
                            placeholder="ex: Tech, Finance, Santé"
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">Site web</Label>
                          <Input
                            value={profileForm.companyWebsite}
                            onChange={e => setProfileForm(p => ({ ...p, companyWebsite: e.target.value }))}
                            placeholder="https://..."
                            className="h-9"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingProfile(false)}>Annuler</Button>
                    <Button size="sm" onClick={handleSaveProfile} disabled={savingProfile} className="gap-1.5">
                      {savingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <ScrollArea className="w-full">
            <TabsList className="bg-white border rounded-xl p-1 h-auto w-fit flex-wrap gap-1">
              <TabsTrigger value="overview" className="gap-1.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Vue d'ensemble</span>
                <span className="sm:hidden">Vue</span>
              </TabsTrigger>
              <TabsTrigger value="resumes" className="gap-1.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <FileText className="w-3.5 h-3.5" />
                CV
              </TabsTrigger>
              <TabsTrigger value="coverletters" className="gap-1.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Mail className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lettres</span>
                <span className="sm:hidden">LM</span>
              </TabsTrigger>
              <TabsTrigger value="applications" className="gap-1.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Briefcase className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Candidatures</span>
                <span className="sm:hidden">Cand.</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="gap-1.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <CreditCard className="w-3.5 h-3.5" />
                Docs
              </TabsTrigger>
              <TabsTrigger value="mobility" className="gap-1.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Plane className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobilité</span>
                <span className="sm:hidden">Mob.</span>
              </TabsTrigger>
              <TabsTrigger value="referrals" className="gap-1.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Gift className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Parrainage</span>
                <span className="sm:hidden">Par.</span>
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          {/* ─── Overview Tab ─── */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <StatCard icon={FileText} label="CV générés" value={stats.totalResumes} sub={`Ce mois: ${user.cvCountThisMonth}`} color="text-emerald-600" onClick={() => setActiveTab('resumes')} />
              <StatCard icon={Mail} label="Lettres de motivation" value={stats.totalCoverLetters} sub={`Ce mois: ${user.clCountThisMonth}`} color="text-sky-600" onClick={() => setActiveTab('coverletters')} />
              <StatCard icon={Briefcase} label="Candidatures" value={stats.totalApplications} sub={`${stats.pendingApplications} en attente`} color="text-amber-600" onClick={() => setActiveTab('applications')} />
              <StatCard icon={CreditCard} label="Documents" value={stats.totalDocuments} sub={stats.totalSpent > 0 ? `Dépensé: ${formatMoney(stats.totalSpent, 'EUR')}` : 'Aucun achat'} color="text-purple-600" onClick={() => setActiveTab('documents')} />
              <StatCard icon={Gift} label="Parrainages" value={data.referralStats.length} sub={`${stats.completedReferrals} complétés`} color="text-teal-600" onClick={() => setActiveTab('referrals')} />
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Actions rapides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button variant="outline" className="h-auto py-3 flex-col gap-1.5 rounded-xl hover:bg-emerald-50 hover:border-emerald-200" onClick={() => setStep('form')}>
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-medium">Créer un CV</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-3 flex-col gap-1.5 rounded-xl hover:bg-sky-50 hover:border-sky-200" onClick={() => setStep('clForm')}>
                    <Mail className="w-5 h-5 text-sky-600" />
                    <span className="text-xs font-medium">Lettre de motivation</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-3 flex-col gap-1.5 rounded-xl hover:bg-amber-50 hover:border-amber-200" onClick={() => setStep('jobMarket')}>
                    <Briefcase className="w-5 h-5 text-amber-600" />
                    <span className="text-xs font-medium">Trouver un emploi</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-3 flex-col gap-1.5 rounded-xl hover:bg-teal-50 hover:border-teal-200" onClick={() => setStep('globalMarket')}>
                    <Globe className="w-5 h-5 text-teal-600" />
                    <span className="text-xs font-medium">International</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {/* Mix of recent items */}
                  {[...data.resumes.slice(0, 2).map(r => ({
                    icon: <FileText className="w-4 h-4 text-emerald-600" />,
                    bg: 'bg-emerald-50',
                    text: `CV créé: ${r.targetJob}`,
                    sub: formatDate(r.createdAt),
                  })),
                  ...data.coverLetters.slice(0, 2).map(cl => ({
                    icon: <Mail className="w-4 h-4 text-sky-600" />,
                    bg: 'bg-sky-50',
                    text: `Lettre pour ${cl.jobTitle} chez ${cl.companyName}`,
                    sub: formatDate(cl.createdAt),
                  })),
                  ...data.localApplications.slice(0, 2).map(a => ({
                    icon: <Briefcase className="w-4 h-4 text-amber-600" />,
                    bg: 'bg-amber-50',
                    text: `Candidature: ${a.job?.title || 'Poste'} — ${statusMeta[a.status]?.label || a.status}`,
                    sub: formatDate(a.createdAt),
                  })),
                  ...data.globalApplications.slice(0, 1).map(a => ({
                    icon: <Globe className="w-4 h-4 text-teal-600" />,
                    bg: 'bg-teal-50',
                    text: `Candidature internationale: ${a.job?.title || 'Poste'}`,
                    sub: formatDate(a.createdAt),
                  })),
                  ...data.documents.slice(0, 2).map(d => ({
                    icon: <Receipt className="w-4 h-4 text-purple-600" />,
                    bg: 'bg-purple-50',
                    text: `${docTypeMeta[d.type]?.label || d.type} ${d.number} — ${formatMoney(d.total, d.currency)}`,
                    sub: formatDate(d.createdAt),
                  })),
                  ].length > 0 ? (
                    [...data.resumes.slice(0, 2).map(r => ({
                      icon: <FileText className="w-4 h-4 text-emerald-600" />,
                      bg: 'bg-emerald-50',
                      text: `CV créé: ${r.targetJob}`,
                      sub: formatDate(r.createdAt),
                    })),
                    ...data.coverLetters.slice(0, 2).map(cl => ({
                      icon: <Mail className="w-4 h-4 text-sky-600" />,
                      bg: 'bg-sky-50',
                      text: `Lettre pour ${cl.jobTitle} chez ${cl.companyName}`,
                      sub: formatDate(cl.createdAt),
                    })),
                    ...data.localApplications.slice(0, 2).map(a => ({
                      icon: <Briefcase className="w-4 h-4 text-amber-600" />,
                      bg: 'bg-amber-50',
                      text: `Candidature: ${a.job?.title || 'Poste'} — ${statusMeta[a.status]?.label || a.status}`,
                      sub: formatDate(a.createdAt),
                    })),
                    ...data.globalApplications.slice(0, 1).map(a => ({
                      icon: <Globe className="w-4 h-4 text-teal-600" />,
                      bg: 'bg-teal-50',
                      text: `Candidature internationale: ${a.job?.title || 'Poste'}`,
                      sub: formatDate(a.createdAt),
                    })),
                    ...data.documents.slice(0, 2).map(d => ({
                      icon: <Receipt className="w-4 h-4 text-purple-600" />,
                      bg: 'bg-purple-50',
                      text: `${docTypeMeta[d.type]?.label || d.type} ${d.number} — ${formatMoney(d.total, d.currency)}`,
                      sub: formatDate(d.createdAt),
                    })),
                    ].sort((a, b) => new Date(b.sub).getTime() - new Date(a.sub).getTime()).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.bg}`}>
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm truncate">{item.text}</p>
                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState icon={Clock} message="Aucune activité récente. Commencez par créer un CV !" />
                )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Resumes Tab ─── */}
          <TabsContent value="resumes" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {stats.totalResumes} CV{stats.totalResumes !== 1 ? 's' : ''} généré{stats.totalResumes !== 1 ? 's' : ''}
              </h3>
              <Button size="sm" onClick={() => setStep('form')} className="gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Créer un CV
              </Button>
            </div>
            {data.resumes.length === 0 ? (
              <EmptyState icon={FileText} message="Vous n'avez pas encore créé de CV." />
            ) : (
              <div className="space-y-2">
                {data.resumes.map(resume => (
                  <Card key={resume.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{resume.targetJob}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs">{langFlags[resume.language] || '📄'}</span>
                          <span className="text-xs text-muted-foreground">{resume.templateStyle}</span>
                          {resume.industry && <span className="text-xs text-muted-foreground">· {resume.industry}</span>}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">{formatDate(resume.createdAt)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ─── Cover Letters Tab ─── */}
          <TabsContent value="coverletters" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {stats.totalCoverLetters} lettre{stats.totalCoverLetters !== 1 ? 's' : ''} de motivation
              </h3>
              <Button size="sm" onClick={() => setStep('clForm')} className="gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Créer une lettre
              </Button>
            </div>
            {data.coverLetters.length === 0 ? (
              <EmptyState icon={Mail} message="Vous n'avez pas encore créé de lettre de motivation." />
            ) : (
              <div className="space-y-2">
                {data.coverLetters.map(cl => (
                  <Card key={cl.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-sky-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{cl.jobTitle}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{cl.companyName}</span>
                          <span className="text-xs">{langFlags[cl.language] || '📄'}</span>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{cl.tone}</Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground shrink-0">{formatDate(cl.createdAt)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ─── Applications Tab ─── */}
          <TabsContent value="applications" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {stats.totalApplications} candidature{stats.totalApplications !== 1 ? 's' : ''}
                {stats.averageMatch !== null && <span className="ml-2">· Score moyen: <span className="text-emerald-600 font-semibold">{stats.averageMatch}%</span></span>}
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setStep('jobMarket')} className="gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  Emplois locaux
                </Button>
                <Button variant="outline" size="sm" onClick={() => setStep('globalMarket')} className="gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  International
                </Button>
              </div>
            </div>

            {/* Local Applications */}
            {data.localApplications.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  Emplois locaux ({data.localApplications.length})
                </h4>
                <div className="space-y-2">
                  {data.localApplications.map(app => {
                    const st = statusMeta[app.status] || statusMeta.pending
                    return (
                      <Card key={app.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                            <Briefcase className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{app.job?.title || 'Poste'}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground">{app.job?.company}</span>
                              {app.job?.location && <span className="text-xs text-muted-foreground">· {app.job.location}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {app.matchScore != null && (
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Match</p>
                                <p className={`text-sm font-bold ${app.matchScore >= 70 ? 'text-emerald-600' : app.matchScore >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
                                  {app.matchScore}%
                                </p>
                              </div>
                            )}
                            <Badge className={`text-[10px] px-1.5 py-0 ${st.color}`}>{st.label}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground shrink-0 hidden sm:block">{formatDate(app.createdAt)}</p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Global Applications */}
            {data.globalApplications.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  International ({data.globalApplications.length})
                </h4>
                <div className="space-y-2">
                  {data.globalApplications.map(app => {
                    const st = statusMeta[app.status] || statusMeta.pending
                    return (
                      <Card key={app.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                            <Globe className="w-5 h-5 text-teal-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{app.job?.title || 'Poste'}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground">{app.job?.company}</span>
                              {app.job?.country && <span className="text-xs text-muted-foreground">· {app.job.country}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {app.matchScore != null && (
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Match</p>
                                <p className={`text-sm font-bold ${app.matchScore >= 70 ? 'text-emerald-600' : app.matchScore >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
                                  {app.matchScore}%
                                </p>
                              </div>
                            )}
                            <Badge className={`text-[10px] px-1.5 py-0 ${st.color}`}>{st.label}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground shrink-0 hidden sm:block">{formatDate(app.createdAt)}</p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {data.localApplications.length === 0 && data.globalApplications.length === 0 && (
              <EmptyState icon={Briefcase} message="Aucune candidature envoyée." />
            )}
          </TabsContent>

          {/* ─── Documents Tab ─── */}
          <TabsContent value="documents" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {stats.totalDocuments} document{stats.totalDocuments !== 1 ? 's' : ''}
                {stats.totalSpent > 0 && <span className="ml-2">· Total: {formatMoney(stats.totalSpent, 'EUR')}</span>}
              </h3>
            </div>
            {data.documents.length === 0 ? (
              <EmptyState icon={CreditCard} message="Aucun document disponible." />
            ) : (
              <div className="space-y-2">
                {data.documents.map(doc => {
                  const dt = docTypeMeta[doc.type] || docTypeMeta.invoice
                  const st = statusMeta[doc.status] || statusMeta.draft
                  const DocIcon = dt.icon
                  return (
                    <Card key={doc.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${dt.color}`}>
                          <DocIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">{doc.subject}</p>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">{doc.number}</Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge className={`text-[10px] px-1.5 py-0 ${st.color}`}>{st.label}</Badge>
                            <span className="text-xs text-muted-foreground">{formatDate(doc.issueDate)}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold">{formatMoney(doc.total, doc.currency)}</p>
                          {(doc.type === 'invoice' || doc.type === 'receipt' || doc.type === 'quote' || doc.type === 'agreement') && (
                            <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 px-2 mt-0.5" onClick={() => handleDownloadDoc(doc.id)}>
                              <Download className="w-3 h-3" />
                              PDF
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* ─── Mobility Tab ─── */}
          <TabsContent value="mobility" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {stats.totalMobilityProfiles} profil{stats.totalMobilityProfiles !== 1 ? 's' : ''} mobilité
              </h3>
              <Button variant="outline" size="sm" onClick={() => setStep('mobilityHome')} className="gap-1.5">
                <Plane className="w-3.5 h-3.5" />
                Nouvelle analyse
              </Button>
            </div>
            {data.mobilityProfiles.length === 0 ? (
              <EmptyState icon={Plane} message="Aucune analyse de mobilité. Adaptez votre CV pour l'international !" />
            ) : (
              <div className="space-y-2">
                {data.mobilityProfiles.map(mp => {
                  const st = statusMeta[mp.status] || statusMeta.draft
                  return (
                    <Card key={mp.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                          <Plane className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{mp.targetRole || 'Rôle cible'}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground">{mp.originCountry} → {mp.targetCountry}</span>
                            <Badge className={`text-[10px] px-1.5 py-0 ${st.color}`}>{st.label}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {mp.matchScore != null && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Score</p>
                              <p className={`text-sm font-bold ${mp.matchScore >= 70 ? 'text-emerald-600' : mp.matchScore >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
                                {mp.matchScore}%
                              </p>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground hidden sm:block">{formatDate(mp.createdAt)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* ─── Referrals Tab ─── */}
          <TabsContent value="referrals" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {data.referralStats.length} parrainage{data.referralStats.length !== 1 ? 's' : ''}
                {user.referralCode && <span className="ml-2">· Code: <span className="font-mono font-bold text-emerald-600">{user.referralCode}</span></span>}
              </h3>
              <Button variant="outline" size="sm" onClick={() => setStep('referral')} className="gap-1.5">
                <Gift className="w-3.5 h-3.5" />
                Dashboard parrainage
              </Button>
            </div>
            {data.referralStats.length === 0 ? (
              <EmptyState icon={Gift} message="Parrainez vos amis et gagnez des récompenses !" />
            ) : (
              <div className="space-y-2">
                {data.referralStats.map(ref => {
                  const st = statusMeta[ref.status] || statusMeta.pending
                  return (
                    <Card key={ref.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{ref.referredEmail}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge className={`text-[10px] px-1.5 py-0 ${st.color}`}>{st.label}</Badge>
                            <span className="text-xs text-muted-foreground">Récompense: {ref.rewardType}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground shrink-0">{formatDate(ref.createdAt)}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-white/60 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>HireNova — Mon Espace personnel</span>
          <span>Dernière MAJ: {formatDate(new Date().toISOString())}</span>
        </div>
      </footer>
    </div>
  )
}
