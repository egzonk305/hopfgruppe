import { PrismaClient } from '../generated/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }

  if (process.env.VERCEL === '1') {
    throw new Error('DATABASE_URL muss fuer Turso/Vercel gesetzt sein.')
  }

  return 'file:./prisma/dev.db'
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaLibSql({
    url: getDatabaseUrl(),
    authToken: process.env.DATABASE_AUTH_TOKEN,
  })

  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
