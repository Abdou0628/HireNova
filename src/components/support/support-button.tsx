'use client'

import { useState } from 'react'
import { MessageCircle, X, Send, Loader2, Bug, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

const subjects = [
  { key: 'bug', label: 'Bug / Erreur technique', icon: Bug, color: 'text-red-500' },
  { key: 'payment', label: 'Problème de paiement', icon: MessageCircle, color: 'text-amber-500' },
  { key: 'question', label: 'Question générale', icon: HelpCircle, color: 'text-sky-500' },
  { key: 'other', label: 'Autre', icon: MessageCircle, color: 'text-muted-foreground' },
]

export default function SupportButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('')
  const [customSubject, setCustomSubject] = useState('')
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = async () => {
    const subject = selectedSubject === 'other' ? customSubject : subjects.find((s) => s.key === selectedSubject)?.label
    if (!name.trim() || !subject || !message.trim()) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    if (email.trim() && !email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Email invalide')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || 'non-connecte@cvgenius.ia',
          subject,
          message: message.trim(),
        }),
      })
      if (res.ok) {
        toast.success('Réclamation envoyée ! Nous vous répondrons rapidement.')
        setOpen(false)
        setSelectedSubject('')
        setCustomSubject('')
        setMessage('')
        setName('')
        setEmail('')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Erreur')
      }
    } catch {
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Contacter le support"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
              </div>
              Contacter le support
            </DialogTitle>
            <DialogDescription>
              Décrivez votre problème, nous vous répondrons rapidement.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nom *</Label>
              <Input
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Email (optionnel)</Label>
              <Input
                placeholder="votre@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Subject Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sujet</Label>
              <div className="grid grid-cols-2 gap-2">
                {subjects.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSelectedSubject(s.key)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm text-left transition-all cursor-pointer ${
                      selectedSubject === s.key
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-border hover:border-emerald-300 hover:bg-emerald-50/50'
                    }`}
                  >
                    <s.icon className={`w-4 h-4 shrink-0 ${selectedSubject === s.key ? 'text-emerald-600' : s.color}`} />
                    <span className="text-xs font-medium">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom subject for 'other' */}
            {selectedSubject === 'other' && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Précisez le sujet</Label>
                <Input
                  placeholder="Ex: Demande de remboursement..."
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                />
              </div>
            )}

            {/* Message */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Message</Label>
              <Textarea
                placeholder="Décrivez votre problème en détail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading || !selectedSubject || !message.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              {loading ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Send className="mr-2 w-4 h-4" />}
              Envoyer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
