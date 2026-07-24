'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Loader2, KeyRound, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react'
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

type Mode = 'login' | 'register' | 'forgot-email' | 'forgot-new-password' | 'forgot-success'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode: Mode
  onAuthSuccess?: () => void
}

export default function AuthModal({ isOpen, onClose, initialMode, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [resetUserName, setResetUserName] = useState<string | null>(null)

  const { language } = useCVStore()

  const lang = language

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setName('')
    setNewPassword('')
    setConfirmPassword('')
    setResetEmail('')
    setResetUserName(null)
    setLoading(false)
  }

  const handleClose = () => {
    resetForm()
    setMode(initialMode)
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
        onAuthSuccess?.()
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
          onAuthSuccess?.()
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

  const handleForgotEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) return
    setLoading(true)
    try {
      const res = await fetch(`/api/auth/reset-password?email=${encodeURIComponent(resetEmail)}`)
      const data = await res.json()
      if (data.success) {
        setResetUserName(data.name)
        setMode('forgot-new-password')
      } else if (data.code === 'USER_NOT_FOUND') {
        toast.error(t(lang, 'forgotPasswordNoAccount'))
      } else if (data.code === 'NO_ACTIVE_PLAN') {
        toast.error(t(lang, 'forgotPasswordNoPlan'))
      } else {
        toast.error(data.error || t(lang, 'forgotPasswordError'))
      }
    } catch {
      toast.error(t(lang, 'forgotPasswordError'))
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || !confirmPassword) return
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    if (newPassword.length < 6) {
      toast.error(t(lang, 'forgotPasswordNewPasswordPh'))
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, newPassword }),
      })
      const data = await res.json()
      if (data.success) {
        setMode('forgot-success')
      } else {
        toast.error(data.error || t(lang, 'forgotPasswordError'))
      }
    } catch {
      toast.error(t(lang, 'forgotPasswordError'))
    } finally {
      setLoading(false)
    }
  }

  const goToForgotPassword = () => {
    resetForm()
    setMode('forgot-email')
  }

  const goToLogin = () => {
    resetForm()
    setMode('login')
  }

  const toggleMode = () => {
    resetForm()
    setMode((m) => (m === 'login' ? 'register' : 'login'))
  }

  const isLogin = mode === 'login'
  const isForgot = mode === 'forgot-email' || mode === 'forgot-new-password' || mode === 'forgot-success'

  // Header content per mode
  const headerTitle = isForgot
    ? mode === 'forgot-email'
      ? t(lang, 'forgotPasswordTitle')
      : mode === 'forgot-new-password'
        ? t(lang, 'forgotPasswordVerify')
        : t(lang, 'forgotPasswordSuccess')
    : isLogin
      ? t(lang, 'loginTitle')
      : t(lang, 'registerTitle')

  const headerDesc = isForgot
    ? mode === 'forgot-email'
      ? t(lang, 'forgotPasswordDesc')
      : mode === 'forgot-new-password'
        ? t(lang, 'forgotPasswordVerifyDesc')
        : ''
    : isLogin
      ? t(lang, 'loginEmail')
      : t(lang, 'registerTitle')

  const headerIcon = isForgot
    ? mode === 'forgot-success'
      ? <CheckCircle2 className="w-6 h-6 text-white" />
      : <KeyRound className="w-6 h-6 text-white" />
    : <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
      </svg>

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-6 py-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
            {headerIcon}
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {headerTitle}
            </DialogTitle>
            {headerDesc && (
              <DialogDescription className="text-emerald-100 text-sm">
                {headerDesc}
              </DialogDescription>
            )}
          </DialogHeader>
        </div>

        {/* FORGOT PASSWORD - Step 1: Enter email */}
        {mode === 'forgot-email' && (
          <form onSubmit={handleForgotEmailSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-sm font-medium text-foreground">
                {t(lang, 'forgotPasswordEmail')}
              </Label>
              <Input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="rounded-xl border-border focus:border-emerald-500 focus:ring-emerald-500/20"
                placeholder={t(lang, 'forgotPasswordEmailPh')}
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600" />
              <span>La réinitialisation est réservée aux abonnés avec un plan actif.</span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-5 text-base font-semibold cursor-pointer transition-all"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t(lang, 'forgotPasswordVerify')}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={goToLogin}
                className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t(lang, 'forgotPasswordBackToLogin')}
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD - Step 2: New password */}
        {mode === 'forgot-new-password' && (
          <form onSubmit={handleResetPassword} className="p-6 space-y-4">
            {resetUserName && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800 mb-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="font-medium">{t(lang, 'forgotPasswordUserFound')} :</span>
                <span className="font-semibold">{resetUserName}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm font-medium text-foreground">
                {t(lang, 'forgotPasswordNewPassword')}
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="rounded-xl border-border focus:border-emerald-500 focus:ring-emerald-500/20"
                placeholder={t(lang, 'forgotPasswordNewPasswordPh')}
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
                {t(lang, 'forgotPasswordConfirm')}
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="rounded-xl border-border focus:border-emerald-500 focus:ring-emerald-500/20"
                placeholder={t(lang, 'forgotPasswordNewPasswordPh')}
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-5 text-base font-semibold cursor-pointer transition-all"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t(lang, 'forgotPasswordButton')}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={goToLogin}
                className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t(lang, 'forgotPasswordBackToLogin')}
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD - Step 3: Success */}
        {mode === 'forgot-success' && (
          <div className="p-6 space-y-4">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-foreground font-medium text-lg mb-2">
                {t(lang, 'forgotPasswordSuccess')}
              </p>
              <p className="text-muted-foreground text-sm">
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
            </div>
            <Button
              onClick={goToLogin}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-5 text-base font-semibold cursor-pointer transition-all"
            >
              {t(lang, 'forgotPasswordBackToLogin')}
            </Button>
          </div>
        )}

        {/* LOGIN / REGISTER */}
        {!isForgot && (
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

            <div className="text-center pt-2 space-y-1">
              {isLogin && (
                <button
                  type="button"
                  onClick={goToForgotPassword}
                  className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer inline-flex items-center gap-1 font-medium"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  {t(lang, 'forgotPasswordButton')}
                </button>
              )}
              <div>
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
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
