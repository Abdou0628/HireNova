'use client'

import { SessionProvider } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'
import { useCVStore } from '@/store/cv-store'
import ErrorBoundary from '@/components/error-boundary'
import AnalyticsBootstrap from '@/components/analytics-bootstrap'
import { events } from '@/lib/analytics'

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-emerald-50/30">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    </div>
  )
}

const Landing = dynamic(() => import('@/components/cv/landing'), { ssr: false, loading: () => <Loading /> })
const CVForm = dynamic(() => import('@/components/cv/form'), { ssr: false, loading: () => <Loading /> })
const Generating = dynamic(() => import('@/components/cv/generating'), { ssr: false, loading: () => <Loading /> })
const Preview = dynamic(() => import('@/components/cv/preview'), { ssr: false, loading: () => <Loading /> })
const CoverLetterForm = dynamic(() => import('@/components/cl/cover-letter-form'), { ssr: false, loading: () => <Loading /> })
const CoverLetterGenerating = dynamic(() => import('@/components/cl/cover-letter-generating'), { ssr: false, loading: () => <Loading /> })
const CoverLetterPreview = dynamic(() => import('@/components/cl/cover-letter-preview'), { ssr: false, loading: () => <Loading /> })

// Jobs Marketplace
const JobMarket = dynamic(() => import('@/components/jobs/job-market'), { ssr: false, loading: () => <Loading /> })
const JobDetail = dynamic(() => import('@/components/jobs/job-detail'), { ssr: false, loading: () => <Loading /> })
const JobApply = dynamic(() => import('@/components/jobs/job-apply'), { ssr: false, loading: () => <Loading /> })
const EmployerDashboard = dynamic(() => import('@/components/jobs/employer-dashboard'), { ssr: false, loading: () => <Loading /> })
const EmployerPostJob = dynamic(() => import('@/components/jobs/employer-post-job'), { ssr: false, loading: () => <Loading /> })
const CandidateApplications = dynamic(() => import('@/components/jobs/candidate-applications'), { ssr: false, loading: () => <Loading /> })

// API Portal
const ApiDocs = dynamic(() => import('@/components/api/api-docs'), { ssr: false, loading: () => <Loading /> })
const ApiRegister = dynamic(() => import('@/components/api/api-register'), { ssr: false, loading: () => <Loading /> })
const ApiDashboard = dynamic(() => import('@/components/api/api-dashboard'), { ssr: false, loading: () => <Loading /> })

// HireNova Global — International Recruitment
const GlobalMarket = dynamic(() => import('@/components/global/global-market'), { ssr: false, loading: () => <Loading /> })
const GlobalJobDetail = dynamic(() => import('@/components/global/global-job-detail'), { ssr: false, loading: () => <Loading /> })
const GlobalApply = dynamic(() => import('@/components/global/global-apply'), { ssr: false, loading: () => <Loading /> })
const GlobalEmployerDashboard = dynamic(() => import('@/components/global/global-employer-dashboard'), { ssr: false, loading: () => <Loading /> })
const GlobalPostJob = dynamic(() => import('@/components/global/global-post-job'), { ssr: false, loading: () => <Loading /> })


// Programme Parrainage
const ReferralDashboard = dynamic(() => import('@/components/referral/referral-dashboard'), { ssr: false, loading: () => <Loading /> })
// HireNova Campus
const CampusKit = dynamic(() => import('@/components/campus/campus-kit'), { ssr: false, loading: () => <Loading /> })
// HireNova Mobilité — OCR + NLP Pipeline
const MobilityHome = dynamic(() => import('@/components/mobility/mobility-home'), { ssr: false, loading: () => <Loading /> })
const MobilityUpload = dynamic(() => import('@/components/mobility/mobility-upload'), { ssr: false, loading: () => <Loading /> })
const MobilityProfile = dynamic(() => import('@/components/mobility/mobility-profile'), { ssr: false, loading: () => <Loading /> })
const MobilityResult = dynamic(() => import('@/components/mobility/mobility-result'), { ssr: false, loading: () => <Loading /> })

export default function Home() {
  const { step } = useCVStore()

  return (
    <SessionProvider>
      <AnalyticsBootstrap />
      <ErrorBoundary stepName="HireNova">
        {step === 'landing' && <Landing />}
        {step === 'form' && <CVForm />}
        {step === 'generating' && <Generating />}
        {step === 'preview' && <Preview />}
        {step === 'clForm' && <CoverLetterForm />}
        {step === 'clGenerating' && <CoverLetterGenerating />}
        {step === 'clPreview' && <CoverLetterPreview />}

        {/* Jobs Marketplace */}
        {step === 'jobMarket' && <JobMarket />}
        {step === 'jobDetail' && <JobDetail />}
        {step === 'jobApply' && <JobApply />}
        {step === 'employerDashboard' && <EmployerDashboard />}
        {step === 'employerPostJob' && <EmployerPostJob />}
        {step === 'candidateApplications' && <CandidateApplications />}

        {/* API Portal */}
        {step === 'apiDocs' && <ApiDocs />}
        {step === 'apiRegister' && <ApiRegister />}
        {step === 'apiDashboard' && <ApiDashboard />}

        {/* HireNova Global */}
        {step === 'globalMarket' && <GlobalMarket />}
        {step === 'globalJobDetail' && <GlobalJobDetail />}
        {step === 'globalApply' && <GlobalApply />}
        {step === 'globalEmployerDashboard' && <GlobalEmployerDashboard />}
        {step === 'globalPostJob' && <GlobalPostJob />}

        {/* HireNova Mobilité */}
        {step === 'mobilityHome' && <MobilityHome />}
        {step === 'mobilityUpload' && <MobilityUpload />}
        {step === 'mobilityProfile' && <MobilityProfile />}
        {step === 'mobilityResult' && <MobilityResult />}
        {/* Programme Parrainage */}
        {step === 'referral' && <ReferralDashboard />}
        {/* HireNova Campus */}
        {step === 'campus' && <CampusKit />}
      </ErrorBoundary>
    </SessionProvider>
  )
}
