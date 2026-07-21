'use client'

import { SessionProvider } from 'next-auth/react'
import { useCVStore } from '@/store/cv-store'
import Landing from '@/components/cv/landing'
import CVForm from '@/components/cv/form'
import Generating from '@/components/cv/generating'
import Preview from '@/components/cv/preview'
import CoverLetterForm from '@/components/cl/cover-letter-form'
import CoverLetterGenerating from '@/components/cl/cover-letter-generating'
import CoverLetterPreview from '@/components/cl/cover-letter-preview'

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
    </SessionProvider>
  )
}
