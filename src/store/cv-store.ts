import { create } from 'zustand'

export type AppStep = 'landing' | 'form' | 'generating' | 'preview' | 'clForm' | 'clGenerating' | 'clPreview'
export type TemplateStyle = 'modern' | 'classic' | 'creative'
export type CVLanguage = 'fr' | 'en' | 'ar' | 'es'
export type PhotoPosition = 'left' | 'center' | 'right'
export type PersonaType = 'student' | 'graduate' | 'professional' | 'executive' | 'freelance' | 'expat'

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
  photoPosition: PhotoPosition
  // Cover letter fields collected in CV form
  companyName: string
  hiringManager: string
  clTone: 'formal' | 'semi-formal' | 'dynamic'
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

export interface CoverLetterFormData {
  fullName: string
  email: string
  phone: string
  address: string
  country: string
  location: string
  companyName: string
  hiringManager: string
  jobTitle: string
  jobReference: string
  whyCompany: string
  keyStrengths: string
  tone: 'formal' | 'semi-formal' | 'dynamic'
  additionalNotes: string
}

export interface GeneratedCoverLetter {
  subject: string
  greeting: string
  paragraphs: string[]
  signOff: string
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
  selectedPersona: PersonaType | null
  // Cover letter state
  clFormData: CoverLetterFormData
  generatedCL: GeneratedCoverLetter | null
  isCLGenerating: boolean
  clError: string | null

  setStep: (step: AppStep) => void
  setFormStep: (step: number) => void
  setLanguage: (lang: CVLanguage) => void
  setTemplate: (template: TemplateStyle) => void
  updateFormData: (data: Partial<FormData>) => void
  setGeneratedCV: (cv: GeneratedCV | null) => void
  setIsGenerating: (val: boolean) => void
  setError: (err: string | null) => void
  setSelectedPersona: (persona: PersonaType | null) => void
  updateCLFormData: (data: Partial<CoverLetterFormData>) => void
  setGeneratedCL: (cl: GeneratedCoverLetter | null) => void
  setIsCLGenerating: (val: boolean) => void
  setCLError: (err: string | null) => void
  resetCL: () => void
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
  photoPosition: 'center',
  companyName: '',
  hiringManager: '',
  clTone: 'semi-formal',
}

const initialCLFormData: CoverLetterFormData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  country: '',
  location: '',
  companyName: '',
  hiringManager: '',
  jobTitle: '',
  jobReference: '',
  whyCompany: '',
  keyStrengths: '',
  tone: 'semi-formal',
  additionalNotes: '',
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
  selectedPersona: null,
  // Cover letter
  clFormData: { ...initialCLFormData },
  generatedCL: null,
  isCLGenerating: false,
  clError: null,

  setStep: (step) => set({ step }),
  setFormStep: (formStep) => set({ formStep }),
  setLanguage: (language) => set({ language }),
  setTemplate: (template) => set({ template }),
  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  setGeneratedCV: (generatedCV) => set({ generatedCV }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
  setSelectedPersona: (selectedPersona) => set({ selectedPersona }),
  updateCLFormData: (data) =>
    set((state) => ({ clFormData: { ...state.clFormData, ...data } })),
  setGeneratedCL: (generatedCL) => set({ generatedCL }),
  setIsCLGenerating: (isCLGenerating) => set({ isCLGenerating }),
  setCLError: (clError) => set({ clError }),
  resetCL: () =>
    set({
      step: 'landing',
      clFormData: { ...initialCLFormData },
      generatedCL: null,
      isCLGenerating: false,
      clError: null,
    }),
  reset: () =>
    set({
      step: 'landing',
      formStep: 0,
      template: 'modern',
      formData: { ...initialFormData },
      generatedCV: null,
      isGenerating: false,
      error: null,
      selectedPersona: null,
      clFormData: { ...initialCLFormData },
      generatedCL: null,
      isCLGenerating: false,
      clError: null,
    }),
}))