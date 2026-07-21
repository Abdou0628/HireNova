import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { GeneratedCoverLetter } from '@/store/cv-store'

const FREE_CL_MONTHLY_LIMIT = 2

async function checkCLLimit(userId?: string): Promise<{ allowed: boolean; remaining: number }> {
  if (!userId) return { allowed: true, remaining: FREE_CL_MONTHLY_LIMIT }
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) return { allowed: true, remaining: FREE_CL_MONTHLY_LIMIT }
  if (user.plan === 'pro' || user.plan === 'lifetime') return { allowed: true, remaining: Infinity }
  const currentMonth = new Date().getMonth()
  if (user.lastResetMonth !== currentMonth) {
    await db.user.update({ where: { id: userId }, data: { clCountThisMonth: 0, lastResetMonth: currentMonth } })
    return { allowed: true, remaining: FREE_CL_MONTHLY_LIMIT }
  }
  const remaining = FREE_CL_MONTHLY_LIMIT - user.clCountThisMonth
  return { allowed: remaining > 0, remaining }
}

const langMap: Record<string, string> = {
  fr: 'français',
  en: 'anglais',
  ar: 'arabe',
  es: 'espagnol',
}

const langInstructions: Record<string, string> = {
  fr: `Rédige la lettre de motivation entièrement en français. Utilise le vouvoiement. Le style doit être professionnel, persuasif et adapté au ton demandé.`,
  en: `Write the entire cover letter in English. Use a professional, persuasive style adapted to the requested tone.`,
  ar: `اكتب رسالة الدافع بالكامل باللغة العربية. استخدم أسلوباً احترافياً ومقنعاً ومناسباً للنبرة المطلوبة.`,
  es: `Escribe la carta de motivación completa en español. Usa un estilo profesional y persuasivo adaptado al tono solicitado.`,
}

const toneMap: Record<string, Record<string, string>> = {
  fr: {
    'formal': 'Ton très formel et respectueux, style administratif classique',
    'semi-formal': 'Ton professionnel mais chaleureux, style moderne et courant dans le monde de l\'entreprise',
    'dynamic': 'Ton enthousiaste et dynamique, montre de l\'énergie et de la passion pour le poste',
  },
  en: {
    'formal': 'Very formal and respectful tone, classic business style',
    'semi-formal': 'Professional yet warm tone, modern corporate style',
    'dynamic': 'Enthusiastic and dynamic tone, shows energy and passion for the role',
  },
  ar: {
    'formal': 'نبرة رسمية جداً ومحترمة، أسلوب أعمال كلاسيكي',
    'semi-formal': 'نبرة مهنية ودافئة، أسلوب أعمال حديث',
    'dynamic': 'نبرة متحمسة وديناميكية، تظهر الحماس والشغف للوظيفة',
  },
  es: {
    'formal': 'Tono muy formal y respetuoso, estilo empresarial clásico',
    'semi-formal': 'Tono profesional pero cálido, estilo corporativo moderno',
    'dynamic': 'Tono entusiasta y dinámico, muestra energía y pasión por el puesto',
  },
}

export async function POST(request: globalThis.Request) {
  try {
    const body = await request.json()
    const {
      fullName,
      email,
      phone,
      location,
      companyName,
      hiringManager,
      jobTitle,
      jobReference,
      whyCompany,
      keyStrengths,
      tone,
      additionalNotes,
      language,
      // Raw CV input (fallback)
      cvExperience,
      cvEducation,
      cvSkills,
      cvSoftSkills,
      // Structured generated CV (richer data)
      generatedCVSummary,
      generatedCVExperience,
      generatedCVEducation,
      generatedCVSkills,
      generatedCVLanguages,
    } = body

    // Check usage limit
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id as string | undefined
    const clUsage = await checkCLLimit(userId)
    if (!clUsage.allowed) {
      return NextResponse.json(
        { error: `Limite mensuelle atteinte (${FREE_CL_MONTHLY_LIMIT} lettres). Passez au plan Pro.`, code: 'LIMIT_REACHED' },
        { status: 403 }
      )
    }

    if (!fullName || !email || !companyName || !jobTitle) {
      return NextResponse.json(
        { error: 'Informations manquantes' },
        { status: 400 }
      )
    }

    const langName = langMap[language] || 'français'
    const langInstr = langInstructions[language] || langInstructions.fr
    const toneDesc = toneMap[language]?.[tone] || toneMap.fr['semi-formal'] || 'Ton professionnel'

    // Build CV context section - prefer structured generated CV over raw input
    const cvSections: string[] = []

    if (generatedCVSummary) {
      cvSections.push(`RÉSUMÉ PROFESSIONNEL DU CV GÉNÉRÉ :
${generatedCVSummary}`)
    }

    if (generatedCVExperience && generatedCVExperience.length > 0) {
      const expText = generatedCVExperience
        .map((e: { title: string; company: string; period: string; description: string }) =>
          `- ${e.title} chez ${e.company} (${e.period}) : ${e.description}`)
        .join('\n')
      cvSections.push(`EXPÉRIENCES PROFESSIONNELLES DU CV GÉNÉRÉ :
${expText}`)
    } else if (cvExperience) {
      cvSections.push(`EXPÉRIENCE PROFESSIONNELLE DU CANDIDAT :\n${cvExperience}`)
    }

    if (generatedCVEducation && generatedCVEducation.length > 0) {
      const eduText = generatedCVEducation
        .map((e: { degree: string; school: string; period: string; description: string }) =>
          `- ${e.degree} à ${e.school} (${e.period}) : ${e.description}`)
        .join('\n')
      cvSections.push(`FORMATIONS DU CV GÉNÉRÉ :
${eduText}`)
    } else if (cvEducation) {
      cvSections.push(`FORMATION DU CANDIDAT :\n${cvEducation}`)
    }

    if (generatedCVSkills && generatedCVSkills.length > 0) {
      cvSections.push(`COMPÉTENCES DU CV GÉNÉRÉ : ${generatedCVSkills.join(', ')}`)
    } else if (cvSkills) {
      cvSections.push(`COMPÉTENCES DU CANDIDAT :\n${cvSkills}`)
    }

    if (generatedCVLanguages && generatedCVLanguages.length > 0) {
      const langText = generatedCVLanguages
        .map((l: { name: string; level: string }) => `${l.name} (${l.level})`)
        .join(', ')
      cvSections.push(`LANGUES DU CANDIDAT : ${langText}`)
    }

    if (cvSoftSkills && !generatedCVSummary) {
      cvSections.push(`SOFT SKILLS DU CANDIDAT :\n${cvSoftSkills}`)
    }

    const cvContext = cvSections.length > 0 ? `\nCONTEXTE DU CV DU CANDIDAT :\n${cvSections.join('\n\n')}` : ''

    const prompt = `Tu es un expert en rédaction de lettres de motivation et un coach de carrière. Tu dois créer une lettre de motivation exceptionnelle et personnalisée.

${langInstr}

Le ton demandé est : ${toneDesc}

INFORMATIONS DU CANDIDAT :
- Nom complet : ${fullName}
- Email : ${email}
${phone ? `- Téléphone : ${phone}` : ''}
${location ? `- Localisation : ${location}` : ''}

ENTREPRISE CIBLE :
- Entreprise : ${companyName}
${hiringManager ? `- Recruteur : ${hiringManager}` : ''}
- Poste visé : ${jobTitle}
${jobReference ? `- Référence de l'offre : ${jobReference}` : ''}

${cvContext}

${whyCompany ? `POURQUOI CETTE ENTREPRISE (selon le candidat) :
${whyCompany}
` : ''}
${keyStrengths ? `POINTS FORTS À METTRE EN AVANT :
${keyStrengths}
` : ''}
${additionalNotes ? `NOTES SUPPLÉMENTAIRES :
${additionalNotes}
` : ''}

INSTRUCTIONS DE FORMATAGE :
- Réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte avant ou après
- Structure le JSON exactement comme suit :
{
  "subject": "Objet : Candidature au poste de [Poste]",
  "greeting": "Madame, Monsieur,",
  "paragraphs": [
    "Paragraphe 1 : Introduction - annonce de la candidature et accroche (2-3 phrases)",
    "Paragraphe 2 : Pourquoi ce poste / cette entreprise - motivation et adéquation (3-4 phrases avec des éléments concrets)",
    "Paragraphe 3 : Compétences et expérience pertinentes - ce que le candidat apporte (3-4 phrases avec des résultats concrets)",
    "Paragraphe 4 : Conclusion - appel à l'action et disponibilité pour un entretien (2-3 phrases)"
  ],
  "signOff": "Je reste à votre disposition pour un entretien. Cordialement,"
}

RÈGLES :
- La lettre doit être personnalisée, pas générique
${generatedCVSummary ? '- UTILISE IMPÉRATIVEMENT les informations du CV fourni (expériences, formations, compétences) pour rendre la lettre très spécifique et convaincante\n' : '- Utilise des éléments concrets de l\'expérience du candidat quand ils sont disponibles\n'}- Adapte le ton exactement comme demandé : ${toneDesc}
- Le sujet doit inclure le nom du poste et idéalement la référence
- Le salutation doit être personnalisée si le nom du recruteur est fourni
- Si le nom du recruteur est fourni, utilise-le dans la salutation (ex: "Cher M. Dupont," ou "Dear Mr. Smith,")
- Chaque paragraphe doit être substantiel et convaincant
- La lettre doit donner envie au recruteur de rencontrer le candidat
- La langue de la lettre doit être : ${langName}`

    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content:
            'Tu es un expert en rédaction de lettres de motivation professionnelles. Tu produis uniquement du JSON valide, sans aucun texte supplémentaire.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      thinking: { type: 'disabled' },
    })

    let content = completion.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: 'Erreur lors de la génération de la lettre' },
        { status: 500 }
      )
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      content = jsonMatch[0]
    }

    let generatedLetter: GeneratedCoverLetter
    try {
      generatedLetter = JSON.parse(content)
    } catch {
      return NextResponse.json(
        { error: 'Erreur de format dans la réponse IA' },
        { status: 500 }
      )
    }

    // Save to database
    await db.coverLetter.create({
      data: {
        userId: userId || null,
        fullName,
        email,
        phone: phone || null,
        location: location || null,
        companyName,
        hiringManager: hiringManager || null,
        jobTitle,
        jobReference: jobReference || null,
        whyCompany: whyCompany || null,
        keyStrengths: keyStrengths || null,
        tone,
        additionalNotes: additionalNotes || null,
        language,
        generatedContent: JSON.stringify(generatedLetter),
      },
    })

    // Increment CL counter for free users
    if (userId && clUsage.remaining !== Infinity) {
      await db.user.update({
        where: { id: userId },
        data: { clCountThisMonth: { increment: 1 } },
      })
    }

    return NextResponse.json({ success: true, letter: generatedLetter })
  } catch (error) {
    console.error('Error generating cover letter:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
