import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const SEED_TRENDS = [
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
]

async function ensureSeedData() {
  const count = await db.marketTrend.count()
  if (count === 0) {
    await db.marketTrend.createMany({ data: SEED_TRENDS })
  }
}

export async function GET(req: NextRequest) {
  try {
    await ensureSeedData()
    const { searchParams } = new URL(req.url)
    const industry = searchParams.get('industry') || ''
    const region = searchParams.get('region') || ''

    const where: Record<string, string> = {}
    if (industry && industry !== 'all') where.industry = industry
    if (region && region !== 'all') where.region = region

    const trends = await db.marketTrend.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { growthRate: 'desc' },
    })

    return NextResponse.json(trends)
  } catch (error) {
    console.error('[GET /api/intelligence/trends]', error)
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { industry, region, language } = body

    await ensureSeedData()

    const where: Record<string, string> = {}
    if (industry && industry !== 'all') where.industry = industry
    if (region && region !== 'all') where.region = region

    const trends = await db.marketTrend.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { growthRate: 'desc' },
    })

    const growing = trends.filter(t => t.growthRate > 15).map(t => t.skill)
    const declining = trends.filter(t => t.growthRate < 10).map(t => t.skill)
    const avgGrowth = trends.length > 0
      ? (trends.reduce((sum, t) => sum + t.growthRate, 0) / trends.length).toFixed(1)
      : 0
    const topSkill = trends[0]?.skill || 'N/A'
    const highDemandCount = trends.filter(t => t.demand === 'high').length

    const lang = language || 'fr'
    const analysisMap: Record<string, { growing: string; declining: string; summary: string }> = {
      fr: {
        growing: growing.length > 0 ? growing.join(', ') : 'Aucune compétence en forte croissance détectée.',
        declining: declining.length > 0 ? declining.join(', ') : 'Aucune compétence en déclin critique.',
        summary: `Analyse IA : ${trends.length} tendances analysées. Croissance moyenne de ${avgGrowth}%. ${highDemandCount} compétences en forte demande. La compétence la plus dynamique est ${topSkill}.`
      },
      en: {
        growing: growing.length > 0 ? growing.join(', ') : 'No strongly growing skills detected.',
        declining: declining.length > 0 ? declining.join(', ') : 'No critically declining skills.',
        summary: `AI Analysis: ${trends.length} trends analyzed. Average growth of ${avgGrowth}%. ${highDemandCount} skills in high demand. The most dynamic skill is ${topSkill}.`
      },
      ar: {
        growing: growing.length > 0 ? growing.join('، ') : 'لم يتم اكتشاف مهارات متنامية بقوة.',
        declining: declining.length > 0 ? declining.join('، ') : 'لا توجد مهارات متراجعة بشكل حرج.',
        summary: `تحليل الذكاء الاصطناعي: تم تحليل ${trends.length} اتجاه. متوسط النمو ${avgGrowth}%. ${highDemandCount} مهارات عالية الطلب. المهارة الأكثر ديناميكية هي ${topSkill}.`
      },
      es: {
        growing: growing.length > 0 ? growing.join(', ') : 'No se detectaron habilidades en fuerte crecimiento.',
        declining: declining.length > 0 ? declining.join(', ') : 'Sin habilidades en declive crítico.',
        summary: `Análisis IA: ${trends.length} tendencias analizadas. Crecimiento medio de ${avgGrowth}%. ${highDemandCount} habilidades en alta demanda. La habilidad más dinámica es ${topSkill}.`
      },
    }

    const analysis = analysisMap[lang] || analysisMap.fr

    return NextResponse.json({
      trends,
      analysis,
      meta: { totalTrends: trends.length, avgGrowth, topSkill, highDemandCount },
    })
  } catch (error) {
    console.error('[POST /api/intelligence/trends]', error)
    return NextResponse.json({ error: 'Failed to analyze trends' }, { status: 500 })
  }
}
