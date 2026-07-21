import { create } from 'zustand'

export type AppStep = 'landing' | 'form' | 'generating' | 'preview'
export type TemplateStyle = 'modern' | 'classic' | 'creative'
export type CVLanguage = 'fr' | 'en' | 'ar' | 'es'

export interface FormData {
  fullName: string
  email: string
  phone: string
  address: string
  location: string
  linkedin: string
  website: string
  targetJob: string
  industry: string
  experience: string
  education: string
  skills: string
  languages: string
  summary: string
  photo: string
  dateOfBirth: string
  birthPlace: string
  birthCountry: string
  softSkills: string
}

export interface GeneratedCV {
  summary: string
  experience: Array<{
    title: string
    company: string
    period: string
    description: string
  }>
  education: Array<{
    degree: string
    school: string
    period: string
    description: string
  }>
  skills: string[]
  languages: Array<{ name: string; level: string }>
}

interface CVStore {
  step: AppStep
  formStep: number
  language: CVLanguage
  template: TemplateStyle
  formData: FormData
  generatedCV: GeneratedCV | null
  isGenerating: boolean
  error: string | null

  setStep: (step: AppStep) => void
  setFormStep: (step: number) => void
  setLanguage: (lang: CVLanguage) => void
  setTemplate: (template: TemplateStyle) => void
  updateFormData: (data: Partial<FormData>) => void
  setGeneratedCV: (cv: GeneratedCV | null) => void
  setIsGenerating: (val: boolean) => void
  setError: (err: string | null) => void
  reset: () => void
}

const initialFormData: FormData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  location: '',
  linkedin: '',
  website: '',
  targetJob: '',
  industry: '',
  experience: '',
  education: '',
  skills: '',
  languages: '',
  summary: '',
  photo: '',
  dateOfBirth: '',
  birthPlace: '',
  birthCountry: '',
  softSkills: '',
}

export const useCVStore = create<CVStore>((set) => ({
  step: 'landing',
  formStep: 0,
  language: 'fr',
  template: 'modern',
  formData: { ...initialFormData },
  generatedCV: null,
  isGenerating: false,
  error: null,

  setStep: (step) => set({ step }),
  setFormStep: (formStep) => set({ formStep }),
  setLanguage: (language) => set({ language }),
  setTemplate: (template) => set({ template }),
  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  setGeneratedCV: (generatedCV) => set({ generatedCV }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      step: 'landing',
      formStep: 0,
      template: 'modern',
      formData: { ...initialFormData },
      generatedCV: null,
      isGenerating: false,
      error: null,
    }),
}))