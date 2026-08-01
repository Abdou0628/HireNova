'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Brain, Network, Zap, Clock, Globe, Link2, ArrowRightLeft,
  ChevronRight, Activity, FileText, Search, MessageCircle, Linkedin,
  UserCheck, Compass, Bot, BookOpen, Laptop, Briefcase, Code2, Plane,
  GraduationCap, Store, Building2, Scale, MessageSquare, Shield, Cpu,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useCVStore } from '@/store/cv-store'
import { t } from '@/lib/i18n'
import {
  AGENTS, CTO_PRINCIPAL, getAgentsByCategory, CATEGORY_BG,
  type AgentDefinition, type AgentCategory, type AgentTier,
} from '@/lib/agent-registry'

const ICON_MAP: Record<string, React.ElementType> = {
  FileText, Search, MessageCircle, Linkedin, UserCheck, Compass, Bot, BookOpen,
  Briefcase, Laptop, Globe, Code2, Brain, Plane, MessageSquare,
  GraduationCap, Store, Building2, Scale, Network,
}

const TIER_COLORS: Record<AgentTier, string> = {
  principal: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
  specialized: 'bg-white text-foreground border shadow-sm',
  support: 'bg-slate-100 text-slate-700',
}

const TIER_BADGE: Record<AgentTier, { label: Record<string, string>; variant: 'default' | 'secondary' | 'outline' }> = {
  principal: { label: { fr: 'NIVEAU 0', en: 'LEVEL 0', ar: 'المستوى 0', es: 'NIVEL 0' }, variant: 'default' },
  specialized: { label: { fr: 'NIVEAU 1', en: 'LEVEL 1', ar: 'المستوى 1', es: 'NIVEL 1' }, variant: 'secondary' },
  support: { label: { fr: 'NIVEAU 2', en: 'LEVEL 2', ar: 'المستوى 2', es: 'NIVEL 2' }, variant: 'outline' },
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-500',
  idle: 'bg-slate-400',
  processing: 'bg-amber-500 animate-pulse',
  collaborating: 'bg-violet-500 animate-pulse',
}

function AgentCard({ agent, language, index }: { agent: AgentDefinition; language: string; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = ICON_MAP[agent.icon] ?? Cpu
  const tierBadge = TIER_BADGE[agent.tier]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Card
        className={`cursor-pointer transition-all hover:shadow-lg border-l-4 border-l-${agent.color}-500 ${expanded ? 'ring-2 ring-' + agent.color + '-300' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${agent.color}-100 text-${agent.color}-600 shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">{agent.name}</span>
                <Badge variant={tierBadge.variant} className="text-[10px] px-1.5 py-0">
                  {tierBadge.label[language] ?? tierBadge.label.fr}
                </Badge>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto shrink-0">
                  <span className={`w-2 h-2 rounded-full ${STATUS_COLORS.active}`} />
                  {agent.avgResponseTime}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {agent.description[language as 'fr' | 'en' | 'ar' | 'es'] ?? agent.description.fr}
              </p>
            </div>
            <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </div>

          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-t"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    {t(language as 'fr' | 'en' | 'ar' | 'es', 'orchAgentCapabilities')}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.map(cap => (
                      <Badge key={cap.key} variant="outline" className="text-[10px]">
                        {cap.label[language as 'fr' | 'en' | 'ar' | 'es'] ?? cap.label.fr}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    {t(language as 'fr' | 'en' | 'ar' | 'es', 'orchAgentCollabs')}
                  </h4>
                  {agent.collaborations.length === 0 ? (
                    <span className="text-[10px] text-muted-foreground italic">Universal interface</span>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {agent.collaborations.map((collab, i) => {
                        const partner = AGENTS.find(a => a.id === collab.agentId)
                        return (
                          <div key={i} className="flex items-center gap-1 text-[10px]">
                            {collab.type === 'bidirectional' ? (
                              <ArrowRightLeft className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <ArrowRight className="w-3 h-3 text-sky-500" />
                            )}
                            <span className="font-medium">{partner?.name ?? collab.agentId}</span>
                            <span className="text-muted-foreground">— {collab.reason[language as 'fr' | 'en' | 'ar' | 'es'] ?? collab.reason.fr}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function CtoNode({ language }: { language: string }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="flex flex-col items-center"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
        <Brain className="w-10 h-10 text-white" />
      </div>
      <h3 className="mt-2 font-bold text-sm">{t(language as 'fr' | 'en' | 'ar' | 'es', 'orchCtoName')}</h3>
      <p className="text-[10px] text-emerald-600 font-medium">{t(language as 'fr' | 'en' | 'ar' | 'es', 'orchCtoRole')}</p>
    </motion.div>
  )
}

function ConnectorLine() {
  return <div className="w-px h-6 bg-gradient-to-b from-emerald-400 to-transparent mx-auto" />
}

function CategorySection({
  category,
  language,
  agents,
  index,
}: {
  category: AgentCategory
  language: string
  agents: AgentDefinition[]
  index: number
}) {
  const categoryKey = category === 'candidate' ? 'orchCategoryCandidate'
    : category === 'employment' ? 'orchCategoryEmployment'
    : 'orchCategoryPlatform'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.15 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <div className={`h-px flex-1 bg-gradient-to-r from-transparent via-${CATEGORY_BG[category].split(' ')[0]} to-transparent`} />
        <h3 className="text-sm font-bold px-3 py-1 rounded-full border ${CATEGORY_BG[category]}">
          {t(language as 'fr' | 'en' | 'ar' | 'es', categoryKey as 'orchCategoryCandidate' | 'orchCategoryEmployment' | 'orchCategoryPlatform')}
          <span className="ml-1.5 text-muted-foreground font-normal">({agents.length})</span>
        </h3>
        <div className={`h-px flex-1 bg-gradient-to-r from-transparent via-${CATEGORY_BG[category].split(' ')[0]} to-transparent`} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {agents.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} language={language} index={i} />
        ))}
      </div>
    </motion.div>
  )
}

function StatsPanel({ language }: { language: string }) {
  const totalCapabilities = AGENTS.reduce((sum, a) => sum + a.capabilities.length, 0)
  const totalCollabs = AGENTS.reduce((sum, a) => sum + a.collaborations.length, 0)
  const avgResponse = (AGENTS.reduce((sum, a) => sum + parseFloat(a.avgResponseTime), 0) / AGENTS.length).toFixed(1)
  const bidirCount = AGENTS.reduce((sum, a) => sum + a.collaborations.filter(c => c.type === 'bidirectional').length, 0)
  const unidirCount = totalCollabs - bidirCount

  const stats = [
    { icon: Cpu, label: t(language as 'fr' | 'en' | 'ar' | 'es', 'orchStatsAgents'), value: '19', color: 'text-emerald-600' },
    { icon: Zap, label: t(language as 'fr' | 'en' | 'ar' | 'es', 'orchStatsCapabilities'), value: String(totalCapabilities), color: 'text-amber-600' },
    { icon: Link2, label: t(language as 'fr' | 'en' | 'ar' | 'es', 'orchStatsCollabs'), value: String(totalCollabs), color: 'text-violet-600' },
    { icon: Clock, label: t(language as 'fr' | 'en' | 'ar' | 'es', 'orchStatsAvgResponse'), value: `${avgResponse}s`, color: 'text-sky-600' },
    { icon: Globe, label: t(language as 'fr' | 'en' | 'ar' | 'es', 'orchStatsLanguages'), value: '4', color: 'text-rose-600' },
    { icon: Activity, label: t(language as 'fr' | 'en' | 'ar' | 'es', 'orchStatsUptime'), value: '99.9%', color: 'text-teal-600' },
  ]

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          {t(language as 'fr' | 'en' | 'ar' | 'es', 'orchStatsTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map(stat => {
            const SIcon = stat.icon
            return (
              <div key={stat.label} className="text-center">
                <SIcon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground">{stat.label}</div>
              </div>
            )
          })}
        </div>
        {/* Speed indicator */}
        <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {t(language as 'fr' | 'en' | 'ar' | 'es', 'orchSpeedTitle')}
            </span>
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-500 mt-1">
            {t(language as 'fr' | 'en' | 'ar' | 'es', 'orchSpeedDesc')}
          </p>
          <Progress value={92} className="mt-2 h-1.5" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function OrchestrationHub() {
  const { language, setStep } = useCVStore()
  const lang = language

  const candidateAgents = useMemo(() => getAgentsByCategory('candidate'), [])
  const employmentAgents = useMemo(() => getAgentsByCategory('employment'), [])
  const platformAgents = useMemo(() => getAgentsByCategory('platform'), [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setStep('landing')} className="shrink-0">
            <ArrowLeft className="w-4 h-4" />
            <span className="ml-1.5 hidden sm:inline">{t(lang, 'orchBack')}</span>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm sm:text-base font-bold truncate">{t(lang, 'orchTitle')}</h1>
            <p className="text-[10px] text-muted-foreground hidden sm:block truncate">{t(lang, 'orchSubtitle')}</p>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shrink-0">
            <Shield className="w-3 h-3 mr-1" />
            19 Agents
          </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <StatsPanel language={lang} />

        {/* CTO Principal Node */}
        <div className="flex flex-col items-center">
          <CtoNode language={lang} />
          <ConnectorLine />
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-8 bg-emerald-300" />
            <Network className="w-4 h-4 text-emerald-500" />
            <div className="h-px w-8 bg-emerald-300" />
          </div>
        </div>

        {/* Tabs for 3 views */}
        <Tabs defaultValue="hub" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hub">{t(lang, 'orchTabHub')}</TabsTrigger>
            <TabsTrigger value="dispatch">{t(lang, 'orchTabDispatch')}</TabsTrigger>
            <TabsTrigger value="collab">{t(lang, 'orchTabCollab')}</TabsTrigger>
          </TabsList>

          <TabsContent value="hub" className="mt-6 space-y-6">
            {/* Category: Candidate */}
            <CategorySection category="candidate" language={lang} agents={candidateAgents} index={0} />
            {/* Category: Employment */}
            <CategorySection category="employment" language={lang} agents={employmentAgents} index={1} />
            {/* Category: Platform */}
            <CategorySection category="platform" language={lang} agents={platformAgents} index={2} />
          </TabsContent>

          <TabsContent value="dispatch" className="mt-6">
            <OrchestrationDispatch language={lang} />
          </TabsContent>

          <TabsContent value="collab" className="mt-6">
            <CollaborationMatrix language={lang} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

// ==========================================================
// Dispatch Component
// ==========================================================
function OrchestrationDispatch({ language }: { language: string }) {
  const { language: storeLang, setStep } = useCVStore()
  const [message, setMessage] = useState('')
  const [isDispatching, setIsDispatching] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  async function handleDispatch() {
    if (!message.trim()) return
    setIsDispatching(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch('/api/orchestration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language: storeLang }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setIsDispatching(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleDispatch()
    }
  }

  function navigateToAgent(step: string | null) {
    if (step) setStep(step as any)
  }

  const IconMap = ICON_MAP
  const modeLabels: Record<string, string> = {
    solo: t(storeLang, 'orchDispatchSolo'),
    sequential: t(storeLang, 'orchDispatchSequential'),
    parallel: t(storeLang, 'orchDispatchParallel'),
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600" />
            {t(storeLang, 'orchDispatchTitle')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t(storeLang, 'orchDispatchSubtitle')}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t(storeLang, 'orchDispatchPlaceholder')}
              className="w-full min-h-[80px] p-4 pr-24 rounded-lg border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
              disabled={isDispatching}
            />
            <Button
              onClick={handleDispatch}
              disabled={isDispatching || !message.trim()}
              className="absolute bottom-3 right-3"
              size="sm"
            >
              {isDispatching ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
                {t(storeLang, 'orchDispatchAnalyzing')}</>
              ) : (
                <><Zap className="w-4 h-4 mr-1.5" />{t(storeLang, 'orchDispatchSend')}</>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dispatch Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  {t(storeLang, 'orchDispatchResult')}
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono">{result.requestId}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Classification Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="text-[10px] text-muted-foreground uppercase mb-1">{t(storeLang, 'orchDispatchIntent')}</div>
                  <div className="text-xs font-medium">{result.classifiedIntent}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="text-[10px] text-muted-foreground uppercase mb-1">{t(storeLang, 'orchDispatchMode')}</div>
                  <Badge variant="secondary" className="text-xs">
                    {modeLabels[result.collaborationMode] ?? result.collaborationMode}
                  </Badge>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="text-[10px] text-muted-foreground uppercase mb-1">{t(storeLang, 'orchDispatchEstimated')}</div>
                  <div className="text-xs font-bold text-emerald-600">{result.estimatedTime}</div>
                </div>
              </div>

              {/* Primary Agent */}
              <div>
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">{t(storeLang, 'orchDispatchPrimary')}</h4>
                <Card className="border-l-4 border-l-emerald-500" onClick={() => navigateToAgent(result.primaryAgent?.step)}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      {(() => { const Ic = IconMap[result.primaryAgent?.icon] ?? Cpu; return <Ic className="w-4 h-4" /> })()}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{result.primaryAgent?.name}</div>
                      <div className="text-[10px] text-muted-foreground">{result.primaryAgent?.module}</div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">{result.primaryAgent?.avgResponseTime}</Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Secondary Agents */}
              {result.secondaryAgents?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">{t(storeLang, 'orchDispatchSecondary')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.secondaryAgents.map((agent: any, i: number) => (
                      <Card key={i} className="border-l-4 border-l-violet-400" onClick={() => navigateToAgent(agent?.step)}>
                        <CardContent className="p-3 flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-violet-100 text-violet-600 flex items-center justify-center">
                            {(() => { const Ic = IconMap[agent?.icon] ?? Cpu; return <Ic className="w-3.5 h-3.5" /> })()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium truncate">{agent?.name}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{agent?.module}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Response */}
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 mb-1">{t(storeLang, 'orchDispatchResponse')}</div>
                <p className="text-sm text-emerald-800 dark:text-emerald-300">{result.response}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

// ==========================================================
// Collaboration Matrix Component
// ==========================================================
function CollaborationMatrix({ language }: { language: string }) {
  const { setStep } = useCVStore()

  const allCollabs = useMemo(() => {
    const links: { from: AgentDefinition; to: AgentDefinition; type: string; reason: Record<string, string> }[] = []
    for (const agent of AGENTS) {
      for (const collab of agent.collaborations) {
        const partner = AGENTS.find(a => a.id === collab.agentId)
        if (partner) {
          links.push({ from: agent, to: partner, type: collab.type, reason: collab.reason })
        }
      }
    }
    return links
  }, [])

  const totalCollabs = allCollabs.length
  const bidir = allCollabs.filter(c => c.type === 'bidirectional').length
  const unidir = totalCollabs - bidir

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Network className="w-5 h-5 text-violet-600" />
            {t(language as 'fr' | 'en' | 'ar' | 'es', 'orchCollabTitle')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t(language as 'fr' | 'en' | 'ar' | 'es', 'orchCollabSubtitle')}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 rounded-lg bg-violet-50 dark:bg-violet-950/30">
              <div className="text-2xl font-bold text-violet-600">{totalCollabs}</div>
              <div className="text-[10px] text-muted-foreground">{t(language as 'fr' | 'en' | 'ar' | 'es', 'orchCollabTotal')}</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <div className="text-2xl font-bold text-emerald-600">{bidir}</div>
              <div className="text-[10px] text-muted-foreground">{t(language as 'fr' | 'en' | 'ar' | 'es', 'orchCollabBidir')}</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-sky-50 dark:bg-sky-950/30">
              <div className="text-2xl font-bold text-sky-600">{unidir}</div>
              <div className="text-[10px] text-muted-foreground">{t(language as 'fr' | 'en' | 'ar' | 'es', 'orchCollabUnidir')}</div>
            </div>
          </div>

          {/* Collaboration Links List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {allCollabs.map((link, i) => {
              const FromIcon = ICON_MAP[link.from.icon] ?? Cpu
              const ToIcon = ICON_MAP[link.to.icon] ?? Cpu
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <FromIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium min-w-0 truncate max-w-[120px]">{link.from.name}</span>
                  {link.type === 'bidirectional' ? (
                    <ArrowRightLeft className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-sky-500 shrink-0" />
                  )}
                  <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <ToIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium min-w-0 truncate max-w-[120px]">{link.to.name}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto shrink-0 hidden sm:inline">
                    {link.reason[language as 'fr' | 'en' | 'ar' | 'es'] ?? link.reason.fr}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
