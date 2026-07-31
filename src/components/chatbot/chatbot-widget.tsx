'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { events } from '@/lib/analytics'
import { t } from '@/lib/i18n'
import type { CVLanguage } from '@/lib/i18n'
import { useCVStore } from '@/store/cv-store'

type ChatMode = 'advisor' | 'support' | 'products'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const MODE_TABS: { mode: ChatMode; icon: string; labelKey: 'chatbotModeAdvisor' | 'chatbotModeSupport' | 'chatbotModeProducts'; welcomeKey: 'chatbotAdvisorTitle' | 'chatbotSupportTitle' | 'chatbotProductsTitle' }[] = [
  { mode: 'advisor', icon: '🎓', labelKey: 'chatbotModeAdvisor', welcomeKey: 'chatbotAdvisorTitle' },
  { mode: 'support', icon: '🛠️', labelKey: 'chatbotModeSupport', welcomeKey: 'chatbotSupportTitle' },
  { mode: 'products', icon: '📦', labelKey: 'chatbotModeProducts', welcomeKey: 'chatbotProductsTitle' },
]

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<ChatMode>('advisor')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lang = useCVStore(s => s.nuage)

  const isRTL = lang === 'ar'

  const getWelcomeMessage = (m: ChatMode): string => {
    const tab = MODE_TABS.find(t2 => t2.mode === m)
    if (!tab) return ''
    const name = t(lang, tab.welcomeKey)
    const greetings: Record<CVLanguage, string> = {
      fr: `${name} 👋 Comment puis-je vous aider ?`,
      en: `${name} 👋 How can I help you?`,
      ar: `${name} 👋 كيف يمكنني مساعدتك؟`,
      es: `${name} 👋 ¿Cómo puedo ayudarte?`,
    }
    return greetings[lang]
  }

  const placeholderText: Record<CVLanguage, string> = {
    fr: 'Écrivez votre message...',
    en: 'Type your message...',
    ar: 'اكتب رسالتك...',
    es: 'Escribe tu mensaje...',
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: getWelcomeMessage(mode) }])
    }
  }, [isOpen, mode])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)
    events.chatbotMessageSent(mode)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          mode,
          conversationHistory: messages.slice(-6)
        })
      })
      const data = await res.json()
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      } else {
        const errMsg: Record<CVLanguage, string> = {
          fr: 'Désolé, une erreur est survenue.',
          en: 'Sorry, an error occurred.',
          ar: 'عذراً، حدث خطأ.',
          es: 'Lo siento, ocurrió un error.',
        }
        setMessages(prev => [...prev, { role: 'assistant', content: errMsg[lang] }])
      }
    } catch {
      const connErr: Record<CVLanguage, string> = {
        fr: 'Erreur de connexion. Réessayez.',
        en: 'Connection error. Please retry.',
        ar: 'خطأ في الاتصال. حاول مرة أخرى.',
        es: 'Error de conexión. Intenta de nuevo.',
      }
      setMessages(prev => [...prev, { role: 'assistant', content: connErr[lang] }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className={`fixed bottom-6 z-50 ${isRTL ? 'left-6' : 'right-6'}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Button
              size="lg"
              className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 hover:shadow-xl cursor-pointer"
              onClick={() => setIsOpen(true)}
              aria-label="Open HireNova chatbot"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed bottom-6 z-50 ${isRTL ? 'left-6' : 'right-6'}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={`w-[340px] sm:w-[380px] h-[500px] flex flex-col shadow-2xl rounded-2xl overflow-hidden border ${isRTL ? 'font-sans' : ''}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5" aria-hidden="true" />
                  <span className="font-semibold text-sm">HireNova Assistant</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 rounded-lg p-1 cursor-pointer"
                  aria-label="Close chatbot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Toggle — 3 tabs */}
              <div className="flex border-b" role="tablist" aria-label="Chatbot mode">
                {MODE_TABS.map((tab) => (
                  <button
                    key={tab.mode}
                    role="tab"
                    aria-selected={mode === tab.mode}
                    aria-controls={`chatbot-panel-${tab.mode}`}
                    onClick={() => { setMode(tab.mode); setMessages([]) }}
                    className={`flex-1 py-2 text-xs font-medium cursor-pointer transition-colors ${
                      mode === tab.mode
                        ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50'
                        : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    {tab.icon} {t(lang, tab.labelKey)}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                id={`chatbot-panel-${mode}`}
                role="tabpanel"
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20"
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-line ${
                        msg.role === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-md'
                          : 'bg-white border shadow-sm rounded-bl-md'
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-3.5 h-3.5" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                    </div>
                    <div className="bg-white border rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 border-t bg-white">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend() }}
                  className="flex gap-2"
                >
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholderText[lang]}
                    className="flex-1 text-sm rounded-full"
                    disabled={isLoading}
                    aria-label="Chat message input"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="rounded-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}