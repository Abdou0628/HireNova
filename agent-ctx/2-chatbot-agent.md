# Task 2 — Chatbot Advanced Agent

## Task
Rebuild the HireNova Advanced Chatbot with 3 aspects (volets) in 4 languages (FR/EN/AR/ES).

## Work Done

### Backend (`src/app/api/chatbot/route.ts`)
- Replaced 2-mode (advisor/support) system with 3-mode (advisor/support/products)
- Created comprehensive knowledge base (KB_PRODUCTS) for ALL 13 HireNova modules in 4 languages:
  1. HireNova CV, 2. HireNova ATS, 3. HireNova Jobs, 4. HireNova Global, 5. HireNova Mobilité, 6. HireNova API
  7. HireNova LinkedIn, 8. HireNova Recruiter, 9. HireNova Career, 10. HireNova Coach, 11. HireNova Formation, 12. HireNova Freelance, 13. HireNova Interview
- Implemented count-based language detection (Arabic script → ar, then EN/ES/FR scoring)
- Added multilingual rule-based responses for all common module queries (Global, Mobilité, CV, ATS, Jobs, API, LinkedIn, Recruiter, Career, Coach, Formation, Freelance, Interview, Pricing, Greetings)
- Created mode-specific system prompts (MODE_PROMPTS) in all 4 languages
- Maintained 3-tier response system: rules → LLM (ZAI SDK with `await ZAI.create()`) → fallback
- All error/fallback/invalid messages localized in 4 languages
- Response includes `lang` field for frontend reference

### Frontend (`src/components/chatbot/chatbot-widget.tsx`)
- Added 3rd tab for "Produits" mode with i18n translations (chatbotModeProducts, chatbotProductsTitle)
- Integrated with `useCVStore` for current language, using `t(lang, key)` for all text
- RTL support for Arabic: `dir="rtl"` on chat window, position flipped (left/right)
- ARIA accessibility: role="tablist", role="tab", aria-selected, aria-label, aria-controls
- Multilingual welcome messages, placeholder text, and error messages
- Proper typing: `ChatMode = 'advisor' | 'support' | 'products'`
- Messages use `whitespace-pre-line` for proper markdown-like formatting

## Results
- All 4 languages detected and responded correctly (FR, EN, AR, ES)
- All 3 modes working (advisor, support, products)
- Rule-based responses for 14+ query patterns in 4 languages
- LLM fallback working with `await ZAI.create()`
- ESLint clean, no errors
- Dev server compiles and runs successfully
