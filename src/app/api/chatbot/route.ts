import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const zai = ZAI.create()

const KNOWLEDGE_BASE = `
Tu es un assistant IA expert pour HireNova by E-Society 2050, une plateforme complète de recrutement et de carrière.

FONCTIONNALITÉS DE HIRENOVA:
1. HireNova CV — Génération de CV professionnels par IA en 60 secondes (4 langues: FR, EN, AR, ES)
2. HireNova Lettre de Motivation — Création de lettres personnalisées par IA
3. HireNova ATS — Score de compatibilité ATS avec suggestions d'amélioration
4. HireNova Jobs — Marketplace d'offres d'emploi (Maroc et international)
5. HireNova API — Portail développeur avec clé API, endpoints REST (cv/generate, cl/generate, ats/analyze, usage)
6. HireNova Global — Recrutement international (visa, relocation, multi-régions)
7. HireNova Mobilité — OCR + reformulation CV/CL selon standards pays cibles (France, UK, USA, Canada, Allemagne, UAE, Suisse, etc.)

PLANS ET TARIFICATION:
- Gratuit: 3 CV/mois, watermark, fonctionnalités limitées
- Pro (6.99€/mois): CV illimités, lettres, score ATS, export PDF+Word, sans watermark
- Annuel (70€/an): Tout Pro + priorité
- Lifetime: paiement unique, accès permanent

PIPELINE OCR + NLP POUR MOBILITÉ:
1. Upload CV (PDF/Image) → extraction OCR du texte brut
2. Analyse IA (LLM+NLP): compréhension du contenu, normalisation des données
3. Détection des compétences, création d'un profil structuré
4. Calcul du score de compatibilité avec les standards du pays cible
5. Reformulation automatique du CV et de la lettre de motivation

PAYS SUPPORTÉS PAR HIRENOVA MOBILITÉ:
- France 🇫🇷: Photo obligatoire, 1-2 pages, sections ordonnées
- UK 🇬🇧: Pas de photo, 2 pages max, compétences clés en premier
- USA 🇺🇸: Pas de photo, 1 page recommandé, resume format
- Canada 🇨🇦: Format similaire UK, bilingue FR/EN valorisé
- Allemagne 🇩🇪: Photo, Lebenslauf détaillé, references
- UAE 🇦🇪: Pas de photo, format international, anglais
- Suisse 🇨🇭: Photo optionnelle, format européen
- Belgique 🇧🇪: Similaire France, photo recommandée
- Espagne 🇪🇸: Photo, 2 pages, Europass compatible
- Italie 🇮🇹: Photo, Curriculum Vitae Europass
- Japon 🇯🇵: Format Rirekisho (photo, âge, détails personnels)

CONSEILS DE CARRIÈRE:
- Adaptez votre CV à chaque offre d'emploi
- Utilisez des mots-clés du poste pour passer les ATS
- Limitez à 2 pages maximum (sauf USA: 1 page)
- Mettez les compétences les plus pertinentes en premier
- Quantifiez vos réalisations (chiffres, pourcentages)

Tu réponds en français par défaut, mais tu peux répondre dans la langue de l'utilisateur si nécessaire.
Tu es professionnel, bienveillant, et concis.
Si on te demande quelque chose hors de ton domaine, redirige poliment vers les fonctionnalités de HireNova.
`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, mode = 'advisor', conversationHistory = [] } = body

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

    const response = res.choices?.[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.'
    return NextResponse.json({ success: true, response })
  } catch (error) {
    return NextResponse.json({ success: false, error: { code: 500, message: 'Erreur chatbot' } }, { status: 500 })
  }
}
