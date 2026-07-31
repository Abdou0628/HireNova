import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'

async function ensureSeedData() {
  const count = await db.marketTrend.count()
  if (count === 0) {
    await db.marketTrend.createMany({ data: [
      { skill: 'Intelligence Artificielle', industry: 'Tech', growthRate: 34.5, demand: 'high', region: 'Europe' },
      { skill: 'Machine Learning', industry: 'Tech', growthRate: 28.2, demand: 'high', region: 'Europe' },
      { skill: 'Cybersécurité', industry: 'Tech', growthRate: 22.1, demand: 'high', region: 'Europe' },
      { skill: 'Cloud Computing', industry: 'Tech', growthRate: 19.8, demand: 'high', region: 'Amériques' },
      { skill: 'Data Science', industry: 'Tech', growthRate: 25.4, demand: 'high', region: 'Europe' },
      { skill: 'DevOps', industry: 'Tech', growthRate: 18.3, demand: 'medium', region: 'Amériques' },
      { skill: 'UX/UI Design', industry: 'Design', growthRate: 15.7, demand: 'medium', region: 'Europe' },
      { skill: 'Green Tech', industry: 'Énergie', growthRate: 31.2, demand: 'high', region: 'Europe' },
      { skill: 'ESG Compliance', industry: 'Finance', growthRate: 27.8, demand: 'high', region: 'Europe' },
      { skill: 'Blockchain', industry: 'Finance', growthRate: 8.4, demand: 'low', region: 'Amériques' },
      { skill: 'Marketing Digital', industry: 'Marketing', growthRate: 12.5, demand: 'medium', region: 'MENA' },
      { skill: 'E-commerce', industry: 'Commerce', growthRate: 20.3, demand: 'high', region: 'MENA' },
      { skill: 'Télémedicine', industry: 'Santé', growthRate: 26.7, demand: 'high', region: 'Europe' },
      { skill: 'Robotique Industrielle', industry: 'Industrie', growthRate: 16.9, demand: 'medium', region: 'Asie' },
    ] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { skill, industry, region, language } = await req.json()

    if (!skill || skill.trim().length === 0) {
      return NextResponse.json({ error: 'Skill is required' }, { status: 400 })
    }

    await ensureSeedData()

    // Fetch relevant trend data
    const trends = await db.marketTrend.findMany({
      where: {
        OR: [
          { skill: { contains: skill } },
          ...(industry ? [{ industry }] : []),
          ...(region ? [{ region }] : []),
        ],
      },
    })

    const lang = language || 'fr'
    const langMap: Record<string, string> = { fr: 'French', en: 'English', ar: 'Arabic', es: 'Spanish' }
    const responseLang = langMap[lang] || 'English'

    const systemPrompt = `You are HireNova IA INTELLIGENCE, an expert AI market analyst. You provide labor market forecasts, skill demand predictions, and career opportunity assessments. Respond in ${responseLang}. Always provide structured, data-driven insights.`

    const userPrompt = `Generate a detailed market intelligence forecast for the following:
- Target Skill: ${skill}
${industry ? `- Target Industry: ${industry}` : ''}
${region ? `- Target Region: ${region}` : ''}

Available market trend data:
${JSON.stringify(trends, null, 2)}

Please provide your analysis in the following JSON format (respond with JSON ONLY, no markdown):
{
  "outlook": "bullish|moderate|bearish",
  "careerScore": <number 0-100>,
  "skillDemandLevel": "very_high|high|medium|low",
  "insights": [
    "<insight 1>",
    "<insight 2>",
    "<insight 3>",
    "<insight 4>",
    "<insight 5>"
  ],
  "emergingRoles": ["<role1>", "<role2>", "<role3>"],
  "salaryTrend": "<description of expected salary trend>",
  "recommendation": "<personalized career recommendation>"
}`

    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    })

    const raw = completion.choices[0]?.message?.content || ''

    // Try to parse the JSON from the response
    let forecast
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      forecast = jsonMatch ? JSON.parse(jsonMatch[0]) : { outlook: 'moderate', careerScore: 65, skillDemandLevel: 'medium', insights: [raw], emergingRoles: [], salaryTrend: '', recommendation: raw }
    } catch {
      forecast = { outlook: 'moderate', careerScore: 65, skillDemandLevel: 'medium', insights: [raw], emergingRoles: [], salaryTrend: '', recommendation: raw }
    }

    return NextResponse.json({
      skill,
      industry,
      region,
      forecast,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[POST /api/intelligence/forecast]', error)
    return NextResponse.json({ error: 'Failed to generate forecast' }, { status: 500 })
  }
}
