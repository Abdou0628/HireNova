import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const SEED_SALARIES = [
  { jobTitle: 'Développeur Full-Stack', industry: 'Tech', location: 'Paris, France', salaryMin: 38000, salaryAvg: 52000, salaryMax: 70000, currency: 'EUR', source: 'HireNova Intelligence' },
  { jobTitle: 'Data Scientist', industry: 'Tech', location: 'Paris, France', salaryMin: 42000, salaryAvg: 58000, salaryMax: 85000, currency: 'EUR', source: 'HireNova Intelligence' },
  { jobTitle: 'Ingénieur IA', industry: 'Tech', location: 'Paris, France', salaryMin: 50000, salaryAvg: 70000, salaryMax: 100000, currency: 'EUR', source: 'HireNova Intelligence' },
  { jobTitle: 'Designer UX/UI', industry: 'Design', location: 'Lyon, France', salaryMin: 32000, salaryAvg: 42000, salaryMax: 58000, currency: 'EUR', source: 'HireNova Intelligence' },
  { jobTitle: 'Chef de Projet Digital', industry: 'Tech', location: 'Bordeaux, France', salaryMin: 40000, salaryAvg: 55000, salaryMax: 75000, currency: 'EUR', source: 'HireNova Intelligence' },
  { jobTitle: 'DevOps Engineer', industry: 'Tech', location: 'Londres, UK', salaryMin: 45000, salaryAvg: 65000, salaryMax: 95000, currency: 'EUR', source: 'HireNova Intelligence' },
  { jobTitle: 'Analyste Cybersécurité', industry: 'Tech', location: 'Munich, Germany', salaryMin: 48000, salaryAvg: 62000, salaryMax: 88000, currency: 'EUR', source: 'HireNova Intelligence' },
  { jobTitle: 'Marketing Manager', industry: 'Marketing', location: 'Madrid, Spain', salaryMin: 30000, salaryAvg: 45000, salaryMax: 65000, currency: 'EUR', source: 'HireNova Intelligence' },
  { jobTitle: 'Consultant ESG', industry: 'Finance', location: 'Paris, France', salaryMin: 45000, salaryAvg: 65000, salaryMax: 90000, currency: 'EUR', source: 'HireNova Intelligence' },
  { jobTitle: 'Ingénieur Green Tech', industry: 'Énergie', location: 'Berlin, Germany', salaryMin: 42000, salaryAvg: 58000, salaryMax: 80000, currency: 'EUR', source: 'HireNova Intelligence' },
  { jobTitle: 'Product Owner', industry: 'Tech', location: 'Casablanca, Morocco', salaryMin: 150000, salaryAvg: 240000, salaryMax: 380000, currency: 'MAD', source: 'HireNova Intelligence' },
  { jobTitle: 'Développeur Mobile', industry: 'Tech', location: 'Dubai, UAE', salaryMin: 180000, salaryAvg: 300000, salaryMax: 480000, currency: 'AED', source: 'HireNova Intelligence' },
  { jobTitle: 'Médecin Télémedicine', industry: 'Santé', location: 'Paris, France', salaryMin: 60000, salaryAvg: 85000, salaryMax: 120000, currency: 'EUR', source: 'HireNova Intelligence' },
  { jobTitle: 'Chef de Produit E-commerce', industry: 'Commerce', location: 'Riyad, Saudi Arabia', salaryMin: 200000, salaryAvg: 350000, salaryMax: 500000, currency: 'SAR', source: 'HireNova Intelligence' },
  { jobTitle: 'Data Engineer', industry: 'Tech', location: 'Amsterdam, Netherlands', salaryMin: 44000, salaryAvg: 60000, salaryMax: 82000, currency: 'EUR', source: 'HireNova Intelligence' },
  { jobTitle: 'Scrum Master', industry: 'Tech', location: 'Bruxelles, Belgium', salaryMin: 40000, salaryAvg: 55000, salaryMax: 72000, currency: 'EUR', source: 'HireNova Intelligence' },
]

async function ensureSeedData() {
  const count = await db.salaryBenchmark.count()
  if (count === 0) {
    await db.salaryBenchmark.createMany({ data: SEED_SALARIES })
  }
}

export async function GET(req: NextRequest) {
  try {
    await ensureSeedData()
    const { searchParams } = new URL(req.url)
    const query = (searchParams.get('q') || '').toLowerCase().trim()

    let results
    if (query) {
      results = await db.salaryBenchmark.findMany({
        where: {
          OR: [
            { jobTitle: { contains: query } },
            { industry: { contains: query } },
            { location: { contains: query } },
          ],
        },
      })
    } else {
      results = await db.salaryBenchmark.findMany({
        orderBy: { salaryAvg: 'desc' },
        take: 20,
      })
    }

    // Compute global salary index
    const all = await db.salaryBenchmark.findMany()
    const avgGlobal = all.length > 0
      ? Math.round(all.reduce((sum, s) => sum + s.salaryAvg, 0) / all.length)
      : 0

    return NextResponse.json({ results, avgGlobal })
  } catch (error) {
    console.error('[GET /api/intelligence/salary]', error)
    return NextResponse.json({ error: 'Failed to fetch salary data' }, { status: 500 })
  }
}
