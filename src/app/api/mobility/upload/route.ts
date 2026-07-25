import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

const zai = ZAI.create()

// Skills mapped to common target countries for simulation
const SKILLS_BY_COUNTRY: Record<string, string[]> = {
  France: ['Management de projet', 'Communication interculturelle', 'Analyse de données', 'Collaboration en équipe', 'Résolution de problèmes', 'Planification stratégique'],
  UK: ['Project Management', 'Data Analysis', 'Team Leadership', 'Stakeholder Management', 'Problem Solving', 'Strategic Planning'],
  USA: ['Project Management', 'Data-Driven Decision Making', 'Cross-Functional Leadership', 'Agile Methodologies', 'Strategic Communication', 'Process Optimization'],
  Canada: ['Gestion de projets', 'Analytique de données', 'Bilinguisme FR/EN', 'Leadership d\'équipe', 'Adaptabilité interculturelle', 'Résolution de problèmes'],
  Germany: ['Projektmanagement', 'Datenanalyse', 'Teamführung', 'Problemlösung', 'Prozessoptimierung', 'Kommunikationsstärke'],
  UAE: ['Project Management', 'Stakeholder Management', 'Cross-Cultural Communication', 'Data Analysis', 'Strategic Planning', 'Adaptability'],
  Suisse: ['Gestion de projets', 'Analyse de données', 'Multilinguisme', 'Rigueur analytique', 'Leadership', 'Conformité réglementaire'],
  Belgique: ['Gestion de projets', 'Analyse de données', 'Communication multilingue', 'Collaboration', 'Planification', 'Résolution de problèmes'],
  Espagne: ['Gestión de proyectos', 'Análisis de datos', 'Liderazgo', 'Comunicación intercultural', 'Resolución de problemas', 'Planificación estratégica'],
  Italie: ['Gestione progetti', 'Analisi dati', 'Leadership', 'Comunicazione', 'Risoluzione problemi', 'Pianificazione strategica'],
  Japan: ['Project Management', 'Data Analysis', 'Team Coordination', 'Process Improvement', 'Cross-Cultural Communication', 'Attention to Detail'],
}

const COMMON_ROLES: Record<string, string[]> = {
  France: ['Chef de Projet Digital', 'Ingénieur Logiciel', 'Analyste Business', 'Chef de Produit'],
  UK: ['Project Manager', 'Software Engineer', 'Business Analyst', 'Product Manager'],
  USA: ['Product Manager', 'Software Engineer', 'Data Scientist', 'Program Manager'],
  Canada: ['Gestionnaire de Projets', 'Développeur Logiciel', 'Analyste d\'Affaires', 'Chef de Produit'],
  Germany: ['Projektmanager', 'Software Entwickler', 'Business Analyst', 'Produktmanager'],
  UAE: ['Project Manager', 'Business Development Manager', 'IT Consultant', 'Operations Manager'],
  Suisse: ['Chef de Projet', 'Ingénieur Software', 'Analyste Business', 'Responsable Produit'],
  Belgique: ['Project Manager', 'Business Analyst', 'IT Manager', 'Consultant'],
  Espagne: ['Director de Proyectos', 'Ingeniero de Software', 'Analista de Negocio', 'Product Manager'],
  Italie: ['Project Manager', 'Ingegnere Software', 'Business Analyst', 'Product Manager'],
  Japan: ['プロジェクトマネージャー', 'ソフトウェアエンジニア', 'ビジネスアナリスト', 'プロダクトマネージャー'],
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const targetCountry = (formData.get('targetCountry') as string) || 'France'
    const fullName = (formData.get('fullName') as string) || ''
    const email = (formData.get('email') as string) || ''

    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, error: { code: 400, message: 'Nom complet et email sont requis' } },
        { status: 400 }
      )
    }

    if (!targetCountry) {
      return NextResponse.json(
        { success: false, error: { code: 400, message: 'Pays cible est requis' } },
        { status: 400 }
      )
    }

    // Simulate OCR extraction - generate realistic mock data
    const firstName = fullName.split(' ')[0] || 'Candidat'
    const lastName = fullName.split(' ').slice(1).join(' ') || 'Demo'

    const skills = SKILLS_BY_COUNTRY[targetCountry] || SKILLS_BY_COUNTRY['France']
    const roles = COMMON_ROLES[targetCountry] || COMMON_ROLES['France']
    const targetRole = roles[Math.floor(Math.random() * roles.length)]

    const extractedProfile = {
      fullName: fullName,
      email: email,
      phone: '+212 6' + Math.floor(10000000 + Math.random() * 90000000).toString(),
      location: 'Casablanca, Maroc',
      nationality: 'Marocaine',
      dateOfBirth: '1990-05-15',
      targetRole: targetRole,
      targetCountry: targetCountry,
      summary: `Professionnel dynamique et motivé avec une solide expérience en ${targetRole.toLowerCase()}, recherche une opportunité internationale en ${targetCountry}. Compétent en gestion de projets et analyse de données, avec une forte capacité d'adaptation interculturelle.`,
      experience: [
        {
          title: roles[0],
          company: 'Tech Solutions SARL',
          location: 'Casablanca, Maroc',
          startDate: '2021-01',
          endDate: 'Present',
          description: `Responsable de la gestion et de l'exécution de projets stratégiques. Coordination des équipes multidisciplinaires et reporting aux parties prenantes.`,
        },
        {
          title: roles[1] || roles[0],
          company: 'Digital Agency MA',
          location: 'Rabat, Maroc',
          startDate: '2018-06',
          endDate: '2020-12',
          description: `Participation active au développement et au déploiement de solutions innovantes. Collaboration avec les clients internationaux.`,
        },
      ],
      education: [
        {
          degree: 'Master',
          field: 'Informatique et Gestion',
          institution: 'Université Hassan II',
          year: '2018',
        },
      ],
      languages: [
        { name: 'Français', level: 'C1' },
        { name: 'Anglais', level: 'B2' },
        { name: 'Arabe', level: 'Natif' },
      ],
      skills: skills,
      certifications: ['PMP', 'AWS Cloud Practitioner', 'Scrum Master'],
    }

    // Use ZAI to generate a brief skills analysis
    let skillsAnalysis = 'Analyse en cours de traitement...'

    try {
      const analysisPrompt = `Analyse brièvement le profil suivant pour une mobilité vers ${targetCountry}. 
Identifie les forces principales et les compétences à valoriser.

Profil: ${fullName}
Compétences: ${skills.join(', ')}
Rôle cible: ${targetRole}
Pays d'origine: Maroc
Pays cible: ${targetCountry}

Réponds en 3-4 phrases maximum, en français, de manière concise et professionnelle.`

      const res = await zai.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'Tu es un expert en mobilité internationale et recrutement. Sois concis et professionnel.' },
          { role: 'user', content: analysisPrompt },
        ],
        temperature: 0.5,
        max_tokens: 200,
      })

      skillsAnalysis = res.choices?.[0]?.message?.content || skillsAnalysis
    } catch (aiError) {
      console.error('AI skills analysis failed:', aiError)
      skillsAnalysis = `Profil de ${fullName} avec des compétences solides en ${skills.slice(0, 3).join(', ')}. Potentiel prometteur pour le marché ${targetCountry}.`
    }

    // Store in DB
    const profile = await db.mobilityProfile.create({
      data: {
        fullName,
        email,
        originCountry: 'Maroc',
        targetCountry,
        targetRole,
        extractedText: `[Simulated OCR extraction for ${file?.name || 'uploaded document'}]`,
        structuredData: JSON.stringify(extractedProfile),
        skills: JSON.stringify(skills),
        status: 'completed',
      },
    })

    return NextResponse.json({
      success: true,
      profile: {
        ...extractedProfile,
        skillsAnalysis,
      },
      profileId: profile.id,
    })
  } catch (error) {
    console.error('Error in mobility upload:', error)
    return NextResponse.json(
      { success: false, error: { code: 500, message: 'Erreur lors du traitement du document' } },
      { status: 500 }
    )
  }
}
