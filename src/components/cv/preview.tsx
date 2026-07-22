'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCVStore } from '@/store/cv-store'
import { t } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Download,
  RotateCcw,
  FileText,
  CheckCircle2,
  PenLine,
  FileDown,
  ChevronDown,
} from 'lucide-react'
import CVDocument from './cv-document'
import CoverLetterDocument from '@/components/cl/cover-letter-document'

type PreviewTab = 'cv' | 'cl'

export default function Preview() {
  const {
    formData,
    generatedCV,
    generatedCL,
    template,
    language,
    setStep,
    reset,
    clFormData,
  } = useCVStore()

  const [activeTab, setActiveTab] = useState<PreviewTab>(
    generatedCL ? 'cv' : 'cv'
  )
  const cvRef = useRef<HTMLDivElement>(null)
  const clRef = useRef<HTMLDivElement>(null)
  const hasCL = !!generatedCL

  function handleDownloadPDF(type: 'cv' | 'cl') {
    const ref = type === 'cv' ? cvRef : clRef
    const title = type === 'cv'
      ? `CV - ${formData.fullName}`
      : `Lettre - ${clFormData.fullName || formData.fullName}`

    const printWindow = window.open('', '_blank')
    if (!printWindow || !ref.current) return

    const html = ref.current.innerHTML

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            -webkit-font-smoothing: antialiased;
          }
          @media print {
            @page { margin: ${type === 'cl' ? '15mm' : '0'}; size: A4; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
          ${type === 'cv' ? `
          <script src="https://cdn.tailwindcss.com"><\/script>
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    sans: ['Inter', 'system-ui', 'sans-serif'],
                  },
                },
              },
            }
          <\/script>` : ''}
        </style>
      </head>
      <body>
        <div style="max-width: 210mm; margin: 0 auto;">
          ${html}
        </div>
        <script>
          setTimeout(() => { window.print(); }, 800);
        <\/script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  function handleDownloadWord(type: 'cv' | 'cl') {
    const ref = type === 'cv' ? cvRef : clRef
    const filename = type === 'cv'
      ? `CV_${formData.fullName.replace(/\s+/g, '_')}.doc`
      : `Lettre_${(clFormData.fullName || formData.fullName).replace(/\s+/g, '_')}.doc`

    if (!ref.current) return
    const html = ref.current.innerHTML
    const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${filename}</title>
      <style>
        @page { margin: ${type === 'cl' ? '15mm' : '0'}; size: A4; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
        ${type === 'cv' ? 'img { max-width: 100%; }' : ''}
      </style>
    </head>
    <body>${html}</body>
    </html>`
    const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!generatedCV) return null

  return (
    <div className="min-h-screen flex flex-col bg-stone-100">
      {/* Top bar */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-semibold text-foreground text-sm">{t(language, 'siteTitle')}</span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="font-medium">
                  {hasCL ? t(language, 'cvAndClReady') : t(language, 'previewTitle')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => reset()}
              className="gap-1.5 cursor-pointer text-xs sm:text-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t(language, 'startOver')}</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer text-xs sm:text-sm" size="sm">
                  <Download className="w-3.5 h-3.5" />
                  <span>{t(language, 'downloadFormat')}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDownloadPDF('cv')} className="gap-2 cursor-pointer">
                  <FileDown className="w-4 h-4" />
                  {t(language, 'tabCv')} - {t(language, 'downloadPdf')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownloadWord('cv')} className="gap-2 cursor-pointer">
                  <FileDown className="w-4 h-4" />
                  {t(language, 'tabCv')} - {t(language, 'downloadWord')}
                </DropdownMenuItem>
                {hasCL && (
                  <>
                    <div className="h-px my-1 bg-muted" />
                    <DropdownMenuItem onClick={() => handleDownloadPDF('cl')} className="gap-2 cursor-pointer">
                      <FileDown className="w-4 h-4" />
                      {t(language, 'tabCoverLetter')} - {t(language, 'downloadPdf')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownloadWord('cl')} className="gap-2 cursor-pointer">
                      <FileDown className="w-4 h-4" />
                      {t(language, 'tabCoverLetter')} - {t(language, 'downloadWord')}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Document Preview */}
      <main className="flex-1 py-8 px-4 sm:px-6">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Tab Navigation */}
          {hasCL && (
            <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm mb-6 max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('cv')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === 'cv'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <FileText className="w-4 h-4" />
                {t(language, 'tabCv')}
              </button>
              <button
                onClick={() => setActiveTab('cl')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === 'cl'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <PenLine className="w-4 h-4" />
                {t(language, 'tabCoverLetter')}
              </button>
            </div>
          )}

          {/* Document Container */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'cv' && (
                <motion.div
                  key="cv-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div ref={cvRef}>
                    <CVDocument
                      formData={formData}
                      generatedCV={generatedCV}
                      template={template}
                    />
                  </div>
                </motion.div>
              )}
              {activeTab === 'cl' && hasCL && (
                <motion.div
                  key="cl-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div ref={clRef}>
                    <CoverLetterDocument
                      clFormData={{
                        fullName: clFormData.fullName || formData.fullName,
                        email: clFormData.email || formData.email,
                        phone: clFormData.phone || formData.phone,
                        address: clFormData.address || formData.address,
                        country: clFormData.country || '',
                        location: clFormData.location || formData.location,
                        companyName: clFormData.companyName || formData.companyName,
                        hiringManager: clFormData.hiringManager || formData.hiringManager,
                      }}
                      generatedCL={generatedCL}
                      lang={language}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
            <Button
              onClick={() => handleDownloadPDF(activeTab)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-8 py-6 text-base rounded-xl shadow-lg shadow-emerald-600/25 cursor-pointer w-full sm:w-auto"
              size="lg"
            >
              <Download className="w-5 h-5" />
              {activeTab === 'cv' ? t(language, 'tabCv') : t(language, 'tabCoverLetter')} - {t(language, 'downloadPdf')}
            </Button>
            <Button
              onClick={() => handleDownloadWord(activeTab)}
              variant="outline"
              className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 gap-2 px-6 py-6 rounded-xl cursor-pointer w-full sm:w-auto"
              size="lg"
            >
              <FileDown className="w-5 h-5" />
              {activeTab === 'cv' ? t(language, 'tabCv') : t(language, 'tabCoverLetter')} - {t(language, 'downloadWord')}
            </Button>
            {hasCL && (
              <Button
                variant="outline"
                onClick={() => setActiveTab(activeTab === 'cv' ? 'cl' : 'cv')}
                className="gap-2 px-6 py-6 rounded-xl cursor-pointer w-full sm:w-auto"
                size="lg"
              >
                {activeTab === 'cv' ? <PenLine className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                {activeTab === 'cv' ? t(language, 'tabCoverLetter') : t(language, 'tabCv')}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => reset()}
              className="gap-2 px-6 py-6 rounded-xl cursor-pointer w-full sm:w-auto"
              size="lg"
            >
              <RotateCcw className="w-5 h-5" />
              {t(language, 'startOver')}
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center text-sm text-muted-foreground">
          {t(language, 'footerText')} &copy; 2026 CV Genius IA — <span className="font-medium text-foreground">Abdellah Bazhani</span>
        </div>
      </footer>
    </div>
  )
}