'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCVStore } from '@/store/cv-store'
import { toast } from 'sonner'

export default function EmployerPostJobView() {
  const { setStep } = useCVStore()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    title: '', company: '', location: '', country: 'Maroc', type: 'CDI',
    salaryMin: '', salaryMax: '', currency: 'MAD', description: '', requirements: '', skills: '', isRemote: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.company || !form.description) {
      toast.error('Titre, entreprise et description sont requis'); return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
          salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
        })
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
        toast.success('Offre publiée !')
      } else {
        toast.error(data.error?.message || 'Erreur')
      }
    } catch { toast.error('Erreur') } finally { setLoading(false) }
  }

  const update = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" size="sm" onClick={() => setStep('employerDashboard')} className="mb-6 cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour
        </Button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {success ? (
            <Card className="text-center p-8">
              <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-600 mb-4" />
              <h2 className="text-xl font-bold mb-2">Offre publiée !</h2>
              <Button className="bg-emerald-600 hover:bg-emerald-700 mt-4 cursor-pointer" onClick={() => setStep('employerDashboard')}>Voir le dashboard</Button>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 sm:p-8">
                <h1 className="text-xl font-bold mb-6">Publier une offre d'emploi</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium mb-1 block">Titre du poste *</label><Input value={form.title} onChange={e => update('title', e.target.value)} required /></div>
                    <div><label className="text-sm font-medium mb-1 block">Entreprise *</label><Input value={form.company} onChange={e => update('company', e.target.value)} required /></div>
                    <div><label className="text-sm font-medium mb-1 block">Ville</label><Input value={form.location} onChange={e => update('location', e.target.value)} /></div>
                    <div><label className="text-sm font-medium mb-1 block">Pays</label><Input value={form.country} onChange={e => update('country', e.target.value)} /></div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Type</label>
                      <select value={form.type} onChange={e => update('type', e.target.value)} className="h-9 w-full rounded-md border bg-white px-3 text-sm">
                        {['CDI','CDD','Freelance','Stage','Alternance'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div><label className="text-sm font-medium mb-1 block">Compétences</label><Input value={form.skills} onChange={e => update('skills', e.target.value)} placeholder="JS, React, Node..." /></div>
                    <div><label className="text-sm font-medium mb-1 block">Salaire min</label><Input type="number" value={form.salaryMin} onChange={e => update('salaryMin', e.target.value)} /></div>
                    <div><label className="text-sm font-medium mb-1 block">Salaire max</label><Input type="number" value={form.salaryMax} onChange={e => update('salaryMax', e.target.value)} /></div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isRemote} onChange={e => update('isRemote', e.target.checked)} className="rounded" /> Télétravail</label>
                  <div><label className="text-sm font-medium mb-1 block">Description *</label><Textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4} required /></div>
                  <div><label className="text-sm font-medium mb-1 block">Exigences</label><Textarea value={form.requirements} onChange={e => update('requirements', e.target.value)} rows={3} /></div>
                  <Button type="submit" size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer" disabled={loading}>
                    {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publication...</> : <><Send className="w-4 h-4 mr-2" /> Publier l'offre</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
