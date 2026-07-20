'use client'

import { useCVStore } from '@/store/cv-store'
import Landing from '@/components/cv/landing'
import CVForm from '@/components/cv/form'
import Generating from '@/components/cv/generating'
import Preview from '@/components/cv/preview'

export default function Home() {
  const { step } = useCVStore()

  return (
    <>
      {step === 'landing' && <Landing />}
      {step === 'form' && <CVForm />}
      {step === 'generating' && <Generating />}
      {step === 'preview' && <Preview />}
    </>
  )
}