import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV !== 'production' ? ['query'] : [],
  })

// Always cache the PrismaClient in globalThis to prevent memory leaks on hot-reload / server restart
globalForPrisma.prisma = db
