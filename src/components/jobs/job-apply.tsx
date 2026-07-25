'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCVStore } from '@/store/cv-store'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

export default function JobApplyView() {
  const { stepData, setStep } = useCVStore()
  const { data: session } = useSession()
  const [name, setName] = useState(session?.user?.name || '')
  const [email, setEmail] = useState(session?.user?.email || '')
  const [coverNote, setCoverNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; matchScore?: number } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) { toast.error('Remplissez votre nom et email'); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/jobs/${stepData.jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateName: name, candidateEmail: email, coverNote })
      })
      const data = await res.json()
      if (data.success) {
        setResult({ success: true, matchScore: data.data?.matchScore })
        toast.success('Candidature envoyée !')
      } else {
        toast.error(data.error?.message || 'Erreur')
      }
    } catch {
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" size="sm" onClick={() => setStep('jobDetail', { jobId: stepData.jobId })} className="mb-6 cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {result?.success ? (
            <Card className="text-center p-8">
              <CardContent className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold">Candidature envoyée !</h2>
                {result.matchScore && (
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-emerald-600">{result.matchScore}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Score de compatibilité IA</p>
                  </div>
                )}
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep('jobMarket')} className="cursor-pointer">Voir les offres</Button>
                  <Button onClick={() => setStep('candidateApplications')} className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer">Mes candidatures</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 sm:p-8">
                <h1 className="text-xl font-bold mb-6">Postuler à cette offre</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Nom complet *</label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Votre nom" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email *</label>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Note de motivation</label>
                    <Textarea value={coverNote} onChange={e => setCoverNote(e.target.value)} placeholder="Pourquoi vous êtes le candidat idéal..." rows={5} />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer" disabled={loading}>
                    {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi en cours...</> : <><Send className="w-4 h-4 mr-2" /> Envoyer ma candidature</>}
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
