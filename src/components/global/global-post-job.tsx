'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, Loader2, CheckCircle2, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCVStore } from '@/store/cv-store'
import { toast } from 'sonner'

const countries = ['France', 'Germany', 'UK', 'USA', 'Canada', 'UAE', 'Switzerland', 'Belgium', 'Spain', 'Italy', 'Japan', 'Australia', 'Morocco', 'Tunisia', 'Algeria', 'Brazil', 'Mexico', 'China', 'India', 'Singapore']
const regions = ['Europe', 'Asie', 'Afrique', 'Amériques', 'MENA']
const currencies = ['EUR', 'USD', 'GBP', 'MAD', 'CAD', 'AED', 'CHF', 'JPY', 'AUD', 'BRL', 'MXN', 'CNY', 'INR', 'SGD']
const types = ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance', 'Contrat']

export default function GlobalPostJobView() {
  const { setStep } = useCVStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', company: '', location: '', country: 'France', region: 'Europe',
    type: 'CDI', salaryMin: '', salaryMax: '', currency: 'EUR',
    description: '', requirements: '', skills: '', language: 'fr',
    visaSponsorship: false, relocationPackage: false, isRemote: false,
  })

  const update = (key: string, val: string | boolean) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async () => {
    if (!form.title || !form.company) { toast.error('Titre et société requis'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/global-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          salaryMin: form.salaryMin ? parseInt(form.salaryMin) : null,
          salaryMax: form.salaryMax ? parseInt(form.salaryMax) : null,
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Offre publiée avec succès !')
        setStep('globalEmployerDashboard')
      } else { toast.error('Erreur lors de la publication') }
    } catch { toast.error('Erreur de connexion') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => setStep('globalEmployerDashboard')} className="cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Button>
          <Globe className="text-teal-600" />
          <div>
            <h1 className="text-xl font-bold">Publier une offre internationale</h1>
            <p className="text-sm text-muted-foreground">HireNova Global — Recrutement sans frontières</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Titre du poste *</label>
              <Input value={form.title} onChange={e => update('title', e.target.value)} placeholder="Software Engineer Senior" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Société *</label>
              <Input value={form.company} onChange={e => update('company', e.target.value)} placeholder="Acme Corp" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Ville</label>
              <Input value={form.location} onChange={e => update('location', e.target.value)} placeholder="Paris" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Pays</label>
              <select value={form.country} onChange={e => update('country', e.target.value)} className="w-full h-9 rounded-md border bg-white px-3 text-sm">
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Région</label>
              <select value={form.region} onChange={e => update('region', e.target.value)} className="w-full h-9 rounded-md border bg-white px-3 text-sm">
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Type de contrat</label>
              <select value={form.type} onChange={e => update('type', e.target.value)} className="w-full h-9 rounded-md border bg-white px-3 text-sm">
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Devise</label>
              <select value={form.currency} onChange={e => update('currency', e.target.value)} className="w-full h-9 rounded-md border bg-white px-3 text-sm">
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Salaire min</label>
              <Input type="number" value={form.salaryMin} onChange={e => update('salaryMin', e.target.value)} placeholder="35000" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Salaire max</label>
              <Input type="number" value={form.salaryMax} onChange={e => update('salaryMax', e.target.value)} placeholder="55000" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Langue</label>
              <select value={form.language} onChange={e => update('language', e.target.value)} className="w-full h-9 rounded-md border bg-white px-3 text-sm">
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="es">Español</option>
                <option value="ar">العربية</option>
                <option value="ja">日本語</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Compétences (séparées par des virgules)</label>
            <Input value={form.skills} onChange={e => update('skills', e.target.value)} placeholder="React, TypeScript, Node.js, AWS" />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Description</label>
            <Textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="Décrivez le poste en détail..." rows={4} />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Exigences</label>
            <Textarea value={form.requirements} onChange={e => update('requirements', e.target.value)} placeholder="Diplôme, expérience, compétences requises..." rows={3} />
          </div>

          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-medium text-sm">Options internationales</h3>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.visaSponsorship} onChange={e => update('visaSponsorship', e.target.checked)} className="rounded" />
                  Visa Sponsorship
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.relocationPackage} onChange={e => update('relocationPackage', e.target.checked)} className="rounded" />
                  Package de Relocation
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isRemote} onChange={e => update('isRemote', e.target.checked)} className="rounded" />
                  Télétravail
                </label>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full bg-teal-600 hover:bg-teal-700 cursor-pointer py-5" onClick={handleSubmit} disabled={loading || !form.title || !form.company}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publication en cours...</> : <><Send className="w-4 h-4 mr-2" /> Publier l&apos;offre</>}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
