'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { t } from '@/lib/i18n'
import { useCVStore } from '@/store/cv-store'

type Mode = 'login' | 'register'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode: Mode
}

export default function AuthModal({ isOpen, onClose, initialMode }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const { language } = useCVStore()

  const lang = language

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setName('')
    setLoading(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        toast.error(t(lang, 'loginError'))
      } else {
        toast.success(t(lang, 'loginSuccess'))
        handleClose()
      }
    } catch {
      toast.error(t(lang, 'loginError'))
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (res.ok) {
        toast.success(t(lang, 'registerSuccess'))
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })
        if (result?.ok) {
          toast.success(t(lang, 'loginSuccess'))
          handleClose()
        }
      } else {
        toast.error(t(lang, 'registerError'))
      }
    } catch {
      toast.error(t(lang, 'registerError'))
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    resetForm()
    setMode((m) => (m === 'login' ? 'register' : 'login'))
  }

  const isLogin = mode === 'login'

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-6 py-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {isLogin ? t(lang, 'loginTitle') : t(lang, 'registerTitle')}
            </DialogTitle>
            <DialogDescription className="text-emerald-100 text-sm">
              {isLogin ? t(lang, 'loginEmail') : t(lang, 'registerTitle')}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          onSubmit={isLogin ? handleLogin : handleRegister}
          className="p-6 space-y-4"
        >
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="auth-name" className="text-sm font-medium text-foreground">
                {t(lang, 'loginName')}
              </Label>
              <Input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl border-border focus:border-emerald-500 focus:ring-emerald-500/20"
                placeholder={t(lang, 'loginName')}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="auth-email" className="text-sm font-medium text-foreground">
              {t(lang, 'loginEmail')}
            </Label>
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border-border focus:border-emerald-500 focus:ring-emerald-500/20"
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth-password" className="text-sm font-medium text-foreground">
              {t(lang, 'loginPassword')}
            </Label>
            <Input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl border-border focus:border-emerald-500 focus:ring-emerald-500/20"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-5 text-base font-semibold cursor-pointer transition-all"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLogin ? t(lang, 'loginButton') : t(lang, 'registerButton')}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors cursor-pointer"
            >
              {isLogin ? t(lang, 'loginNoAccount') : t(lang, 'registerHasAccount')}
              <span className="ml-1 font-semibold text-emerald-600">
                {isLogin ? t(lang, 'registerButton') : t(lang, 'loginButton')}
              </span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
