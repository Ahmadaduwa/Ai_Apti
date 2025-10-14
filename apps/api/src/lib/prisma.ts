import { PrismaClient } from '@prisma/client'

// Ensure a single PrismaClient instance across hot reloads (ts-node-dev)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ log: ['error', 'warn'] })

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}


