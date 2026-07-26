import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const KNOWLEDGE_BASE = `
Tu es l'assistant IA officiel de HireNova by E-Society 2050, la plateforme tout-en-un de recrutement et de carrière internationale.

ÉCOSYSTÈME HIRENOVA — 6 MODULES ACTIFS:

1. **HireNova CV** (Émeraude)
   - Génération de CV professionnels par IA en 60 secondes
   - 4 langues: Français, Anglais, Arabe, Espagnol
   - 3 templates: Moderne, Classique, Créatif
   - 6 personas: Étudiant, Diplômé, Professionnel, Cadre, Freelance, Expatrié
   - Export PDF + Word, sans watermark (plan Pro)
   - Accès: carte "HireNova CV" dans l'écosystème → formulaire CV

2. **HireNova ATS** (Émeraude)
   - Score de compatibilité ATS (Applicant Tracking System) sur 100
   - 4 catégories analysées: Mots-clés/SEO, Structure/Format, Impact de l'expérience, Complétude
   - Suggestions d'amélioration personnalisées
   - Le score ATS est calculé APRÈS génération du CV (étape Preview)
   - Accès: carte "HireNova ATS" → créez d'abord un CV, puis lancez l'analyse ATS depuis la page Preview

3. **HireNova Jobs** (Émeraude)
   - Marketplace d'offres d'emploi locales (Maroc et international)
   - Publiez des offres (employeur) ou postulez (candidat)
   - Dashboard employeur avec statistiques
   - Suivi des candidatures par le candidat
   - Accès: carte "HireNova Jobs" → marketplace des offres

4. **HireNova Global** (Teal) — RECRUTEMENT INTERNATIONAL
   - 40+ pays couverts sur 5 régions: Europe, Asie, Afrique, Amériques, MENA
   - Filtres avancés: région, pays, mot-clé
   - Badges Visa Sponsorship + Relocation Package + Remote
   - Dashboard employeur global avec stats par région
   - Publication d'offres internationales
   - Candidature internationale avec matching IA candidat/offre
   - Accès: carte "HireNova Global" → marketplace international
   - Régions: Europe (FR, UK, DE, CH, BE, ES, IT), Amériques (US, CA), Asie (JP, SG, AE), MENA (MA, EG, SA, QA), Afrique (MA, ZA, NG, KE)

5. **HireNova Mobilité** (Violet) — OCR + NLP PIPELINE
   - Étape 1: Upload CV (PDF/Image) → extraction OCR du texte brut
   - Étape 2: Analyse IA (LLM + NLP) → profil structuré (skills, expérience, éducation)
   - Étape 3: Reformulation automatique CV + lettre de motivation selon les standards du pays cible
   - Étape 4: Calcul du score de compatibilité + détection des skills gap
   - 12 pays supportés avec normes spécifiques:
     * France 🇫🇷: Photo obligatoire, 1-2 pages, sections ordonnées
     * UK 🇬🇧: Pas de photo, 2 pages max, compétences en premier
     * USA 🇺🇸: Pas de photo, 1 page recommandé, resume format
     * Canada 🇨🇦: Format UK, bilingue FR/EN valorisé
     * Allemagne 🇩🇪: Photo, Lebenslauf détaillé, références
     * UAE 🇦🇪: Pas de photo, format international, anglais
     * Suisse 🇨🇭: Photo optionnelle, format européen
     * Belgique 🇧🇪: Similaire France, photo recommandée
     * Espagne 🇪🇸: Photo, 2 pages, Europass compatible
     * Italie 🇮🇹: Photo, Curriculum Vitae Europass
     * Japon 🇯🇵: Format Rirekisho (photo, âge, détails personnels)
     * Australie 🇦🇺: Pas de photo, format UK, 2-3 pages
   - Accès: carte "HireNova Mobilité" → page d'accueil Mobilité

6. **HireNova API** (Sky)
   - Portail développeur REST
   - 4 endpoints: POST /api/external/cv/generate, POST /api/external/cl/generate, POST /api/external/ats/analyze, GET /api/external/usage
   - 3 plans: Starter (gratuit, 100 req/mois), Pro (29€/mois, 5000 req/mois), Enterprise (sur devis)
   - Clé API + dashboard de suivi de consommation
   - Accès: carte "HireNova API" → documentation API

TARIFICATION HIRENOVA:
- Gratuit: 3 CV/mois, watermark, fonctionnalités limitées
- Pro (6.99€/mois): CV illimités, lettres, score ATS, export PDF+Word, sans watermark
- Annuel (70€/an): Tout Pro + priorité support
- Lifetime: paiement unique, accès permanent

CONSEILS DE CARRIÈRE:
- Adaptez votre CV à chaque offre d'emploi
- Utilisez des mots-clés du poste pour passer les ATS
- Limitez à 2 pages maximum (sauf USA: 1 page)
- Mettez les compétences les plus pertinentes en premier
- Quantifiez vos réalisations (chiffres, pourcentages)

RÈGLES DE RÉPONSE:
- Tu réponds en français par défaut, mais tu peux répondre dans la langue de l'utilisateur (EN, AR, ES)
- Tu es professionnel, bienveillant, et concis (max 4-5 paragraphes)
- Quand on te demande comment fonctionne un module, explique le flux étape par étape
- Quand on te demande où accéder à un module, indique la carte correspondante dans l'écosystème
- Si on te demande quelque chose hors de ton domaine, redirige poliment vers les fonctionnalités de HireNova
`

// Rule-based fallback — answers common ecosystem questions without SDK
function ruleBasedResponse(message: string, mode: string): string | null {
  const q = message.toLowerCase().trim()

  // HireNova Global
  if (/global|international|visa|relocation|expatri|monde|pays/.test(q)) {
    if (mode === 'advisor') {
      return `🌍 **HireNova Global — Recrutement International**

HireNova Global est notre module de recrutement international couvrant 40+ pays sur 5 régions (Europe, Asie, Afrique, Amériques, MENA).

**Comment ça fonctionne :**
1. Cliquez sur la carte "HireNova Global" (couleur teal) dans l'écosystème
2. Filtrez par région, pays ou mot-clé
3. Repérez les badges : 🛂 Visa Sponsorship, 📦 Relocation Package, 🏠 Remote
4. Consultez le détail de l'offre puis postulez

**Pour les employeurs :** Dashboard global avec statistiques par région, publication d'offres internationales.

**Pour les candidats :** Matching IA entre votre profil et l'offre, candidature multilingue.`
    }
  }

  // HireNova Mobilité
  if (/mobilit|ocr|reformul|adapter.*cv|standard.*pays|pays cible/.test(q)) {
    return `✈️ **HireNova Mobilité — OCR + NLP Pipeline**

HireNova Mobilité adapte votre CV aux standards de chaque pays via un pipeline IA en 4 étapes :

1. **Upload** : Téléversez votre CV (PDF ou image)
2. **OCR** : Extraction automatique du texte brut
3. **Analyse IA (LLM+NLP)** : Structuration en profil (skills, expérience, éducation) + calcul du score de compatibilité avec le pays cible
4. **Reformulation** : CV + lettre de motivation automatiquement adaptés aux normes du pays

**12 pays supportés** : 🇫🇷 France, 🇬🇧 UK, 🇺🇸 USA, 🇨🇦 Canada, 🇩🇪 Allemagne, 🇦🇪 UAE, 🇨🇭 Suisse, 🇧🇪 Belgique, 🇪🇸 Espagne, 🇮🇹 Italie, 🇯🇵 Japon, 🇦🇺 Australie.

Accès : carte "HireNova Mobilité" (couleur violet) dans l'écosystème.`
  }

  // HireNova CV
  if (/^.*cv.*$/.test(q) && /comment|marche|fonction|cré|gener|fais/.test(q)) {
    return `📄 **HireNova CV — Générateur de CV IA**

Créez un CV professionnel en 60 secondes :

1. Cliquez sur la carte "HireNova CV" dans l'écosystème
2. Choisissez votre persona (Étudiant, Diplômé, Professionnel, Cadre, Freelance, Expatrié)
3. Sélectionnez un template (Moderne, Classique, Créatif) et la langue (FR/EN/AR/ES)
4. Remplissez le formulaire en 4 étapes : Identité, Expérience, Éducation, Compétences
5. L'IA génère votre CV optimisé en quelques secondes
6. Exportez en PDF ou Word (plan Pro)

**Gratuit** : 3 CV/mois. **Pro** : 6.99€/mois, CV illimités.`
  }

  // HireNova ATS
  if (/ats|score|compatibilité|tracking|applicant/.test(q)) {
    return `🎯 **HireNova ATS — Score de Compatibilité**

L'analyse ATS (Applicant Tracking System) évalue la compatibilité de votre CV avec les systèmes de tri automatique des recruteurs.

**Comment ça marche :**
1. Créez d'abord un CV (carte "HireNova CV")
2. Une fois sur la page Preview, cliquez sur "Analyse ATS"
3. Obtenez un score sur 100 avec 4 catégories :
   - 🎯 Mots-clés / SEO
   - 🛡️ Structure / Format
   - 📈 Impact de l'expérience
   - ✅ Complétude
4. Recevez des suggestions d'amélioration personnalisées

**Astuce** : visez un score > 80 pour passer les filtres ATS de la plupart des grandes entreprises.`
  }

  // HireNova Jobs
  if (/jobs|emploi|offre|marketplace|postul/.test(q) && !/global|international/.test(q)) {
    return `💼 **HireNova Jobs — Marketplace d'Emplois**

HireNova Jobs connecte candidats et employeurs au Maroc et à l'international.

**Candidats :**
- Parcourez les offres (carte "HireNova Jobs")
- Filtrez par type, lieu, mots-clés
- Postulez en un clic
- Suivez vos candidatures

**Employeurs :**
- Publiez des offres
- Dashboard avec statistiques
- Gérez les candidatures reçues

Accès : carte "HireNova Jobs" dans l'écosystème.`
  }

  // HireNova API
  if (/api|endpoint|developer|développeur|rest|intégr/.test(q)) {
    return `🔌 **HireNova API — Portail Développeur**

Intégrez les fonctionnalités HireNova dans vos applications via notre API REST.

**Endpoints disponibles :**
- \`POST /api/external/cv/generate\` — Générer un CV
- \`POST /api/external/cl/generate\` — Générer une lettre de motivation
- \`POST /api/external/ats/analyze\` — Analyser un score ATS
- \`GET /api/external/usage\` — Suivi de consommation

**Plans :**
- Starter : gratuit, 100 requêtes/mois
- Pro : 29€/mois, 5000 requêtes/mois
- Enterprise : sur devis

Accès : carte "HireNova API" dans l'écosystème → documentation + clé API.`
  }

  // Tarification
  if (/prix|tarif|coût|coute|combien|plan|gratuit|pro|lifetime|annuel/.test(q)) {
    return `💳 **Tarification HireNova**

**CV Generator :**
- Gratuit : 3 CV/mois, watermark
- Pro : 6.99€/mois — CV illimités, lettres, score ATS, export PDF+Word
- Annuel : 70€/an — Tout Pro + priorité support
- Lifetime : paiement unique, accès permanent

**API :**
- Starter : gratuit, 100 req/mois
- Pro : 29€/mois, 5000 req/mois
- Enterprise : sur devis`
  }

  // Help / bonjour
  if (/^(bonjour|salut|hello|hi|coucou|aide|help|comment.*marche|que.*peux.*tu)/.test(q)) {
    return `Bonjour ! 👋 Je suis l'assistant HireNova. Je peux vous renseigner sur :

🌍 **HireNova Global** — recrutement international (40+ pays)
✈️ **HireNova Mobilité** — OCR + adaptation CV par pays
📄 **HireNova CV** — génération de CV IA
🎯 **HireNova ATS** — score de compatibilité ATS
💼 **HireNova Jobs** — marketplace d'emplois
🔌 **HireNova API** — intégration développeur
💳 **Tarification** — plans et prix

Posez-moi votre question !`
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message = '', mode = 'advisor', conversationHistory = [] } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({
        success: true,
        response: 'Je n\'ai pas reçu de message valide. Pouvez-vous reformuler ?'
      })
    }

    // 1) Try rule-based answer first (instant, no SDK cost)
    const ruleAnswer = ruleBasedResponse(message, mode)
    if (ruleAnswer) {
      return NextResponse.json({ success: true, response: ruleAnswer, source: 'rules' })
    }

    // 2) Fallback to LLM via ZAI SDK
    try {
      const zai = ZAI.create()
      const systemPrompt = mode === 'advisor'
        ? KNOWLEDGE_BASE + '\n\nMode: CONSEILLER DE CARRIÈRE — Tu aides les utilisateurs avec leurs questions sur les fonctionnalités, la carrière, et l\'utilisation de HireNova.'
        : KNOWLEDGE_BASE + '\n\nMode: SUPPORT TECHNIQUE — Tu résous les problèmes techniques, bugs, facturation. Si nécessaire, informe que le support peut créer un ticket.'

      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...conversationHistory.slice(-10).map((m: any) => ({ role: m.role as string, content: m.content })),
        { role: 'user' as const, content: message }
      ]

      const res = await zai.chat.completions.create({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 600
      })

      const response = res.choices?.[0]?.message?.content?.trim()
      if (response) {
        return NextResponse.json({ success: true, response, source: 'llm' })
      }
    } catch (sdkErr) {
      console.error('[chatbot] SDK error:', sdkErr instanceof Error ? sdkErr.message : String(sdkErr))
    }

    // 3) Final graceful fallback — NEVER return "ERREUR"
    return NextResponse.json({
      success: true,
      response: `Je suis l'assistant HireNova. Voici ce que je peux vous aider à découvrir :

🌍 **HireNova Global** — recrutement international (40+ pays, visa, relocation)
✈️ **HireNova Mobilité** — OCR + adaptation CV aux standards de 12 pays
📄 **HireNova CV** — génération de CV IA en 60 secondes (FR/EN/AR/ES)
🎯 **HireNova ATS** — score de compatibilité ATS sur 100
💼 **HireNova Jobs** — marketplace d'offres d'emploi
🔌 **HireNova API** — portail développeur REST

Pour toute question précise sur l'un de ces modules, reformulez votre demande (ex : "Comment fonctionne HireNova Global ?").`,
      source: 'fallback'
    })
  } catch (error) {
    console.error('[chatbot] route error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({
      success: true,
      response: 'Je suis temporairement indisponible. Pouvez-vous reformuler votre question sur les modules HireNova (CV, ATS, Jobs, Global, Mobilité, API) ?'
    })
  }
}
