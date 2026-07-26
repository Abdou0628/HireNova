'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Rocket, Check, Copy, Zap, Building2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useCVStore } from '@/store/cv-store'
import { toast } from 'sonner'

const plans = [
  { id: 'starter', name: 'Starter', price: '49€', credits: '100', features: ['100 crédits/mois', 'CV + Lettre + ATS', 'Support email', '1 clé API'], popular: false },
  { id: 'business', name: 'Business', price: '149€', credits: '500', features: ['500 crédits/mois', 'Toutes les features', 'Support prioritaire', '5 clés API', 'Webhook'], popular: true },
  { id: 'enterprise', name: 'Enterprise', price: '399€', credits: '∞', features: ['Crédits illimités', 'Toutes les features', 'Support dédié', 'Clés illimitées', 'SLA garanti', 'Webhook personnalisé'], popular: false },
]

export default function ApiRegisterView() {
  const { setStep } = useCVStore()
  const [plan, setPlan] = useState('business')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [form, setForm] = useState({ name: '', email: '', company: '', industry: '', website: '', phone: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.company) { toast.error('Nom, email et entreprise requis'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/api-portal/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, plan })
      })
      const data = await res.json()
      if (data.success && data.data?.apiKey) {
        setApiKey(data.data.apiKey)
        toast.success('Inscription réussie !')
      } else { toast.error(data.error?.message || 'Erreur') }
    } catch { toast.error('Erreur') } finally { setLoading(false) }
  }

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => setStep('landing')} className="cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Rocket className="text-emerald-600" /> Obtenir une clé API
          </h1>
        </div>

        {apiKey ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="max-w-2xl mx-auto text-center p-8">
              <Check className="w-16 h-16 mx-auto text-emerald-600 mb-4" />
              <h2 className="text-xl font-bold mb-2">Votre clé API est prête !</h2>
              <p className="text-sm text-amber-600 font-medium mb-4">⚠️ Sauvegardez cette clé — elle ne sera plus affichée.</p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-6 break-all">{apiKey}</div>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => { navigator.clipboard.writeText(apiKey); toast.success('Copié !') }} className="cursor-pointer"><Copy className="w-4 h-4 mr-1" /> Copier</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer" onClick={() => setStep('apiDocs')}>Voir la documentation</Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {plans.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className={`cursor-pointer transition-all hover:shadow-lg ${plan === p.id ? 'border-emerald-500 ring-2 ring-emerald-500/20' : ''}`} onClick={() => setPlan(p.id)}>
                    <CardContent className="p-5 text-center">
                      {p.popular && <Badge className="bg-emerald-600 mb-2">Populaire</Badge>}
                      <h3 className="text-lg font-bold">{p.name}</h3>
                      <div className="text-3xl font-bold text-emerald-600 my-2">{p.price}<span className="text-sm font-normal text-muted-foreground">/mois</span></div>
                      <p className="text-sm text-muted-foreground mb-4">{p.credits === '∞' ? 'Illimité' : `${p.credits} crédits`}/mois</p>
                      <ul className="space-y-1 text-xs text-left">
                        {p.features.map((f, fi) => <li key={fi} className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-600" /> {f}</li>)}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-lg font-semibold mb-6">Informations de votre organisation</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium mb-1 block">Nom *</label><Input value={form.name} onChange={e => update('name', e.target.value)} required /></div>
                      <div><label className="text-sm font-medium mb-1 block">Email *</label><Input type="email" value={form.email} onChange={e => update('email', e.target.value)} required /></div>
                      <div><label className="text-sm font-medium mb-1 block">Entreprise *</label><Input value={form.company} onChange={e => update('company', e.target.value)} required /></div>
                      <div><label className="text-sm font-medium mb-1 block">Secteur</label><Input value={form.industry} onChange={e => update('industry', e.target.value)} /></div>
                      <div><label className="text-sm font-medium mb-1 block">Site web</label><Input value={form.website} onChange={e => update('website', e.target.value)} /></div>
                      <div><label className="text-sm font-medium mb-1 block">Téléphone</label><Input value={form.phone} onChange={e => update('phone', e.target.value)} /></div>
                    </div>
                    <Button type="submit" size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer" disabled={loading}>
                      {loading ? 'Inscription...' : 'Obtenir ma clé API'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
