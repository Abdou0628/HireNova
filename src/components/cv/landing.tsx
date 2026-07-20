'use client'

import { motion } from 'framer-motion'
import { Sparkles, Globe, Shield, Palette, ArrowRight, FileText, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCVStore } from '@/store/cv-store'
import { t } from '@/lib/i18n'
import type { CVLanguage } from '@/lib/i18n'

const flagEmoji: Record<CVLanguage, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  ar: '🇸🇦',
}

const features = [
  { icon: Sparkles, titleKey: 'feature1Title' as const, descKey: 'feature1Desc' as const },
  { icon: Globe, titleKey: 'feature2Title' as const, descKey: 'feature2Desc' as const },
  { icon: Shield, titleKey: 'feature3Title' as const, descKey: 'feature3Desc' as const },
  { icon: Palette, titleKey: 'feature4Title' as const, descKey: 'feature4Desc' as const },
]

const stats = [
  { value: '50K+', label: { fr: 'CV générés', en: 'Resumes generated', ar: 'سير ذاتية تم إنشاؤها' } },
  { value: '95%', label: { fr: 'Taux de satisfaction', en: 'Satisfaction rate', ar: 'معدل الرضا' } },
  { value: '3', label: { fr: 'Langues', en: 'Languages', ar: 'لغات' } },
]

export default function Landing() {
  const { setStep, language, setLanguage } = useCVStore()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">{t(language, 'siteTitle')}</span>
          </div>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {(Object.keys(flagEmoji) as CVLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  language === lang
                    ? 'bg-white shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="mr-1">{flagEmoji[lang]}</span>
                <span className="hidden sm:inline">{lang.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-emerald-100/60 via-teal-50/40 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-amber-100/30 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200">
                  <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                  <span>{language === 'fr' ? 'Gratuit et sans inscription' : language === 'en' ? 'Free and no sign-up required' : 'مجاني وبدون تسجيل'}</span>
                </div>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {t(language, 'siteTitle')}
                <span className="block text-emerald-600 mt-2">{t(language, 'siteSubtitle')}</span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {t(language, 'siteDescription')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all cursor-pointer"
                  onClick={() => setStep('form')}
                >
                  {t(language, 'cta')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {stats.map((stat) => (
                <div key={stat.value} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label[language]}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.titleKey}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                        <feature.icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {t(language, feature.titleKey)}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(language, feature.descKey)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 lg:p-16"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                {language === 'fr'
                  ? 'Prêt à créer votre CV ?'
                  : language === 'en'
                    ? 'Ready to create your resume?'
                    : 'مستعد لإنشاء سيرتك الذاتية؟'}
              </h2>
              <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
                {language === 'fr'
                  ? 'En moins de 2 minutes, vous aurez un CV professionnel prêt à être envoyé.'
                  : language === 'en'
                    ? 'In less than 2 minutes, you\'ll have a professional resume ready to send.'
                    : 'في أقل من دقيقتين، ستكون لديك سيرة ذاتية احترافية جاهزة للإرسال.'}
              </p>
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg rounded-xl font-semibold shadow-lg transition-all cursor-pointer"
                onClick={() => setStep('form')}
              >
                {t(language, 'cta')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>{t(language, 'footerText')} &copy; {new Date().getFullYear()} CV Genius IA</p>
          <p className="flex items-center gap-1">
            {t(language, 'footerMadeWith')}{' '}
            <span className="text-emerald-600 font-semibold">Z.ai</span>
          </p>
        </div>
      </footer>
    </div>
  )
}