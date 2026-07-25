'use client'

import { SessionProvider } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { useCVStore } from '@/store/cv-store'

const Landing = dynamic(() => import('@/components/cv/landing'), { ssr: false })
const CVForm = dynamic(() => import('@/components/cv/form'), { ssr: false })
const Generating = dynamic(() => import('@/components/cv/generating'), { ssr: false })
const Preview = dynamic(() => import('@/components/cv/preview'), { ssr: false })
const CoverLetterForm = dynamic(() => import('@/components/cl/cover-letter-form'), { ssr: false })
const CoverLetterGenerating = dynamic(() => import('@/components/cl/cover-letter-generating'), { ssr: false })
const CoverLetterPreview = dynamic(() => import('@/components/cl/cover-letter-preview'), { ssr: false })

// Jobs components
const JobMarket = dynamic(() => import('@/components/jobs/job-market'), { ssr: false })
const JobDetail = dynamic(() => import('@/components/jobs/job-detail'), { ssr: false })
const JobApply = dynamic(() => import('@/components/jobs/job-apply'), { ssr: false })
const EmployerDashboard = dynamic(() => import('@/components/jobs/employer-dashboard'), { ssr: false })
const EmployerPostJob = dynamic(() => import('@/components/jobs/employer-post-job'), { ssr: false })
const CandidateApplications = dynamic(() => import('@/components/jobs/candidate-applications'), { ssr: false })

// API components
const ApiDocs = dynamic(() => import('@/components/api/api-docs'), { ssr: false })
const ApiRegister = dynamic(() => import('@/components/api/api-register'), { ssr: false })
const ApiDashboard = dynamic(() => import('@/components/api/api-dashboard'), { ssr: false })

export default function Home() {
  const { step } = useCVStore()

  return (
    <SessionProvider>
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
    </SessionProvider>
  )
}
