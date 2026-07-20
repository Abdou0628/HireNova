'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useCVStore } from '@/store/cv-store'
import { t } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Download, RotateCcw, FileText, CheckCircle2 } from 'lucide-react'
import CVDocument from './cv-document'

export default function Preview() {
  const { formData, generatedCV, template, language, setStep, reset } = useCVStore()
  const cvRef = useRef<HTMLDivElement>(null)

  function handleDownloadPDF() {
    const printWindow = window.open('', '_blank')
    if (!printWindow || !cvRef.current) return

    const cvHTML = cvRef.current.innerHTML

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CV - ${formData.fullName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            -webkit-font-smoothing: antialiased;
          }
          @media print {
            @page { margin: 0; size: A4; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
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
        <\/script>
      </head>
      <body>
        <div style="max-width: 210mm; margin: 0 auto;">
          ${cvHTML}
        </div>
        <script>
          setTimeout(() => { window.print(); }, 800);
        <\/script>
      </body>
      </html>
    `)
    printWindow.document.close()
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
                <span className="font-medium">{t(language, 'previewTitle')}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                reset()
              }}
              className="gap-1.5 cursor-pointer text-xs sm:text-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t(language, 'startOver')}</span>
            </Button>
            <Button
              onClick={handleDownloadPDF}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer text-xs sm:text-sm"
              size="sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t(language, 'downloadPdf')}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* CV Preview */}
      <main className="flex-1 py-8 px-4 sm:px-6">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* CV Container */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div ref={cvRef}>
              <CVDocument
                formData={formData}
                generatedCV={generatedCV}
                template={template}
              />
            </div>
          </div>

          {/* Bottom action - mobile friendly */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={handleDownloadPDF}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-8 py-6 text-base rounded-xl shadow-lg shadow-emerald-600/25 cursor-pointer w-full sm:w-auto"
              size="lg"
            >
              <Download className="w-5 h-5" />
              {t(language, 'downloadPdf')}
            </Button>
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
          {t(language, 'footerText')} &copy; {new Date().getFullYear()} CV Genius IA
        </div>
      </footer>
    </div>
  )
}