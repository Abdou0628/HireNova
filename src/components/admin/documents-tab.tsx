'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  FileText,
  FilePlus,
  Download,
  Send,
  Search,
  RefreshCw,
  Building2,
  Receipt,
  FileCheck,
  FileX,
  Loader2,
  Mail,
  TrendingUp,
  Euro,
  Filter,
  Calculator,
  ShieldCheck,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

type DocType = 'invoice' | 'quote' | 'agreement' | 'receipt' | 'credit_note' | 'accounting_statement'
type DocStatus = 'draft' | 'sent' | 'paid' | 'accepted' | 'rejected' | 'cancelled' | 'expired' | 'finalized'

interface DocumentRow {
  id: string
  type: string
  number: string
  recipientName: string
  recipientEmail: string
  recipientCompany?: string
  subject: string
  currency: string
  total: number
  status: string
  issueDate: string
  dueDate?: string
  paidAt?: string
  createdAt: string
  inquiryId?: string
  // Signature fields
  signatureHash?: string | null
  signatureSerial?: string | null
  signatureDate?: string | null
  signedBy?: string | null
  // Bilan fields
  periodStart?: string | null
  periodEnd?: string | null
  invoiceCount?: number
  netProfit?: number
  totalCollected?: number
  platformFees?: number
  royaltyFees?: number
}

interface InquiryRow {
  id: string
  contactName: string
  workEmail: string
  companyName: string
  country?: string
  usersCount?: string
  useCase?: string
  budget?: string
  message: string
  status: string
  createdAt: string
}

const TYPE_META: Record<string, { label: string; icon: typeof FileText; color: string; badge: string }> = {
  invoice:               { label: 'Facture',  icon: FileText,     color: 'text-emerald-600',     badge: 'bg-emerald-100 text-emerald-700' },
  quote:                 { label: 'Devis',    icon: FilePlus,     color: 'text-sky-600',          badge: 'bg-sky-100 text-sky-700' },
  agreement:             { label: 'Contrat',  icon: FileCheck,    color: 'text-purple-600',       badge: 'bg-purple-100 text-purple-700' },
  receipt:               { label: 'Reçu',     icon: Receipt,      color: 'text-amber-600',        badge: 'bg-amber-100 text-amber-700' },
  credit_note:           { label: 'Avoir',    icon: FileX,        color: 'text-rose-600',         badge: 'bg-rose-100 text-rose-700' },
  accounting_statement:  { label: 'Bilan',    icon: Calculator,   color: 'text-slate-700',        badge: 'bg-slate-800 text-white' },
}

const STATUS_META: Record<string, { label: string; badge: string }> = {
  draft:      { label: 'Brouillon',  badge: 'bg-slate-100 text-slate-700' },
  sent:       { label: 'Envoyé',     badge: 'bg-blue-100 text-blue-700' },
  paid:       { label: 'Payé',       badge: 'bg-emerald-100 text-emerald-700' },
  accepted:   { label: 'Accepté',    badge: 'bg-emerald-100 text-emerald-700' },
  rejected:   { label: 'Refusé',     badge: 'bg-rose-100 text-rose-700' },
  cancelled:  { label: 'Annulé',     badge: 'bg-slate-100 text-slate-500' },
  expired:    { label: 'Expiré',     badge: 'bg-amber-100 text-amber-700' },
  finalized:  { label: 'Finalisé',   badge: 'bg-slate-800 text-white' },
}

function formatMoney(amount: number, currency: string): string {
  const symbols: Record<string, string> = { EUR: '€', USD: '$', GBP: '£', MAD: 'DH' }
  const symbol = symbols[currency] || currency
  return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${symbol}`
}

function formatDate(date: string | undefined): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function DocumentsTab() {
  const [documents, setDocuments] = useState<DocumentRow[]>([])
  const [inquiries, setInquiries] = useState<InquiryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [stats, setStats] = useState<Record<string, { count: number; total: number }>>({})
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [generateModal, setGenerateModal] = useState<{ open: boolean; inquiry?: InquiryRow }>({ open: false })
  const [bilanOpen, setBilanOpen] = useState(false)
  const [bilanLoading, setBilanLoading] = useState(false)
  const [bilanResult, setBilanResult] = useState<{ number: string; invoiceCount: number; totalCollected: number; netProfit: number } | null>(null)

  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (typeFilter !== 'all') params.set('type', typeFilter)
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (search) params.set('search', search)
      const res = await fetch(`/api/admin/documents?${params.toString()}`)
      const json = await res.json()
      if (json.success) {
        setDocuments(json.data.documents)
        setStats(json.data.stats)
      }
    } catch (err) {
      console.error('[documents] fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [typeFilter, statusFilter, search])

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/enterprise-inquiries')
      const json = await res.json()
      if (json.success) {
        setInquiries(json.data.inquiries)
      }
    } catch (err) {
      console.error('[inquiries] fetch error:', err)
    }
  }, [])

  useEffect(() => {
    fetchDocuments()
    fetchInquiries()
  }, [fetchDocuments, fetchInquiries])

  const handleDownload = async (doc: DocumentRow) => {
    setActionLoading(`dl-${doc.id}`)
    try {
      const res = await fetch(`/api/documents/${doc.id}`)
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${doc.type}-${doc.number}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('PDF téléchargé')
    } catch (err) {
      toast.error('Erreur lors du téléchargement')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSend = async (doc: DocumentRow) => {
    setActionLoading(`send-${doc.id}`)
    try {
      const res = await fetch(`/api/documents/${doc.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const json = await res.json()
      if (json.success) {
        toast.success(`Document envoyé à ${doc.recipientEmail}`)
        fetchDocuments()
      } else {
        throw new Error(json.error)
      }
    } catch (err) {
      toast.error('Erreur lors de l\'envoi')
    } finally {
      setActionLoading(null)
    }
  }

  const handleGenerateQuote = async (inquiry: InquiryRow) => {
    setActionLoading(`gen-${inquiry.id}`)
    try {
      const res = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quote',
          inquiryId: inquiry.id,
          currency: 'EUR',
        }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success(`Devis ${json.data.number} généré`)
        fetchDocuments()
        fetchInquiries()
        setGenerateModal({ open: false })
      } else {
        throw new Error(json.error)
      }
    } catch (err) {
      toast.error('Erreur lors de la génération')
    } finally {
      setActionLoading(null)
    }
  }

  const handleGenerateAgreement = async (inquiry: InquiryRow) => {
    setActionLoading(`ctr-${inquiry.id}`)
    try {
      const res = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'agreement',
          inquiryId: inquiry.id,
          totalAmount: 16500,
          currency: 'EUR',
        }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success(`Contrat ${json.data.number} généré`)
        fetchDocuments()
      } else {
        throw new Error(json.error)
      }
    } catch (err) {
      toast.error('Erreur lors de la génération du contrat')
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdateStatus = async (docId: string, status: DocStatus) => {
    try {
      const res = await fetch('/api/admin/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: docId, status }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Statut mis à jour')
        fetchDocuments()
      }
    } catch (err) {
      toast.error('Erreur')
    }
  }

  const handleUpdateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/enterprise-inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inquiryId, status }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Demande mise à jour')
        fetchInquiries()
      }
    } catch (err) {
      toast.error('Erreur')
    }
  }

  const handleGenerateBilan = async (preset: string) => {
    setBilanLoading(true)
    setBilanResult(null)
    try {
      const res = await fetch('/api/admin/documents/bilan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset }),
      })
      const json = await res.json()
      if (json.success) {
        const d = json.data
        setBilanResult({
          number: d.number,
          invoiceCount: d.invoiceCount,
          totalCollected: d.totalCollected,
          netProfit: d.netProfit,
        })
        toast.success(`Bilan ${d.number} généré — ${d.invoiceCount} facture(s), bénéfice net ${formatMoney(d.netProfit, 'EUR')}`)
        fetchDocuments()
      } else {
        throw new Error(json.error)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la génération du bilan')
    } finally {
      setBilanLoading(false)
    }
  }

  const totalRevenue = (stats.invoice?.total || 0) + (stats.receipt?.total || 0)
  const totalDocs = Object.values(stats).reduce((sum, s) => sum + s.count, 0)

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-muted-foreground">Factures</span>
            </div>
            <p className="text-2xl font-bold">{stats.invoice?.count || 0}</p>
            <p className="text-xs text-emerald-600 font-medium">{formatMoney(stats.invoice?.total || 0, 'EUR')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <FilePlus className="w-4 h-4 text-sky-600" />
              <span className="text-xs text-muted-foreground">Devis</span>
            </div>
            <p className="text-2xl font-bold">{stats.quote?.count || 0}</p>
            <p className="text-xs text-sky-600 font-medium">{formatMoney(stats.quote?.total || 0, 'EUR')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <FileCheck className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-muted-foreground">Contrats</span>
            </div>
            <p className="text-2xl font-bold">{stats.agreement?.count || 0}</p>
            <p className="text-xs text-purple-600 font-medium">{formatMoney(stats.agreement?.total || 0, 'EUR')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-muted-foreground">Reçus</span>
            </div>
            <p className="text-2xl font-bold">{stats.receipt?.count || 0}</p>
            <p className="text-xs text-amber-600 font-medium">{formatMoney(stats.receipt?.total || 0, 'EUR')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Euro className="w-4 h-4 text-emerald-700" />
              <span className="text-xs text-muted-foreground">Revenu total</span>
            </div>
            <p className="text-2xl font-bold text-emerald-700">{formatMoney(totalRevenue, 'EUR')}</p>
            <p className="text-xs text-muted-foreground">{totalDocs} documents</p>
          </CardContent>
        </Card>
      </div>

      {/* ===== Bilan Comptable — Accounting Statement Generator ===== */}
      <Card className="border-slate-300 bg-gradient-to-br from-slate-50 to-white">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  Bilan Comptable
                  <Badge className="text-[10px] bg-slate-800 text-white">Fiscal & Bénéfices</Badge>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Génère un bilan liant toutes les factures payées — TVA, charges, bénéfice net, signature électronique.
                </p>
              </div>
            </div>
            <Button
              onClick={() => { setBilanResult(null); setBilanOpen(true) }}
              disabled={bilanLoading}
              className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white shrink-0"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Générer un Bilan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enterprise Inquiries (only show if any) */}
      {inquiries.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-700" />
                Demandes Enterprise ({inquiries.length})
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchInquiries}
                className="cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Actualiser
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-72">
              <div className="space-y-2">
                {inquiries.slice(0, 10).map((inq) => (
                  <div key={inq.id} className="p-3 rounded-lg border bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-sm truncate">{inq.companyName}</p>
                          <Badge className={`text-[10px] ${
                            inq.status === 'new' ? 'bg-blue-100 text-blue-700' :
                            inq.status === 'contacted' ? 'bg-amber-100 text-amber-700' :
                            inq.status === 'qualified' ? 'bg-purple-100 text-purple-700' :
                            inq.status === 'won' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {inq.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {inq.contactName} · {inq.workEmail} · {inq.country || '—'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{inq.message}</p>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer text-xs h-7"
                          onClick={() => handleGenerateQuote(inq)}
                          disabled={actionLoading === `gen-${inq.id}`}
                        >
                          {actionLoading === `gen-${inq.id}` ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <FilePlus className="w-3 h-3 mr-1" />
                          )}
                          Devis
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer text-xs h-7"
                          onClick={() => handleGenerateAgreement(inq)}
                          disabled={actionLoading === `ctr-${inq.id}`}
                        >
                          <FileCheck className="w-3 h-3 mr-1" />
                          Contrat
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Filters + Documents table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents générés ({documents.length})
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs w-40"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-8 text-xs w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">Tous types</SelectItem>
                  <SelectItem value="invoice" className="text-xs">Factures</SelectItem>
                  <SelectItem value="quote" className="text-xs">Devis</SelectItem>
                  <SelectItem value="agreement" className="text-xs">Contrats</SelectItem>
                  <SelectItem value="receipt" className="text-xs">Reçus</SelectItem>
                  <SelectItem value="accounting_statement" className="text-xs">Bilans</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-xs w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">Tous statuts</SelectItem>
                  <SelectItem value="draft" className="text-xs">Brouillon</SelectItem>
                  <SelectItem value="sent" className="text-xs">Envoyé</SelectItem>
                  <SelectItem value="paid" className="text-xs">Payé</SelectItem>
                  <SelectItem value="accepted" className="text-xs">Accepté</SelectItem>
                  <SelectItem value="finalized" className="text-xs">Finalisé</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchDocuments}
                className="cursor-pointer h-8"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
              Chargement...
            </div>
          ) : documents.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Aucun document généré pour le moment</p>
              <p className="text-xs text-muted-foreground mt-1">
                Les factures, devis et contrats apparaîtront ici automatiquement.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">N°</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Destinataire</TableHead>
                  <TableHead className="text-xs">Objet</TableHead>
                  <TableHead className="text-xs text-right">Montant</TableHead>
                  <TableHead className="text-xs">Statut</TableHead>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => {
                  const meta = TYPE_META[doc.type] || TYPE_META.invoice
                  const statusMeta = STATUS_META[doc.status] || STATUS_META.draft
                  const Icon = meta.icon
                  return (
                    <TableRow key={doc.id}>
                      <TableCell className="text-xs font-mono font-semibold">
                        <div className="flex items-center gap-1.5">
                          {doc.number}
                          {doc.signatureSerial && (
                            <span title={`Signé électroniquement — ${doc.signatureSerial} — Hash: ${doc.signatureHash?.slice(0, 16)}…`}>
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] ${meta.badge}`}>
                          <Icon className="w-2.5 h-2.5 mr-1" />
                          {meta.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="font-medium">{doc.recipientName}</div>
                        {doc.recipientCompany && (
                          <div className="text-[10px] text-muted-foreground">{doc.recipientCompany}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate" title={doc.subject}>
                        {doc.subject}
                      </TableCell>
                      <TableCell className="text-xs text-right font-semibold">
                        {doc.type === 'accounting_statement' && doc.totalCollected != null ? (
                          <div>
                            <div className="text-slate-500 line-through text-[10px]">{formatMoney(doc.totalCollected, doc.currency)}</div>
                            <div className="text-emerald-700">{formatMoney(doc.netProfit || 0, doc.currency)}</div>
                            <div className="text-[9px] text-muted-foreground">bénéfice net</div>
                          </div>
                        ) : (
                          formatMoney(doc.total, doc.currency)
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] ${statusMeta.badge}`}>
                          {statusMeta.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{formatDate(doc.issueDate)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="cursor-pointer h-7 w-7 p-0"
                            onClick={() => handleDownload(doc)}
                            disabled={actionLoading === `dl-${doc.id}`}
                            title="Télécharger PDF"
                          >
                            {actionLoading === `dl-${doc.id}` ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="cursor-pointer h-7 w-7 p-0"
                            onClick={() => handleSend(doc)}
                            disabled={actionLoading === `send-${doc.id}`}
                            title="Envoyer par email"
                          >
                            {actionLoading === `send-${doc.id}` ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                          </Button>
                          {doc.type === 'quote' && doc.status === 'sent' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="cursor-pointer h-7 text-xs px-2 text-emerald-600"
                              onClick={() => handleUpdateStatus(doc.id, 'accepted')}
                              title="Marquer accepté"
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          {doc.type === 'invoice' && doc.status === 'sent' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="cursor-pointer h-7 text-xs px-2 text-emerald-600"
                              onClick={() => handleUpdateStatus(doc.id, 'paid')}
                              title="Marquer payé"
                            >
                              ✓
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ===== Bilan Generation Dialog ===== */}
      <Dialog open={bilanOpen} onOpenChange={setBilanOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-slate-700" />
              Générer un Bilan Comptable
            </DialogTitle>
            <DialogDescription>
              Le bilan agrège toutes les factures payées sur la période choisie.
              Il calcule la TVA, les charges plateforme, les redevances et le bénéfice net —
              le tout signé électroniquement et lié aux factures source.
            </DialogDescription>
          </DialogHeader>

          {bilanResult ? (
            <div className="py-4 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <div>
                <p className="font-semibold text-sm">Bilan {bilanResult.number} généré</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {bilanResult.invoiceCount} facture(s) agrégée(s) · Encaissé {formatMoney(bilanResult.totalCollected, 'EUR')}
                </p>
                <p className="text-sm font-bold text-emerald-700 mt-2">
                  Bénéfice net : {formatMoney(bilanResult.netProfit, 'EUR')}
                </p>
              </div>
              <div className="flex gap-2 justify-center pt-2">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    const doc = documents.find((d) => d.number === bilanResult.number)
                    if (doc) handleDownload(doc)
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PDF
                </Button>
                <Button
                  className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white"
                  onClick={() => { setBilanResult(null); setBilanOpen(false) }}
                >
                  Fermer
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-2 space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Choisir une période
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="cursor-pointer h-auto py-3 flex flex-col items-start"
                  disabled={bilanLoading}
                  onClick={() => handleGenerateBilan('this_month')}
                >
                  <span className="text-xs font-semibold">Ce mois-ci</span>
                  <span className="text-[10px] text-muted-foreground">Bilan mensuel courant</span>
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer h-auto py-3 flex flex-col items-start"
                  disabled={bilanLoading}
                  onClick={() => handleGenerateBilan('last_month')}
                >
                  <span className="text-xs font-semibold">Mois dernier</span>
                  <span className="text-[10px] text-muted-foreground">Bilan mensuel précédent</span>
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer h-auto py-3 flex flex-col items-start"
                  disabled={bilanLoading}
                  onClick={() => handleGenerateBilan('this_quarter')}
                >
                  <span className="text-xs font-semibold">Ce trimestre</span>
                  <span className="text-[10px] text-muted-foreground">Bilan trimestriel courant</span>
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer h-auto py-3 flex flex-col items-start"
                  disabled={bilanLoading}
                  onClick={() => handleGenerateBilan('last_quarter')}
                >
                  <span className="text-xs font-semibold">Trimestre dernier</span>
                  <span className="text-[10px] text-muted-foreground">Bilan trimestriel précédent</span>
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer h-auto py-3 flex flex-col items-start"
                  disabled={bilanLoading}
                  onClick={() => handleGenerateBilan('ytd')}
                >
                  <span className="text-xs font-semibold">Année en cours</span>
                  <span className="text-[10px] text-muted-foreground">Depuis le 1er janvier</span>
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer h-auto py-3 flex flex-col items-start"
                  disabled={bilanLoading}
                  onClick={() => handleGenerateBilan('last_year')}
                >
                  <span className="text-xs font-semibold">Année dernière</span>
                  <span className="text-[10px] text-muted-foreground">Bilan annuel complet</span>
                </Button>
              </div>

              {bilanLoading && (
                <div className="flex items-center justify-center py-3 gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Génération du bilan en cours...
                </div>
              )}

              <div className="text-[10px] text-muted-foreground bg-slate-50 rounded-md p-2.5 border border-slate-200 space-y-1">
                <p className="font-semibold text-slate-600">Ce que contient le bilan :</p>
                <p>• Synthèse : Total HT, TVA, TTC encaissé, charges, bénéfice net</p>
                <p>• Détail de toutes les factures payées sur la période</p>
                <p>• Section fiscale : CA HT, TVA à déclarer, bénéfice imposable</p>
                <p>• Logo HireNova + signature électronique (SHA-256, N° SIG-2026-000001)</p>
                <p>• Liaison aux factures source (audit complet pour le fisc)</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
