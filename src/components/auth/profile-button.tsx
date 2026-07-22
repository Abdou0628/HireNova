'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { LogOut, User, ChevronDown, Crown, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { t } from '@/lib/i18n'
import { useCVStore } from '@/store/cv-store'
import type { CVLanguage } from '@/lib/i18n'
import AuthModal from './auth-modal'
import AdminDashboard from '@/components/admin/admin-dashboard'

export default function ProfileButton() {
  const { data: session, status } = useSession()
  const { language } = useCVStore()
  const lang = language
  const [authOpen, setAuthOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)

  const user = session?.user
  const isLoggedIn = status === 'authenticated' && user
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  const handleLogout = async () => {
    await signOut({ redirect: false })
    toast.success(t(lang, 'logout'))
  }

  if (!isLoggedIn) {
    return (
      <>
        <Button
          variant="outline"
          className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-lg text-sm font-medium cursor-pointer transition-all"
          onClick={() => setAuthOpen(true)}
        >
          <User className="w-4 h-4 mr-2" />
          {t(lang, 'loginTitle')}
        </Button>
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          initialMode="login"
        />
      </>
    )
  }

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase() ?? 'U'

  const plan = (user as { plan?: string }).plan ?? 'free'

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 rounded-xl p-2">
          <DropdownMenuLabel className="px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user.name || user.email}
                </p>
                <Badge
                  variant={plan === 'free' ? 'secondary' : 'default'}
                  className={`text-xs mt-0.5 ${
                    plan === 'pro'
                      ? 'bg-emerald-600 text-white'
                      : plan === 'lifetime'
                        ? 'bg-amber-500 text-white'
                        : ''
                  }`}
                >
                  {plan === 'pro' && <Crown className="w-3 h-3 mr-1" />}
                  {plan === 'lifetime' && <Crown className="w-3 h-3 mr-1" />}
                  {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="px-3 py-2 text-sm text-muted-foreground">
            <span>{t(lang, 'remainingCvs')}</span>
            <span className="ml-auto font-medium text-foreground">
              {plan === 'free' ? '2/2' : '∞'}
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem className="px-3 py-2 text-sm text-muted-foreground">
            <span>{t(lang, 'remainingCls')}</span>
            <span className="ml-auto font-medium text-foreground">
              {plan === 'free' ? '1/1' : '∞'}
            </span>
          </DropdownMenuItem>

          {plan === 'free' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="px-3 py-2.5 text-sm font-semibold text-emerald-700 focus:text-emerald-700 focus:bg-emerald-50 cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault()
                  toast.info('Bientôt disponible')
                }}
              >
                <Crown className="w-4 h-4 mr-2 text-emerald-600" />
                {t(lang, 'upgradeToPro')}
              </DropdownMenuItem>
            </>
          )}

          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="px-3 py-2.5 text-sm font-semibold text-emerald-700 focus:text-emerald-700 focus:bg-emerald-50 cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault()
                  setAdminOpen(true)
                }}
              >
                <Shield className="w-4 h-4 mr-2" />
                Dashboard Admin
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="px-3 py-2.5 text-sm text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            onSelect={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t(lang, 'logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode="login"
      />

      <AdminDashboard isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
    </>
  )
}
